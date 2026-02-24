import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { useAddressContext } from "../utils/AddressContext";
import { getRequest, postRequest, putRequest } from "../ApiService/apiHelper";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
import { CartContext } from "./CartContext";
import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import SlotSelectionModal from "./SlotSelectionModal";
import "./checkout.css";
import AddressPickerModal from "../components/AddressPickerModal";
import { payWithRazorpay } from "../payments/payWithRazorpay";

const getStoredUser = () => {
  try {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("getStoredUser parse error", e);
    return null;
  }
};

// ---------- Time helpers (slot validation) ----------
const parseSlotToMoment = (slotDate, slotTime) => {
  try {
    if (!slotDate || !slotTime) return null;

    // slotDate from API/your state is "YYYY-MM-DD"
    // slotTime is like "11:00 AM"
    return moment(`${slotDate} ${slotTime}`, "YYYY-MM-DD hh:mm A", true);
  } catch (e) {
    console.error("parseSlotToMoment error:", e);
    return null;
  }
};

const isSameDay = (dateA, dateB) => {
  try {
    return moment(dateA).isSame(moment(dateB), "day");
  } catch {
    return false;
  }
};

const filterSlotsTwoHoursAhead = (slotDate, slots = []) => {
  try {
    if (!Array.isArray(slots)) return [];

    // Only apply 2hr rule for TODAY
    const today = moment();
    const isToday = isSameDay(slotDate, today);

    if (!isToday) return slots; // future dates: no filtering

    const cutoff = moment().add(2, "hours"); // ✅ 2 hours ahead

    // Keep only slots >= cutoff
    return slots.filter((t) => {
      const m = parseSlotToMoment(slotDate, t);
      return m && m.isSameOrAfter(cutoff);
    });
  } catch (e) {
    console.error("filterSlotsTwoHoursAhead error:", e);
    return slots || [];
  }
};

const Checkout = () => {
  const location = useLocation();
  const { serviceType } = location.state || {};
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const userId = currentUser?._id;

  // Get selected address from sessionStorage
  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const addr = sessionStorage.getItem("selectedAddress");
      return addr ? JSON.parse(addr) : null;
    } catch (e) {
      console.error("Error parsing selectedAddress", e);
      return null;
    }
  });

  // Get selected slot from sessionStorage
  const [selectedSlot, setSelectedSlot] = useState(() => {
    try {
      const slot = sessionStorage.getItem("selectedSlots");
      return slot ? JSON.parse(slot) : null;
    } catch (e) {
      console.error("Error parsing selectedSlots", e);
      return null;
    }
  });

  const { setAddressDataContext } = useAddressContext();
  const { cartItems, updateCartItem } = useContext(CartContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [addressPickerCfg, setAddressPickerCfg] = useState({
    address: "",
    houseNumber: "",
    landmark: "",
    lat: null,
    lng: null,
    city: "",
  });

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [priceConfig, setPriceConfig] = useState(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showPaintingConfirm, setShowPaintingConfirm] = useState(false);
  const [deepCleaningPackageValues, setDeepCleaningPackageValues] =
    useState(null);
  const [slotWarning, setSlotWarning] = useState("");

  // Function to clear selected slot when address is changed
  const clearSelectedSlot = () => {
    sessionStorage.removeItem("selectedSlots");
    setSelectedSlot(null);
    setSlotWarning("Please select a new time slot for the updated address");
  };

  // Monitor address changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "selectedAddress") {
        try {
          const newAddress = e.newValue ? JSON.parse(e.newValue) : null;
          const oldAddress = selectedAddress;

          // If address changed and we have a selected slot, clear the slot
          if (
            selectedSlot &&
            newAddress?.uniqueCode !== oldAddress?.uniqueCode
          ) {
            clearSelectedSlot();
          }

          setSelectedAddress(newAddress);
        } catch (error) {
          console.error("Error handling storage change:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check on component mount
    const currentAddress = JSON.parse(
      sessionStorage.getItem("selectedAddress") || "null",
    );
    if (
      selectedSlot &&
      currentAddress?.uniqueCode !== selectedAddress?.uniqueCode
    ) {
      clearSelectedSlot();
    }

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedSlot, selectedAddress]);

  const fetchUserAddress = async (userId) => {
    try {
      if (!userId) return null;

      const response = await getRequest(
        `${API_ENDPOINTS.GET_ADDRESS}${userId}`,
      );

      const addressData = response?.address || response?.savedAddress;

      if (addressData) {
        const addrObj = {
          uniqueCode:
            addressData.uniqueCode ||
            `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          address: addressData.address,
          houseNumber: addressData.houseNumber || "",
          landmark: addressData.landmark || "",
          latitude: Number(addressData.latitude),
          longitude: Number(addressData.longitude),
          city: addressData.city || "",
        };

        setAddressDataContext(addrObj);
        sessionStorage.setItem("selectedAddress", JSON.stringify(addrObj));
        setSelectedAddress(addrObj);
        return addrObj;
      }

      return null;
    } catch (error) {
      console.error("fetchUserAddress error:", error?.response || error);
      return null;
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUserAddress(userId);
  }, [userId]);

  const getLatLngFromSelectedAddress = () => {
    try {
      const lat = Number(selectedAddress?.latitude);
      const lng = Number(selectedAddress?.longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { lat, lng };
    } catch (e) {
      console.error("getLatLngFromSelectedAddress error:", e);
      return null;
    }
  };

  const mapServicesForSlots = (items = []) => {
    try {
      return (items || []).map((it) => ({
        name: it?.name || "N/A",
        price: Number(it?.price || 0),
        quantity: Number(it?.quantity || 1),
        service: it?.service || "N/A",
        duration: Number(it?.duration || 0),
        teamMembers: Number(it?.teamMembers || 0),
      }));
    } catch (e) {
      console.error("mapServicesForSlots error:", e);
      return [];
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const loc = getLatLngFromSelectedAddress();
      if (!loc) {
        console.warn("No lat/lng available in selectedAddress");
        return [];
      }

      if (!serviceType) {
        console.warn("serviceType missing in location.state");
        return [];
      }

      const basePayload = { serviceType, date, lat: loc.lat, lng: loc.lng };

      const payload =
        serviceType === "deep_cleaning"
          ? { ...basePayload, services: mapServicesForSlots(cartItems) }
          : basePayload;

      const res = await fetch(
        `${API_BASE_URL}/slots/website/get-available-slots`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!data?.success) {
        // console.warn("Slot API returned failure:", data);
        return [];
      }

      const allSlots = data?.slots || [];
      const filtered = filterSlotsTwoHoursAhead(date, allSlots);

      // console.log("Available slots raw:", allSlots);
      // console.log("Available slots (2hr ahead):", filtered);

      return filtered;
    } catch (err) {
      // console.error("fetchAvailableSlots error:", err);
      return [];
    }
  };

  const handleSaveAddressFromModal = async (payloadFromModal) => {
    try {
      const p = payloadFromModal || addressPickerCfg; // ✅ takes latest modal data

      const uniqueCode = `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const addressObj = {
        uniqueCode,
        address: p.address,
        houseNumber: p.houseNumber || "",
        landmark: p.landmark || "",
        latitude: Number(p.lat),
        longitude: Number(p.lng),
        city: p.city || "",
      };

      if (
        !Number.isFinite(addressObj.latitude) ||
        !Number.isFinite(addressObj.longitude)
      ) {
        alert("Please select a valid address from map/search.");
        return;
      }

      if (currentUser?._id) {
        const payload = { savedAddress: addressObj };
        await putRequest(
          `${API_ENDPOINTS.SAVE_ADDRESS}${currentUser._id}`,
          payload,
        );
      }

      setAddressDataContext(addressObj);

      // ✅ Update state + session storage (same tab updates immediately)
      sessionStorage.setItem("selectedAddress", JSON.stringify(addressObj));
      setSelectedAddress(addressObj);

      // ✅ Clear slot when address changes
      clearSelectedSlot();

      setShowAddress(false);
    } catch (error) {
      console.error("handleSaveAddressFromModal error:", error);
      alert(error?.message || "Failed to save address");
    }
  };

  const housePaintingcancellationsData = [
    {
      id: 1,
      title: "More than 3 hrs before the service",
      fee: "Free",
    },
    {
      id: 2,
      title: "Within 3 hrs of the service",
      fee: "100% of Cart Value",
    },
  ];

  const deepcleaingcancellationsData = [
    {
      id: 1,
      title: "More than 24 hrs before the service",
      fee: "Free",
    },
    {
      id: 2,
      title: "Within 24 hrs of the service",
      fee: "20% of Cart Value",
    },
  ];

  const handleOpenSlotModal = () => {
    setShowSlotModal(true);
  };

  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
  };

  const handleSelectSlot = (slot) => {
    sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
    setSelectedSlot(slot);
    setSlotWarning("");
    setShowSlotModal(false);
  };

  const checkEnquiry = () => {
    if (serviceType === "house_painting" && priceConfig?.siteVisitCharge > 0) {
      return false;
    } else if (serviceType === "deep_cleaning") {
      return false;
    }
    return true;
  };

  const result = cartItems.map((cartItem) => {
    const matchedPackage = deepCleaningPackageValues?.find(
      (pkg) => pkg.name === cartItem.name,
    );
    return {
      ...cartItem,
      bookingAmount: matchedPackage ? matchedPackage.bookingAmount : null,
    };
  });

  const advancedAmount = result.reduce((sum, item) => {
    return sum + (item.bookingAmount ? item.bookingAmount : 0);
  }, 0);

  const totalCartValueAmountDeepCleaning =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((acc, val) => acc + val.price * (val.quantity || 1), 0)
      : 0;

  const needToPay = Math.round(totalCartValueAmountDeepCleaning * 0.2);

  const RemaingAmountYetToPay =
    parseInt(totalCartValueAmountDeepCleaning) - parseInt(needToPay);

  const addPrice = () => {
    if (serviceType === "house_painting" && priceConfig?.siteVisitCharge > 0) {
      return priceConfig?.siteVisitCharge || 0;
    } else {
      return needToPay;
    }
  };

  const data = {
    customer: {
      customerId: currentUser?._id,
      phone: currentUser?.mobileNumber,
      name: currentUser?.userName,
    },
    service:
      serviceType === "house_painting"
        ? [
            {
              category: "House Painting",
              serviceName: "House Painters & Waterproofing",
              price: Number(priceConfig?.siteVisitCharge || 0),
              quantity: Number(1),
              coinsForVendor: Number(priceConfig?.vendorCoins || 0),
            },
          ]
        : cartItems.map((ele) => ({
            category: "Deep Cleaning",
            subCategory: ele.service,
            serviceName: ele.name,
            price: Number(ele.price),
            quantity: Number(ele.quantity),
            teamMembersRequired: Number(ele.teamMembers || 1),
            duration: Number(ele.duration || 0),
            coinsForVendor:
              Number(ele.coinsForVendor || 0) * Number(ele.quantity),
          })),
    bookingDetails: {
      bookingDate: moment().toISOString(),
      bookingTime: moment().format("LT"),
      siteVisitCharges:
        serviceType === "house_painting"
          ? priceConfig?.siteVisitCharge || 0
          : 0,
      paymentMethod: "UPI",
    },
    address: {
      houseFlatNumber: selectedAddress?.houseNumber || "",
      streetArea: selectedAddress?.address || "",
      landMark: selectedAddress?.landmark || "",
      city: selectedAddress?.city || "",
      location: {
        type: "Point",
        coordinates: [
          selectedAddress?.longitude || 0,
          selectedAddress?.latitude || 0,
        ],
      },
    },
    selectedSlot: {
      slotDate: selectedSlot?.date,
      slotTime: selectedSlot?.time,
    },
    formName: "Website Service Page",
    isEnquiry: checkEnquiry(),
  };

  // const handleProceedToCheckout = async () => {
  //   try {
  //     setIsLoading(true);

  //     // First check if slot is selected
  //     if (!selectedSlot) {
  //       setSlotWarning("Please select a time slot");
  //       setShowSlotModal(true);
  //       setIsLoading(false);
  //       return;
  //     }

  //     // Debug logging
  //     console.log("Selected Slot:", selectedSlot);
  //     console.log("Selected Slot Date:", selectedSlot.date);
  //     console.log("Selected Slot Time:", selectedSlot.time);

  //     // Fetch available slots for the selected date
  //     const availableSlots = await fetchAvailableSlots(selectedSlot.date);

  //     console.log("Available Slots:", availableSlots);

  //     if (!availableSlots || availableSlots.length === 0) {
  //       setSlotWarning(
  //         "No slots available for this date. Please select another date.",
  //       );
  //       setShowSlotModal(true);
  //       setIsLoading(false);
  //       return;
  //     }

  //     // Check if selected slot exists in fetched slots
  //     const slotExists = availableSlots.includes(selectedSlot.time);

  //     if (!slotExists) {
  //       const msg =
  //         "Selected slot is no longer available. Please select a different slot.";

  //       setSlotWarning(msg);
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Slot exists check:", slotExists);
  //     console.log(
  //       "Looking for:",
  //       selectedSlot.time,
  //       "in array:",
  //       availableSlots,
  //     );

  //     if (!slotExists) {
  //       setSlotWarning(
  //         "Selected slot is no longer available. Please select a different slot.",
  //       );
  //       // Keep the selected slot displayed but show warning
  //       setIsLoading(false);
  //       return; // Don't proceed to booking
  //     }

  //     // Slot is valid, proceed with booking
  //     // ✅ HOUSE PAINTING LOGIC
  //     if (serviceType === "house_painting") {
  //       const amountToPay = priceConfig?.siteVisitCharge || 0;

  //       // CASE 1: Amount > 0 → Direct booking
  //       if (amountToPay > 0) {
  //         const payload = {
  //           ...data,
  //           isEnquiry: false,
  //         };

  //         const result = await postRequest(
  //           API_ENDPOINTS.CREATE_BOOKINGS,
  //           payload,
  //         );
  //         alert(result.message || "Booking successful");
  //         setIsLoading(false);
  //         return;
  //       }

  //       // ..........................RAZOR PAY.......................................

  //       const bookingId = result.data?.bookingId || result.data?.booking?._id;
  //       const razorpayOrder = result.data?.razorpayOrder;

  //       if (!bookingId)
  //         throw new Error("bookingId missing from createBooking response");

  //       // ✅ If no payment required (e.g. siteVisitCharges=0), just finish
  //       if (!razorpayOrder) {
  //         alert(result.data?.message || "Booking created");
  //         setIsLoading(false);
  //         return;
  //       }

  //       // ✅ Open Razorpay (same for deep cleaning first / house painting site visit)
  //       await payWithRazorpay({
  //         bookingId,
  //         razorpayOrder,
  //         customer: data?.customer,
  //         BASE_URL,
  //         onSuccess: () => {
  //           alert("Payment successful & booking confirmed");
  //           setIsLoading(false);
  //         },
  //         onFailure: (msg) => {
  //           alert(msg || "Payment failed");
  //           setIsLoading(false);
  //         },
  //       });
  //       // ................................................................
  //       // CASE 2: Amount = 0 → Ask confirmation
  //       setShowPaintingConfirm(true);
  //       setIsLoading(false);
  //       return;
  //     }

  //     // 🔒 DEEP CLEANING
  //     const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);
  //     alert(result.message || "Booking successful");
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Booking failed:", error);
  //     alert(error?.message || "Booking failed. Please try again.");
  //     setIsLoading(false);
  //   }
  // };

  const handleProceedToCheckout = async () => {
    try {
      setIsLoading(true);

      // ✅ Slot validation (keep same)
      if (!selectedSlot) {
        setSlotWarning("Please select a time slot");
        setShowSlotModal(true);
        setIsLoading(false);
        return;
      }

      const availableSlots = await fetchAvailableSlots(selectedSlot.date);
      if (!availableSlots || availableSlots.length === 0) {
        setSlotWarning(
          "No slots available for this date. Please select another date.",
        );
        setShowSlotModal(true);
        setIsLoading(false);
        return;
      }

      const slotExists = availableSlots.includes(selectedSlot.time);
      if (!slotExists) {
        setSlotWarning(
          "Selected slot is no longer available. Please select a different slot.",
        );
        setIsLoading(false);
        return;
      }

      // ✅ HOUSE PAINTING
      if (serviceType === "house_painting") {
        const amountToPay = Number(priceConfig?.siteVisitCharge || 0);

        const payload = { ...data, isEnquiry: false };

        // ✅ Always create booking first
        const result = await postRequest(
          API_ENDPOINTS.CREATE_BOOKINGS,
          payload,
        );

        // NOTE: postRequest usually returns JSON directly, not axios response
        // so use result.bookingId, not result.data.bookingId
        const bookingId = result?.bookingId || result?.booking?._id;
        const razorpayOrder = result?.razorpayOrder;

        if (!bookingId)
          throw new Error("bookingId missing from createBooking response");

        // ✅ If site visit charge is 0, no need to open Razorpay
        if (amountToPay <= 0 || !razorpayOrder) {
          // your old behaviour
          setShowPaintingConfirm(true); // or alert(result.message)
          setIsLoading(false);
          return;
        }

        // ✅ Open Razorpay for site visit
        await payWithRazorpay({
          bookingId,
          razorpayOrder,
          customer: data?.customer,
          API_BASE_URL,
          onSuccess: () => {
            alert("Payment successful & booking confirmed");
            setIsLoading(false);
          },
          onFailure: (msg) => {
            alert(msg || "Payment failed");
            setIsLoading(false);
          },
        });

        console.log("createBooking result:", result);
        console.log("bookingId:", result?.bookingId, result?.booking?._id);
        console.log("razorpayOrder:", result?.razorpayOrder);
        console.log("window.Razorpay exists?", !!window.Razorpay);

        return;
      }

      // ✅ DEEP CLEANING (first installment)
      const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);

      const bookingId = result?.bookingId || result?.booking?._id;
      const razorpayOrder = result?.razorpayOrder;

      // if your backend returns razorpayOrder for deep_cleaning first payment
      if (razorpayOrder && bookingId) {
        await payWithRazorpay({
          bookingId,
          razorpayOrder,
          customer: data?.customer,
          API_BASE_URL,
          onSuccess: () => {
            alert("Payment successful & booking confirmed");
            setIsLoading(false);
          },
          onFailure: (msg) => {
            alert(msg || "Payment failed");
            setIsLoading(false);
          },
        });
        return;
      }

      alert(result?.message || "Booking successful");
      setIsLoading(false);
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error?.message || "Booking failed. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchServiceConfig = async () => {
    setIsLoading(true);
    try {
      const response = await getRequest(API_ENDPOINTS.GET_SERVICE_PRICE_CONFIG);
      setPriceConfig(response.data);
    } catch (error) {
      console.error("GET error:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceConfig();
  }, []);

  const fetchDeepCleaningPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GET_DEEPCLEANING_PACKAGES}`,
      );
      const json = await res.json();

      if (!json.success)
        throw new Error(json.message || "Failed to load packages");
      setDeepCleaningPackageValues(json.data);
    } catch (err) {
      console.error("GET packages error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeepCleaningPackages();
  }, []);

  const isDeepCleaning = serviceType === "deep_cleaning";
  const isHousePainting = serviceType === "house_painting";

  return (
    <div className="d-none d-lg-block">
      <div
        className="row"
        style={{
          margin: "30px auto",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Left Section */}
        <div
          className="col-md-7"
          style={{
            flex: "1",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #e3e3e3",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "15px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e0e0e0",
                color: "#333",
              }}
            >
              Checkout
            </h3>
            <div
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid rgb(224, 224, 224)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <FaPhoneAlt
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#666" }}>
                  Send booking details to
                </span>
              </div>
              <div>
                <div
                  style={{ fontSize: "14px", color: "#333", fontWeight: "600" }}
                >
                  {currentUser?.userName || null}
                </div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  +91 {currentUser?.mobileNumber || null}
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid rgb(224, 224, 224)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <FaMapMarkerAlt
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#666" }}>Address</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  borderRadius: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      marginTop: "5px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={
                      selectedAddress?.houseNumber || selectedAddress?.address
                        ? `${selectedAddress?.houseNumber || ""}, ${
                            selectedAddress?.address || ""
                          }`
                        : ""
                    }
                  >
                    {` ${selectedAddress?.houseNumber || ""}${
                      selectedAddress?.address
                        ? `, ${
                            selectedAddress.address.length > 30
                              ? selectedAddress.address.substring(0, 30) + "..."
                              : selectedAddress.address
                          }`
                        : ""
                    }`}
                  </p>
                </div>

                <button
                  onClick={() => {
                    try {
                      const cached = selectedAddress; // ✅ use state, not re-reading sessionStorage

                      setAddressPickerCfg({
                        address: cached?.address || "",
                        houseNumber: cached?.houseNumber || "", // ✅ FIX
                        landmark: cached?.landmark || "", // ✅ FIX
                        lat: cached?.latitude ? Number(cached.latitude) : null,
                        lng: cached?.longitude
                          ? Number(cached.longitude)
                          : null,
                        city: cached?.city || "", // ✅ FIX
                      });

                      setShowAddress(true);
                    } catch (e) {
                      console.error("Edit address click error:", e);
                    }
                  }}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "#333",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <FaClock
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#666" }}>Slot</span>
              </div>

              {/* Slot Warning Message */}
              {slotWarning && (
                <div
                  style={{
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaExclamationTriangle style={{ color: "#ffc107" }} />
                  <span style={{ fontSize: "13px", color: "#856404" }}>
                    {slotWarning}
                  </span>
                </div>
              )}

              {!selectedSlot && (
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={handleOpenSlotModal}
                    style={{
                      backgroundColor: "red",
                      border: "1px solid red",
                      borderRadius: "8px",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "white",
                      width: "100%",
                      padding: "10px",
                    }}
                  >
                    Select time & date
                  </button>
                </div>
              )}

              {selectedSlot && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    marginTop: "15px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        marginTop: "5px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {moment(selectedSlot?.date).format("ll")},{" "}
                      {selectedSlot?.time}
                    </p>
                  </div>

                  <button
                    onClick={handleOpenSlotModal}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "5px 10px",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#333",
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: "16px" }}>Cancellation policy</h5>
            <p
              style={{
                color: "#444444",
                fontSize: "12px",
              }}
            >
              Free cancellations if done more than{" "}
              {serviceType == "deep_cleaning" ? "24" : "3"} hrs before the
              service or if a professional isn't assigned. A fee will be charged
              otherwise.
            </p>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                textDecorationStyle: "solid",
                textDecorationLine: "underline",
                cursor: "pointer",
              }}
              onClick={() => setShowPolicy(!showPolicy)}
            >
              Read full policy
            </div>
            {showPolicy && (
              <div className="mt-4 px-3">
                <div
                  className="row mb-2"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <div className="col-md-6">Time</div>
                  <div className="col-md-6">Fee</div>
                </div>
                {serviceType !== "house_painting"
                  ? deepcleaingcancellationsData.map((ele, idx) => (
                      <div
                        key={idx}
                        className="row mb-1"
                        style={{
                          fontSize: "13px",
                          borderBottom: "1px solid #c7c9c9",
                        }}
                      >
                        <div className="col-md-6">{ele.title}</div>
                        <div className="col-md-6">{ele.fee} </div>
                      </div>
                    ))
                  : housePaintingcancellationsData.map((ele, idx) => (
                      <div
                        key={idx}
                        className="row mb-1"
                        style={{
                          fontSize: "13px",
                          borderBottom: "1px solid #c7c9c9",
                        }}
                      >
                        <div className="col-md-6">{ele.title}</div>
                        <div className="col-md-6">{ele.fee} </div>
                      </div>
                    ))}

                <div className="mt-3">
                  <div style={{ fontSize: "13px", color: "#05945b" }}>
                    <CiCircleInfo
                      style={{
                        marginRight: "8px",
                        fontSize: "14px",
                        color: "#05945b",
                        marginBottom: "2px",
                      }}
                    />{" "}
                    No fee if a professional is not assigned
                  </div>
                </div>
                <div className="mt-3">
                  <h5 style={{ fontSize: "16px" }}>
                    This fee goes to the professional
                  </h5>
                  <div style={{ fontSize: "13px", color: "#545454" }}>
                    Their time is reserved for the service & they cannot get
                    another job for the reserved time
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Payment Section */}
        <div
          className="col-md-5"
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            maxHeight: "70vh",
          }}
        >
          <div
            className="hide-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "10px",
              marginBottom: "70px",
            }}
          >
            {(serviceType === "deep_cleaning" && cartItems.length > 0) ||
            serviceType === "house_painting" ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  height: "fit-content",
                  padding: "1rem",
                  border: "1px solid #e3e3e3",
                }}
              >
                {serviceType === "deep_cleaning" && cartItems.length > 0 ? (
                  <>
                    {cartItems.map((item, index) => (
                      <div
                        className="row"
                        key={index}
                        style={{ marginBottom: "15px", alignItems: "center" }}
                      >
                        <p
                          className="col-md-6"
                          style={{
                            fontSize: "14px",
                            color: "#333",
                            marginBottom: "5px",
                          }}
                        >
                          {item.service} - {item.name}
                        </p>
                        <div
                          className="col-md-3"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "5px",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateCartItem(
                                item.name,
                                item.price,
                                -1,
                                item.service,
                              )
                            }
                            style={{
                              backgroundColor: "#f0f0f0",
                              border: "none",
                              color: "red",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartItem(
                                item.name,
                                item.price,
                                1,
                                item.service,
                              )
                            }
                            style={{
                              backgroundColor: "#f0f0f0",
                              border: "none",
                              color: "red",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            +
                          </button>
                        </div>
                        <p
                          className="col-md-3"
                          style={{
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "600",
                          }}
                        >
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </>
                ) : serviceType === "deep_cleaning" &&
                  cartItems.length === 0 ? (
                  <div
                    className="col-md-12"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "24px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      Your Cart is Empty
                    </p>
                  </div>
                ) : null}

                {serviceType === "house_painting" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "16px", color: "#333" }}>
                      House Painters & Waterproofing
                    </span>
                    <span style={{ fontSize: "13px", color: "#333" }}>
                      ₹{priceConfig?.siteVisitCharge}
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            {(serviceType === "deep_cleaning" && cartItems.length > 0) ||
            serviceType === "house_painting" ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  height: "fit-content",
                  padding: "1rem",
                  border: "1px solid #e3e3e3",
                  marginTop: 15,
                  marginBottom: "10px",
                }}
              >
                <h4
                  style={{
                    display: "block",
                    color: "#333",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Payment Summary
                </h4>
                <hr />
                <div
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "17px", color: "#333" }}>
                    <b> Item total</b>
                  </span>
                  <span style={{ fontSize: "17px", color: "#333" }}>
                    <b>
                      ₹{" "}
                      {serviceType === "house_painting"
                        ? priceConfig?.siteVisitCharge
                        : totalCartValueAmountDeepCleaning}
                    </b>
                  </span>
                </div>
                {serviceType === "deep_cleaning" && (
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Advance payment
                      <div
                        style={{
                          fontSize: "12px",
                          color: "black",
                          fontWeight: 300,
                        }}
                      >
                        ₹{RemaingAmountYetToPay} payable after service
                      </div>
                    </span>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      ₹
                      {serviceType === "house_painting"
                        ? priceConfig?.siteVisitCharge
                        : needToPay}{" "}
                    </span>
                  </div>
                )}
                <hr />
                <div
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: "17px", color: "#333", fontWeight: 600 }}
                  >
                    Amount to pay
                  </span>
                  <span
                    style={{ fontSize: "17px", color: "#333", fontWeight: 600 }}
                  >
                    ₹
                    {serviceType === "house_painting"
                      ? priceConfig?.siteVisitCharge
                      : addPrice()}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {(serviceType === "deep_cleaning" && cartItems.length > 0) ||
          serviceType === "house_painting" ? (
            <div
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
                padding: "1rem",
                position: "fixed",
                bottom: 0,
                zIndex: 10,
                width: "43%",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ fontSize: "17px", color: "black", fontWeight: 600 }}
                >
                  Amount to pay
                </span>
                <span
                  style={{ fontSize: "17px", color: "black", fontWeight: 600 }}
                >
                  ₹
                  {serviceType === "house_painting"
                    ? priceConfig?.siteVisitCharge
                    : addPrice()}
                </span>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <button
                  onClick={handleProceedToCheckout}
                  disabled={isLoading || !selectedSlot}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: selectedSlot ? "red" : "#7c7c7c17",
                    color: selectedSlot ? "white" : "#a3a3a3ff",
                    border: selectedSlot
                      ? "1px solid red"
                      : "1px solid #ffffff17",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginTop: "10px",
                    cursor: selectedSlot ? "pointer" : "not-allowed",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Processing..." : "Proceed to Pay"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* House Painting Confirmation Modal */}
      <Modal
        show={showPaintingConfirm}
        centered
        backdrop="static"
        onHide={() => setShowPaintingConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Site visit is free. Are you sure you want to proceed?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={async () => {
              setShowPaintingConfirm(false);
              const payload = {
                ...data,
                isEnquiry: true,
              };
              const result = await postRequest(
                API_ENDPOINTS.CREATE_BOOKINGS,
                payload,
              );
              alert(result.message || "Enquiry created");
            }}
          >
            No
          </Button>

          <Button
            variant="danger"
            onClick={async () => {
              setShowPaintingConfirm(false);
              const payload = {
                ...data,
                isEnquiry: false,
              };
              const result = await postRequest(
                API_ENDPOINTS.CREATE_BOOKINGS,
                payload,
              );
              alert(result.message || "Booking successful");
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Slot Selection Modal */}
      <SlotSelectionModal
        show={showSlotModal}
        onClose={handleCloseSlotModal}
        handleSelectSlot={handleSelectSlot}
        fetchAvailableSlots={fetchAvailableSlots}
        type="booking"
      />

      {/* Address Picker Modal */}
      {showAddress && (
        <AddressPickerModal
          show={showAddress}
          onClose={() => setShowAddress(false)}
          initialLatLng={{
            lat: addressPickerCfg.lat,
            lng: addressPickerCfg.lng,
          }}
          initialAddress={addressPickerCfg.address || ""}
          initialHouseFlat={addressPickerCfg.houseNumber || ""}
          initialLandmark={addressPickerCfg.landmark || ""}
          initialCity={addressPickerCfg.city || ""}
          onSave={handleSaveAddressFromModal}
        />
      )}
    </div>
  );
};

export default Checkout;

// working -22-01
// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaPhoneAlt,
//   FaMapMarkerAlt,
//   FaClock,
//   FaEdit,
//   FaCreditCard,
// } from "react-icons/fa";
// import { CiCircleInfo } from "react-icons/ci";
// import { useAddressContext } from "../utils/AddressContext";
// import { useSelectedSlotContext } from "../utils/SlotContext";
// import { getRequest, postRequest, putRequest } from "../ApiService/apiHelper";
// import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
// import { CartContext } from "./CartContext";
// import moment from "moment";
// import { Button, Form, Modal } from "react-bootstrap";
// import SlotSelectionModal from "./SlotSelectionModal";
// import "./checkout.css";
// import map from "../assets/map.png";
// import searchLocation from "../assets/search-location.png";
// import Autocomplete from "react-google-autocomplete";
// import axios from "axios";
// import AddressPickerModal from "../components/AddressPickerModal";

// const getStoredUser = () => {
//   try {
//     const raw = sessionStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch (e) {
//     console.error("getStoredUser parse error", e);
//     return null;
//   }
// };

// const Checkout = () => {
//   const location = useLocation();
//   const { serviceType } = location.state || {};
//   // console.log("serviceType", serviceType);
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(() => getStoredUser());
//   const userId = currentUser?._id; // ✅ use this everywhere

// const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
// const showSelectedSlot = JSON.parse(sessionStorage.getItem("selectedSlots"));

//   const { phoneNumber: initialPhoneNumber, openAddressModal } =
//     location.state || { phoneNumber: "", openAddressModal: false };
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [addressSelection, setAddressSelection] = useState(null);
//   // const { cartItems, updateCartItem, getQuantity, totalPrice } =
//   //   useContext(CartContext);
//   const [showSlotModal, setShowSlotModal] = useState(false);
//   const [priceConfig, setPriceConfig] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showPolicy, setShowPolicy] = useState(false);

//   const { addressDataContext, setAddressDataContext } = useAddressContext();
//   const { selectedSlot, setSelectedSlot } = useSelectedSlotContext();
//   const { cartItems, setCartItems, updateCartItem, getQuantity, totalPrice } =
//     useContext(CartContext);

// console.log("cartItems", cartItems);

//   const [deepCleaningPackageValues, setDeepCleaningPackageValues] =
//     useState(null);

//   const [showPaintingConfirm, setShowPaintingConfirm] = useState(false);
//   const [showAddress, setShowAddress] = useState(false);
//   const [addressPickerCfg, setAddressPickerCfg] = useState({
//     address: "",
//     houseNumber: "",
//     landmark: "",
//     lat: null,
//     lng: null,
//     city: "",

//     allowSearch: false,
//     allowMapPick: false,

//     // ✅ NEW
//     disableHouseFlat: false,
//     disableLandmark: false,
//     primaryCtaLabel: "Save & Proceed",

//     showChangeButton: false,
//   });
//   // console.log("addressDataContext context api", addressDataContext);
//   const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

//   const fetchUserAddress = async (userId) => {
//     try {
//       if (!userId) return null;

//       const response = await getRequest(
//         `${API_ENDPOINTS.GET_ADDRESS}${userId}`
//       );

//       // Check if the address is in `savedAddress` or `address` field
//       const addressData = response?.address || response?.savedAddress;

//       if (addressData) {
//         const addrObj = {
//           uniqueCode:
//             addressData.uniqueCode ||
//             `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//           address: addressData.address,
//           houseNumber: addressData.houseNumber || "",
//           landmark: addressData.landmark || "",
//           latitude: Number(addressData.latitude),
//           longitude: Number(addressData.longitude),
//           city: addressData.city || "",
//         };

//         setAddressDataContext(addrObj);
//         sessionStorage.setItem("selectedAddress", JSON.stringify(addrObj));
//         return addrObj;
//       }

//       return null;
//     } catch (error) {
//       console.error("fetchUserAddress error:", error?.response || error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;
//     fetchUserAddress(userId);
//   }, [userId]);

//   // ✅ lat/lng directly from selectedAddress (sessionStorage)
//   const getLatLngFromSelectedAddress = () => {
//     try {
//       const lat = Number(selectedAddress?.latitude);
//       const lng = Number(selectedAddress?.longitude);

//       if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
//       return { lat, lng };
//     } catch (e) {
//       console.error("getLatLngFromSelectedAddress error:", e);
//       return null;
//     }
//   };

//   // ✅ Deep cleaning services mapper (duration stays MINUTES - no conversion)
//   const mapServicesForSlots = (items = []) => {
//     try {
//       return (items || []).map((it) => ({
//         name: it?.name || "N/A",
//         price: Number(it?.price || 0),
//         quantity: Number(it?.quantity || 1),

//         // You want "Furnished Apartment" style value -> your cart uses item.service
//         service: it?.service || "N/A",

//         // ✅ minutes only (do not convert to hrs)
//         duration: Number(it?.duration || 0),

//         teamMembers: Number(it?.teamMembers || 0),
//       }));
//     } catch (e) {
//       console.error("mapServicesForSlots error:", e);
//       return [];
//     }
//   };

//   // ✅ API call used by SlotSelectionModal
//   const fetchAvailableSlots = async (date) => {
//     try {
//       const loc = getLatLngFromSelectedAddress();
//       if (!loc) {
//         console.warn("No lat/lng available in selectedAddress");
//         return [];
//       }

//       if (!serviceType) {
//         console.warn("serviceType missing in location.state");
//         return [];
//       }

//       const basePayload = {
//         serviceType, // "deep_cleaning" | "house_painting"
//         date, // "YYYY-MM-DD"
//         lat: loc.lat,
//         lng: loc.lng,
//       };

//       // ✅ Deep Cleaning -> attach services payload
//       const payload =
//         serviceType === "deep_cleaning"
//           ? { ...basePayload, services: mapServicesForSlots(cartItems) }
//           : basePayload;

//       console.log("SLOT PAYLOAD >>>", payload);

//       const res = await fetch(
//         `${API_BASE_URL}/slots/website/get-available-slots`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       if (!data?.success) {
//         console.warn("Slot API returned failure:", data);
//         return [];
//       }

//       return data?.slots || [];
//     } catch (err) {
//       console.error("fetchAvailableSlots error:", err);
//       return [];
//     }
//   };

//   const handleSaveAddressFromModal = async (picked) => {
//     try {
//       // ✅ If "Proceed" button was clicked (existing user with saved address)
//       if (addressPickerCfg.primaryCtaLabel === "Proceed") {
//         console.log("🚀 Proceeding with existing address");

//         const existingAddress = {
//           uniqueCode: `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//           address: addressPickerCfg.address,
//           houseNumber: addressPickerCfg.houseNumber,
//           landmark: addressPickerCfg.landmark,
//           latitude: addressPickerCfg.lat,
//           longitude: addressPickerCfg.lng,
//           city: addressPickerCfg.city,
//         };

//         // Store in context and session
//         setAddressDataContext(existingAddress);
//         sessionStorage.setItem(
//           "selectedAddress",
//           JSON.stringify(existingAddress)
//         );
//         setShowAddress(false);

//         return;
//       }

//       const uniqueCode = `ADDR-${Date.now()}-${Math.floor(
//         Math.random() * 1000
//       )}`;
//       const addressObj = {
//         uniqueCode,
//         address: picked.address || addressPickerCfg.address,
//         houseNumber: addressPickerCfg.disableHouseFlat
//           ? addressPickerCfg.houseNumber
//           : picked.houseNumber?.trim() || "",
//         landmark: addressPickerCfg.disableLandmark
//           ? addressPickerCfg.landmark
//           : picked.landmark?.trim() || "",
//         latitude: Number(picked.lat || addressPickerCfg.lat),
//         longitude: Number(picked.lng || addressPickerCfg.lng),
//         city: picked.city || addressPickerCfg.city || "",
//       };

//       console.log("📝 Address to save:", addressObj);

//       // Save to backend for existing users
//       if (currentUser?._id) {
//         const payload = { savedAddress: addressObj };
//         console.log("📤 Saving to backend:", payload);

//         const result = await putRequest(
//           `${API_ENDPOINTS.SAVE_ADDRESS}${currentUser._id}`,
//           payload
//         );
//         console.log("✅ Save result:", result);
//       }

//       // Store in context and session
//       setAddressDataContext(addressObj);
//       sessionStorage.setItem("selectedAddress", JSON.stringify(addressObj));
//       setShowAddress(false);
//     } catch (error) {
//       console.error("handleSaveAddressFromModal error:", error);
//       alert(error?.message || "Failed to save address");
//     }
//   };

//   const cancellationsData = [
//     {
//       id: 1,
//       title: "More than 48 hrs before the service",
//       fee: "Free",
//     },
//     {
//       id: 1,
//       title: "Within 48 hrs of the service",
//       fee: "Up to ₹499",
//     },
//     {
//       id: 1,
//       title: "Within 24 hrs of the service",
//       fee: "Up to ₹999",
//     },
//   ];

//   // Function to handle opening the slot modal
//   const handleOpenSlotModal = () => {
//     setShowSlotModal(true);
//   };

//   // Function to handle closing the slot modal
//   const handleCloseSlotModal = () => {
//     setShowSlotModal(false);
//   };

//   // Function to handle selecting a slot
//   const handleSelectSlot = (slot) => {
//     // console.log("slot", slot);
//     setSelectedSlot(slot);
//     sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
//     setShowSlotModal(false);
//   };

//   // Function to handle opening the payment modal
//   const handleOpenPaymentModal = () => {
//     setShowPaymentModal(true);
//   };

//   // Function to handle closing the payment modal
//   const handleClosePaymentModal = () => {
//     setShowPaymentModal(false);
//   };

//   const handleSelectPaymentOption = (e) => {
//     // console.log("target option", e);
//     // setShowPaymentModal(false);
//   };

//   // Predefined payment methods for demonstration
//   const paymentMethods = [
//     { name: "Credit/Debit Card" },
//     { name: "UPI" },
//     { name: "Net Banking" },
//     { name: "Cash on Delivery" },
//   ];
//   console.log("priceConfig", priceConfig);

//   // const calculateTotalAmount =
//   //   cartItems && cartItems.length > 0
//   //     ? cartItems.reduce((acc, val) => acc + val.price * (val.quantity || 1), 0)
//   //     : 0;

//   const checkEnquiry = () => {
//     if (serviceType === "house_painting" && priceConfig?.siteVisitCharge > 0) {
//       return false;
//     } else if (serviceType === "deep_cleaning") {
//       return false;
//     }
//     return true;
//   };

//   const result = cartItems.map((cartItem) => {
//     const matchedPackage = deepCleaningPackageValues?.find(
//       (pkg) => pkg.name === cartItem.name
//     );
//     return {
//       ...cartItem,
//       bookingAmount: matchedPackage ? matchedPackage.bookingAmount : null,
//     };
//   });

//   // Sum up the bookingAmount values, treating null as 0
//   const advancedAmount = result.reduce((sum, item) => {
//     return sum + (item.bookingAmount ? item.bookingAmount : 0);
//   }, 0);

//   // console.log("booking total", addPrice())

//   // console.log("advancedAmount", advancedAmount);

//   //   {
//   //     "name": "3 BHK Cleaning - Premium",
//   //     "price": 4599,
//   //     "quantity": 1,
//   //     "service": "Unfurnished Apartment",
//   //     "teamMembers": 3
//   // }

//   // {
//   //     "_id": "6915c8deb1420691b0506e9e",
//   //     "category": "Unfurnished apartment",
//   //     "subcategory": "3 BHK Cleaning",
//   //     "service": "Premium",
//   //     "totalAmount": 4599,
//   //     "bookingAmount": 599,
//   //     "coinsForVendor": 50,
//   //     "teamMembers": 4,
//   //     "name": "3 BHK Cleaning - Premium",
//   //     "createdAt": "2025-11-13T12:02:38.271Z",
//   //     "updatedAt": "2025-11-13T12:02:38.271Z",
//   //     "__v": 0
//   // }

//   // console.log("deepCleaningPackageValues", deepCleaningPackageValues);

//   const siteVisitAmountHousePainting = () => {
//     if (serviceType === "house_painting" && priceConfig?.siteVisitCharge > 0) {
//       return (calculateTotalAmount = priceConfig?.siteVisitCharge || 0);
//     } else {
//       return 0;
//     }
//   };

//   let calculateTotalAmount = 0;

//   const totalCartValueAmountDeepCleaning =
//     cartItems && cartItems.length > 0
//       ? cartItems.reduce((acc, val) => acc + val.price * (val.quantity || 1), 0)
//       : 0;

//   const needToPay = Math.round(totalCartValueAmountDeepCleaning * 0.2);

//   const RemaingAmountYetToPay =
//     parseInt(totalCartValueAmountDeepCleaning) - parseInt(needToPay);

//   console.log("total Cart Value", totalCartValueAmountDeepCleaning);
//   console.log("Advance AMT to be paid", needToPay);
//   // console.log("Get booking Amount based on selected pkg", result);
//   console.log("priceConfig?.siteVisitCharge house painting", priceConfig);
//   console.log("RemaingAmountYetToPay", RemaingAmountYetToPay);
//   console.log("serviceType", serviceType);

//   const getMaxTeamMembersRequired = () => {
//     if (cartItems.length === 0) return 0;
//     return Math.max(
//       ...cartItems.map((item) => item.teamMembers * item.quantity)
//     );
//   };

//   const addPrice = () => {
//     if (serviceType === "house_painting" && priceConfig?.siteVisitCharge > 0) {
//       return (calculateTotalAmount = priceConfig?.siteVisitCharge || 0);
//     } else {
//       return (calculateTotalAmount = needToPay);
//     }
//   };

//   // console.log("Required Team Members:", getMaxTeamMembersRequired());

//   const data = {
//     // Customer Info
//     customer: {
//       customerId: currentUser?._id,
//       phone: currentUser?.mobileNumber,
//       name: currentUser?.userName,
//     },
//     service:
//       serviceType === "house_painting"
//         ? [
//             {
//               // category: "House Painters & Waterproofing",
//               category: "House Painting",
//               serviceName: "House Painters & Waterproofing",
//               price: Number(priceConfig?.siteVisitCharge || 0),
//               quantity: Number(1),
//               coinsForVendor: Number(priceConfig?.vendorCoins || 0),
//             },
//           ]
//         : cartItems.map((ele) => ({
//             category: "Deep Cleaning",
//             subCategory: ele.service,
//             serviceName: ele.name,
//             price: Number(ele.price),
//             quantity: Number(ele.quantity),
//             teamMembersRequired: Number(ele.teamMembers || 1),
//             duration: Number(ele.duration || 0),
//             coinsForVendor:
//               Number(ele.coinsForVendor || 0) * Number(ele.quantity),
//           })),
//     bookingDetails: {
//       bookingDate: moment().toISOString(), // from form
//       bookingTime: moment().format("LT"), // from form
//       siteVisitCharges:
//         serviceType === "house_painting"
//           ? priceConfig?.siteVisitCharge || 0
//           : 0,
//       paymentMethod: "UPI", // Only if available
//     },
//     // bookingDetails: {
//     //   bookingDate: moment().toISOString(),
//     //   bookingTime: moment().format("LT"),
//     //   bookingAmount: addPrice(),
//     //   siteVisitCharges: calculateTotalAmount, //consider deep cleaning [advancedAmount] and house painting [siteVisitCharges]
//     //   paidAmount: serviceType === "house_painting" ? 0 : advancedAmount,

//     //   amountYetToPay: serviceType === "house_painting" ? 0 :
//     //     RemaingAmountYetToPay,
//     // },
//     address: {
//       houseFlatNumber: selectedAddress?.houseNumber || "",
//       streetArea: selectedAddress?.address || "",
//       landMark: selectedAddress?.landmark || "",
//       city: selectedAddress?.city || "",
//       location: {
//         type: "Point",
//         coordinates: [
//           selectedAddress?.longitude || 0,
//           selectedAddress?.latitude || 0,
//         ],
//       },
//     },
//     selectedSlot: {
//       slotDate: showSelectedSlot?.date,
//       slotTime: showSelectedSlot?.time,
//     },
//     formName: "Website Service Page",
//     isEnquiry: checkEnquiry(),
//     // formName: "Website Service Page",
//   };
//   console.log("Payload Before sending...", data);

//   // const handleProceedToCheckout = async () => {
//   //   // if (cartItems.length === 0) {
//   //   //   alert("Please add at least one service to the cart.");
//   //   //   return;
//   //   // }
//   //   try {
//   //     const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);
//   //     console.log("Booking Success", result);
//   //     // setCartItems([]);
//   //     // sessionStorage.clear();
//   //     alert(result.message || "Booking successful");
//   //     // window.location.assign("/");

//   //     // console.log("structed data", data);
//   //   } catch (error) {
//   //     console.error("Booking failed:", error);
//   //   }
//   // };

//   const handleProceedToCheckout = async () => {
//     try {
//       // ✅ HOUSE PAINTING LOGIC ONLY
//       if (serviceType === "house_painting") {
//         const amountToPay = priceConfig?.siteVisitCharge || 0;

//         // CASE 1: Amount > 0 → Direct booking
//         if (amountToPay > 0) {
//           const payload = {
//             ...data,
//             isEnquiry: false,
//           };

//           const result = await postRequest(
//             API_ENDPOINTS.CREATE_BOOKINGS,
//             payload
//           );
//           alert(result.message || "Booking successful");
//           return;
//         }

//         // CASE 2: Amount = 0 → Ask confirmation
//         setShowPaintingConfirm(true);
//         return;
//       }

//       // 🔒 DEEP CLEANING — untouched
//       const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);
//       alert(result.message || "Booking successful");
//     } catch (error) {
//       console.error("Booking failed:", error);
//     }
//   };

//   const fetchServiceConfig = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getRequest(API_ENDPOINTS.GET_SERVICE_PRICE_CONFIG);
//       // console.log("response", response);
//       // console.log("API RES", API_ENDPOINTS.GET_SERVICE_PRICE_CONFIG);
//       setPriceConfig(response.data);
//     } catch (error) {
//       console.error("GET error:", error.response || error);
//       throw error.response ? error.response.data : error;
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchServiceConfig();
//   }, []);

//   const fetchDeepCleaningPackages = async () => {
//     setIsLoading(true);
//     try {
//       // const res = await fetch("http://localhost:9000/api/deeppackage/deep-cleaning-packages");
//       const res = await fetch(
//         `${API_BASE_URL}${API_ENDPOINTS.GET_DEEPCLEANING_PACKAGES}`
//       );
//       const json = await res.json();
//       console.log("json", json);

//       if (!json.success)
//         throw new Error(json.message || "Failed to load packages");
//       setDeepCleaningPackageValues(json.data);
//     } catch (err) {
//       console.error("GET packages error:", err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchDeepCleaningPackages();
//   }, []);

//   // console.log("priceConfig", priceConfig);
//   return (
//     <div className="d-none d-lg-block">
//       <div
//         className="row"
//         style={{
//           // width: "1200px",
//           margin: "30px auto",
//           // display: "flex",
//           // gap: "20px",
//           fontFamily: "'Roboto', sans-serif",
//         }}
//       >
//         {/* Left Section */}
//         <div
//           className="col-md-7"
//           style={{
//             flex: "1",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               padding: "20px",
//               marginBottom: "20px",
//               border: "1px solid #e3e3e3",
//               // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h3
//               style={{
//                 fontSize: "18px",
//                 fontWeight: "600",
//                 marginBottom: "15px",
//                 paddingBottom: "10px",
//                 borderBottom: "1px solid #e0e0e0",
//                 color: "#333",
//               }}
//             >
//               Checkout
//             </h3>
//             <div
//               style={{
//                 marginBottom: "15px",
//                 borderBottom: "1px solid rgb(224, 224, 224)",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "8px",
//                 }}
//               >
//                 <FaPhoneAlt
//                   style={{
//                     marginRight: "8px",
//                     fontSize: "14px",
//                     color: "#666",
//                   }}
//                 />
//                 <span style={{ fontSize: "14px", color: "#666" }}>
//                   Send booking details to
//                 </span>
//               </div>
//               <div
//               // style={{ display: "flex", alignItems: "center", gap: "10px" }}
//               >
//                 <div
//                   style={{ fontSize: "14px", color: "#333", fontWeight: "600" }}
//                 >
//                   {currentUser?.userName || null}
//                 </div>
//                 <div style={{ fontSize: "14px", color: "#333" }}>
//                   +91 {currentUser?.mobileNumber || null}
//                 </div>
//               </div>
//             </div>

//             <div
//               style={{
//                 marginBottom: "15px",
//                 borderBottom: "1px solid rgb(224, 224, 224)",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "8px",
//                 }}
//               >
//                 <FaMapMarkerAlt
//                   style={{
//                     marginRight: "8px",
//                     fontSize: "14px",
//                     color: "#666",
//                   }}
//                 />
//                 <span style={{ fontSize: "14px", color: "#666" }}>Address</span>{" "}
//               </div>
//               {/* {selectedAddress && ( */}
//               {/* <> */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "baseline",
//                   justifyContent: "space-between",

//                   borderRadius: "10px",
//                 }}
//               >
//                 <div style={{ flex: 1 }}>
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#333",
//                       marginTop: "5px",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                     title={
//                       selectedAddress?.houseNumber || selectedAddress?.address
//                         ? `${selectedAddress?.houseNumber || ""}, ${
//                             selectedAddress?.address || ""
//                           }`
//                         : ""
//                     }
//                   >
//                     {` ${selectedAddress?.houseNumber || ""}${
//                       selectedAddress?.address
//                         ? `, ${
//                             selectedAddress.address.length > 30
//                               ? selectedAddress.address.substring(0, 30) + "..."
//                               : selectedAddress.address
//                           }`
//                         : ""
//                     }`}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => {
//                     console.log("🔍 Search by Location selected");
//                     const cached = JSON.parse(
//                       sessionStorage.getItem("selectedAddress") || "null"
//                     );

//                     // ✅ EXISTING -> SEARCH LOCATION: fully editable
//                     setAddressPickerCfg({
//                       address: cached?.address || "",
//                       houseNumber: "",
//                       landmark: "",
//                       lat: cached?.latitude ? Number(cached.latitude) : null,
//                       lng: cached?.longitude ? Number(cached.longitude) : null,
//                       city: cached?.city || "",
//                       allowSearch: true,
//                       allowMapPick: true,
//                       disableHouseFlat: false,
//                       disableLandmark: false,
//                       showChangeButton: false,
//                       primaryCtaLabel: "Save & Proceed",
//                       showChangeButton: false,
//                     });
//                     setShowAddress(true);
//                   }}
//                   style={{
//                     backgroundColor: "#fff",
//                     border: "1px solid #ddd",
//                     borderRadius: "8px",
//                     padding: "5px 10px",
//                     fontSize: "14px",
//                     cursor: "pointer",
//                     color: "#333",
//                   }}
//                 >
//                   Edit
//                 </button>
//               </div>
//               {/* </> */}
//               {/* )} */}
//             </div>

//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "8px",
//                 }}
//               >
//                 <FaClock
//                   style={{
//                     marginRight: "8px",
//                     fontSize: "14px",
//                     color: "#666",
//                   }}
//                 />
//                 <span style={{ fontSize: "14px", color: "#666" }}>Slot</span>
//               </div>
//               {showSelectedSlot === null && (
//                 <div
//                   style={{
//                     justifyContent: "center",
//                     display: "flex",
//                     marginTop: "15px",
//                   }}
//                 >
//                   <button
//                     onClick={handleOpenSlotModal}
//                     style={{
//                       backgroundColor: "red",
//                       border: "1px solid red",
//                       borderRadius: "8px",
//                       fontSize: "14px",
//                       cursor: "pointer",
//                       color: "white",
//                       width: "100%",
//                     }}
//                   >
//                     Select time & date
//                   </button>
//                 </div>
//               )}
//               {showSelectedSlot && (
//                 <>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "baseline",
//                       justifyContent: "space-between",
//                       borderRadius: "10px",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <p
//                         style={{
//                           fontSize: "14px",
//                           color: "#333",
//                           marginTop: "5px",
//                           whiteSpace: "nowrap",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                         }}
//                       >
//                         {moment(showSelectedSlot?.date).format("ll")},{" "}
//                         {showSelectedSlot?.time}
//                       </p>
//                     </div>

//                     <button
//                       onClick={handleOpenSlotModal}
//                       style={{
//                         backgroundColor: "#fff",
//                         border: "1px solid #ddd",
//                         borderRadius: "8px",
//                         padding: "5px 10px",
//                         fontSize: "14px",
//                         cursor: "pointer",
//                         color: "#333",
//                       }}
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//           <div>
//             <h5 style={{ fontSize: "16px" }}>Cancellation policy</h5>
//             <p
//               style={{
//                 color: "#444444",
//                 fontSize: "12px",
//               }}
//             >
//               Free cancellations if done more than 48 hrs before the service or
//               if a professional isn’t assigned. A fee will be charged otherwise.
//             </p>
//             <div
//               style={{
//                 fontSize: "13px",
//                 fontWeight: 500,
//                 textDecorationStyle: "solid",
//                 textDecorationLine: "underline",
//                 cursor: "pointer",
//               }}
//               onClick={() => setShowPolicy(!showPolicy)}
//             >
//               Read full policy
//             </div>
//             {showPolicy && (
//               <div className="mt-4 px-3">
//                 <div
//                   className="row mb-2"
//                   style={{
//                     fontSize: "13px",
//                     fontWeight: 600,
//                   }}
//                 >
//                   <div className="col-md-6">Time</div>
//                   <div className="col-md-6">Fee</div>
//                 </div>
//                 {cancellationsData.map((ele, idx) => (
//                   <div
//                     key={idx + 1}
//                     className="row mb-1"
//                     style={{
//                       fontSize: "13px",
//                       borderBottom: "1px solid #c7c9c9",
//                     }}
//                   >
//                     <div className="col-md-6">{ele.title}</div>
//                     <div className="col-md-6">{ele.fee} </div>
//                   </div>
//                 ))}
//                 <div className="mt-3">
//                   <div style={{ fontSize: "13px", color: "#05945b" }}>
//                     <CiCircleInfo
//                       style={{
//                         marginRight: "8px",
//                         fontSize: "14px",
//                         color: "#05945b",
//                         marginBottom: "2px",
//                       }}
//                     />{" "}
//                     No fee if a professional is not assigned
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <h5 style={{ fontSize: "16px" }}>
//                     This fee goes to the professional
//                   </h5>
//                   <div style={{ fontSize: "13px", color: "#545454" }}>
//                     Their time is reserved for the service & they cannot get
//                     another job for the reserved time
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Right Section - Payment Section */}
//         <div
//           className="col-md-5"
//           style={{
//             flex: "1",
//             display: "flex",
//             flexDirection: "column",
//             maxHeight: "70vh",
//           }}
//         >
//           <div
//             className="hide-scroll"
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               paddingRight: "10px", // To avoid layout shift when hiding scrollbar
//               marginBottom: "70px", // space for fixed bottom section
//             }}
//           >
//             {(serviceType === "deep_cleaning" && cartItems.length > 0) ||
//             serviceType === "house_painting" ? (
//               <div
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "12px",
//                   height: "fit-content",
//                   padding: "1rem",
//                   border: "1px solid #e3e3e3",
//                   // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 {serviceType === "deep_cleaning" && cartItems.length > 0 ? (
//                   <>
//                     {cartItems.map((item, index) => (
//                       <div
//                         className="row"
//                         key={index}
//                         style={{ marginBottom: "15px", alignItems: "center" }}
//                       >
//                         <p
//                           className="col-md-6"
//                           style={{
//                             fontSize: "14px",
//                             color: "#333",
//                             marginBottom: "5px",
//                           }}
//                         >
//                           {item.service} - {item.name}
//                         </p>
//                         <div
//                           className="col-md-3"
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "10px",
//                             marginBottom: "5px",
//                           }}
//                         >
//                           <button
//                             onClick={() =>
//                               updateCartItem(
//                                 item.name,
//                                 item.price,
//                                 -1,
//                                 item.service
//                               )
//                             }
//                             style={{
//                               backgroundColor: "#f0f0f0",
//                               border: "none",
//                               color: "red",
//                               padding: "5px 10px",
//                               borderRadius: "5px",
//                               cursor: "pointer",
//                             }}
//                           >
//                             -
//                           </button>
//                           <span>{item.quantity}</span>
//                           <button
//                             onClick={() =>
//                               updateCartItem(
//                                 item.name,
//                                 item.price,
//                                 1,
//                                 item.service
//                               )
//                             }
//                             style={{
//                               backgroundColor: "#f0f0f0",
//                               border: "none",
//                               color: "red",
//                               padding: "5px 10px",
//                               borderRadius: "5px",
//                               cursor: "pointer",
//                             }}
//                           >
//                             +
//                           </button>
//                         </div>
//                         <p
//                           className="col-md-3"
//                           style={{
//                             fontSize: "14px",
//                             color: "#333",
//                             fontWeight: "600",
//                           }}
//                         >
//                           ₹{item.price * item.quantity}
//                         </p>
//                       </div>
//                     ))}
//                   </>
//                 ) : serviceType === "deep_cleaning" &&
//                   cartItems.length === 0 ? (
//                   <div
//                     className="col-md-12"
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontSize: "24px",
//                         color: "#333",
//                         fontWeight: "600",
//                       }}
//                     >
//                       Your Cart is Empty
//                     </p>
//                   </div>
//                 ) : null}

//                 {serviceType === "house_painting" && (
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <span style={{ fontSize: "16px", color: "#333" }}>
//                       House Painters & Waterproofing
//                     </span>
//                     <span style={{ fontSize: "13px", color: "#333" }}>
//                       ₹{priceConfig?.siteVisitCharge}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ) : null}
//             {(serviceType === "deep_cleaning" && cartItems.length > 0) ||
//             serviceType === "house_painting" ? (
//               <div
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "12px",
//                   height: "fit-content",
//                   padding: "1rem",
//                   border: "1px solid #e3e3e3",
//                   marginTop: 15,
//                   marginBottom: "10px",
//                   // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <h4
//                   style={{
//                     display: "block",
//                     color: "#333",
//                     fontSize: "16px",
//                     fontWeight: 600,
//                   }}
//                 >
//                   Payment Summary
//                 </h4>
//                 <hr />
//                 <div
//                   style={{
//                     marginBottom: "10px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <span style={{ fontSize: "17px", color: "#333" }}>
//                     <b> Item total</b>
//                   </span>
//                   <span style={{ fontSize: "17px", color: "#333" }}>
//                     <b>
//                       ₹{" "}
//                       {serviceType === "house_painting"
//                         ? priceConfig?.siteVisitCharge
//                         : // : addPrice()
//                           totalCartValueAmountDeepCleaning}
//                     </b>
//                   </span>
//                 </div>
//                 {serviceType === "deep_cleaning" && (
//                   <div
//                     style={{
//                       marginBottom: "10px",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       fontWeight: 500,
//                     }}
//                   >
//                     <span style={{ fontSize: "14px", color: "#333" }}>
//                       Advance payment
//                       <div
//                         style={{
//                           fontSize: "12px",
//                           color: "black",
//                           fontWeight: 300,
//                         }}
//                       >
//                         ₹{RemaingAmountYetToPay} payable after service
//                       </div>
//                     </span>
//                     <span style={{ fontSize: "14px", color: "#333" }}>
//                       ₹
//                       {serviceType === "house_painting"
//                         ? priceConfig?.siteVisitCharge
//                         : needToPay}{" "}
//                     </span>
//                   </div>
//                 )}
//                 <hr />
//                 <div
//                   style={{
//                     marginBottom: "10px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <span
//                     style={{ fontSize: "17px", color: "#333", fontWeight: 600 }}
//                   >
//                     Amount to pay
//                   </span>
//                   <span
//                     style={{ fontSize: "17px", color: "#333", fontWeight: 600 }}
//                   >
//                     ₹
//                     {
//                       serviceType === "house_painting"
//                         ? priceConfig?.siteVisitCharge
//                         : addPrice()
//                       // calculateTotalAmount
//                     }
//                   </span>
//                 </div>
//               </div>
//             ) : null}
//           </div>
//           {(serviceType === "deep_cleaning" && cartItems.length > 0) ||
//           serviceType === "house_painting" ? (
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
//                 padding: "1rem",
//                 position: "fixed",
//                 bottom: 0,
//                 // left: 0,
//                 // right: "75%",
//                 zIndex: 10,
//                 width: "43%",
//                 borderTopLeftRadius: "10px",
//                 borderTopRightRadius: "10px",
//               }}
//             >
//               <div
//                 style={{
//                   marginBottom: "10px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <span
//                   style={{ fontSize: "17px", color: "black", fontWeight: 600 }}
//                 >
//                   Amount to pay
//                 </span>
//                 <span
//                   style={{ fontSize: "17px", color: "black", fontWeight: 600 }}
//                 >
//                   ₹
//                   {
//                     serviceType === "house_painting"
//                       ? priceConfig?.siteVisitCharge
//                       : addPrice()
//                     // calculateTotalAmount
//                   }
//                 </span>
//               </div>
//               <div style={{ marginBottom: "15px" }}>
//                 <button
//                   onClick={showSelectedSlot ? handleProceedToCheckout : null}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     backgroundColor: showSelectedSlot ? "red" : "#7c7c7c17",
//                     color: showSelectedSlot ? "white" : "#a3a3a3ff",
//                     border: showSelectedSlot
//                       ? "1px solid red"
//                       : "1px solid #ffffff17",
//                     borderRadius: "10px",
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     // cursor: "pointer",
//                     marginTop: "10px",
//                     cursor: showSelectedSlot ? "pointer" : "not-allowed",
//                   }}
//                 >
//                   Proceed to Pay
//                 </button>
//               </div>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {/* Payment Method Modal */}
//       {showPaymentModal && (
//         <>
//           <div
//             style={{
//               position: "fixed",
//               top: "0",
//               left: "0",
//               width: "100%",
//               height: "100%",
//               backgroundColor: "rgba(0,0,0,0.6)",
//               zIndex: "1000",
//             }}
//             onClick={handleClosePaymentModal}
//           />
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%,-50%)",
//               width: "600px",
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "20px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
//               zIndex: "1001",
//               fontFamily: "'Roboto', sans-serif",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "15px",
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "600",
//                   margin: "0",
//                   color: "#333",
//                 }}
//               >
//                 Select Payment Method
//               </h3>
//               <button
//                 onClick={handleClosePaymentModal}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "24px",
//                   cursor: "pointer",
//                   color: "#666",
//                 }}
//               >
//                 ×
//               </button>
//             </div>
//             <div style={{ marginBottom: "15px" }}>
//               <h4
//                 style={{
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   marginBottom: "8px",
//                   color: "#333",
//                 }}
//               >
//                 Payment Options
//               </h4>
//               {paymentMethods.map((method, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     padding: "10px",
//                     border: "1px solid #e0e0e0",
//                     borderRadius: "5px",
//                     marginBottom: "8px",
//                     cursor: "pointer",
//                     backgroundColor: "#fff",
//                     transition: "background-color 0.3s",
//                   }}
//                   onClick={(e) => handleSelectPaymentOption(e.target.value)}
//                 >
//                   <p
//                     key={index}
//                     style={{ fontSize: "14px", margin: "0", color: "#333" }}
//                   >
//                     {method.name}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       <Modal
//         show={showPaintingConfirm}
//         centered
//         backdrop="static"
//         onHide={() => setShowPaintingConfirm(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Booking</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           Site visit is free. Are you sure you want to proceed?
//         </Modal.Body>

//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={async () => {
//               // NO → enquiry
//               setShowPaintingConfirm(false);

//               const payload = {
//                 ...data,
//                 isEnquiry: true,
//               };

//               const result = await postRequest(
//                 API_ENDPOINTS.CREATE_BOOKINGS,
//                 payload
//               );
//               alert(result.message || "Enquiry created");
//             }}
//           >
//             No
//           </Button>

//           <Button
//             variant="danger"
//             onClick={async () => {
//               // YES → booking
//               setShowPaintingConfirm(false);

//               const payload = {
//                 ...data,
//                 isEnquiry: false,
//               };

//               const result = await postRequest(
//                 API_ENDPOINTS.CREATE_BOOKINGS,
//                 payload
//               );
//               alert(result.message || "Booking successful");
//             }}
//           >
//             Yes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <SlotSelectionModal
//         show={showSlotModal}
//         onClose={handleCloseSlotModal}
//         handleSelectSlot={handleSelectSlot}
//         fetchAvailableSlots={fetchAvailableSlots}
//         type="booking"
//       />

//       {showAddress && (
//         <AddressPickerModal
//           show={showAddress}
//           onClose={() => setShowAddress(false)}
//           initialLatLng={{
//             lat: addressPickerCfg.lat || 12.9716,
//             lng: addressPickerCfg.lng || 77.5946,
//           }}
//           initialAddress={addressPickerCfg.address || ""}
//           initialHouseFlat={addressPickerCfg.houseNumber || ""}
//           initialLandmark={addressPickerCfg.landmark || ""}
//           initialCity={addressPickerCfg.city || ""}
//           onSave={handleSaveAddressFromModal}
//         />
//       )}
//     </div>
//   );
// };

// export default Checkout;
