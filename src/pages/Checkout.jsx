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
import PopupModal from "../utils/PopupModal";
import {
  getEnquiryBookingId,
  clearEnquiryBookingId,
  patchEnquiry,
  finalizeBookingRequest,
} from "../utils/enquiryLead";
import { resolveServiceCity } from "../utils/serviceCity";

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
  const { cartItems, updateCartItem, setCartItems } = useContext(CartContext);

  // Wipes booking-related state after a successful payment so the next
  // checkout starts clean. Keeps the logged-in `user` so the customer
  // isn't kicked out of the session.
  const clearBookingSession = () => {
    try {
      setCartItems([]);
    } catch (e) {
      console.error("clearBookingSession setCartItems error", e);
    }
    try {
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("selectedAddress");
      sessionStorage.removeItem("selectedSlots");
      sessionStorage.removeItem("isNewUser");
    } catch (e) {
      console.error("clearBookingSession storage error", e);
    }
    setSelectedAddress(null);
    setSelectedSlot(null);
    setAddressDataContext?.(null);
    clearEnquiryBookingId();
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [navigationDecision, setNavigationDecision] = useState(null);
  const [prompt, setPrompt] = useState({
    promptTile: "",
    promptBody: "",
  });
  const [addressPickerCfg, setAddressPickerCfg] = useState({
    address: "",
    houseNumber: "",
    landmark: "",
    lat: null,
    lng: null,
    city: "",
  });
  const [minOrder, setMinOrder] = useState("");
  const [siteVisitCharge, setSiteVisitCharge] = useState("");
  const [vendorCoins, setVendorCoins] = useState("");
  const [puttyPrice, setPuttyPrice] = useState("");

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

  const fetchPricingConfig = async () => {
    try {
      // Resolve satellite cities (e.g. Pimpri-Chinchwad → Pune) so the
      // lookup hits the canonical service-area config.
      const lookupCity = resolveServiceCity(selectedAddress?.city);
      if (!lookupCity) return;

      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GET_PRICING_CONFIG}${encodeURIComponent(lookupCity)}`,
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch pricing config");
      }

      const pricing = data?.data || {};

      setSiteVisitCharge(
        pricing.siteVisitCharge !== undefined &&
          pricing.siteVisitCharge !== null
          ? String(pricing.siteVisitCharge)
          : "",
      );
      setVendorCoins(
        pricing.vendorCoins !== undefined && pricing.vendorCoins !== null
          ? String(pricing.vendorCoins)
          : "",
      );
      setPuttyPrice(
        pricing.puttyPrice !== undefined && pricing.puttyPrice !== null
          ? String(pricing.puttyPrice)
          : "",
      );
    } catch (error) {
      console.error("Fetch pricing config error:", error);
      setSiteVisitCharge("");
    }
  };
  useEffect(() => {
    fetchPricingConfig();
  }, [selectedAddress?.city.trim()]);

  console.log("Pricing config - siteVisitCharge:", siteVisitCharge);

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
        return [];
      }

      const allSlots = data?.slots || [];
      const filtered = filterSlotsTwoHoursAhead(date, allSlots);

      return filtered;
    } catch (err) {
      return [];
    }
  };

  const handleSaveAddressFromModal = async (payloadFromModal) => {
    try {
      const p = payloadFromModal || addressPickerCfg;

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

      sessionStorage.setItem("selectedAddress", JSON.stringify(addressObj));
      setSelectedAddress(addressObj);

      clearSelectedSlot();

      // Reflect the address change on the in-flight enquiry immediately.
      patchEnquiry({ address: addressObj });

      setShowAddress(false);
    } catch (error) {
      console.error("handleSaveAddressFromModal error:", error);
      alert(error?.message || "Failed to save address");
    }
  };

  console.log("selectedAddress", selectedAddress);

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

    // Reflect the slot change on the in-flight enquiry immediately.
    patchEnquiry({ selectedSlot: slot });
  };

  const checkEnquiry = () => {
    if (serviceType === "house_painting" && siteVisitCharge > 0) {
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
    if (serviceType === "house_painting" && siteVisitCharge > 0) {
      return siteVisitCharge || 0;
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
              price: Number(siteVisitCharge || 0),
              quantity: Number(1),
              coinsForVendor: Number(vendorCoins || 0),
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
        serviceType === "house_painting" ? siteVisitCharge || 0 : 0,
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

  const handleModalDone = () => {
    setShowMessageModal(false);
    if (navigationDecision && navigationDecision !== "close") {
      navigate(navigationDecision);
    }
  };

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
        const amountToPay = Number(siteVisitCharge || 0);

        const payload = { ...data, isEnquiry: false };

        const result = await finalizeBookingRequest(payload);

        const bookingId = result?.bookingId || result?.booking?._id;
        const razorpayOrder = result?.razorpayOrder;

        if (!bookingId)
          throw new Error("bookingId missing from finalize response");

        // ✅ If site visit charge is 0, no need to open Razorpay.
        // Skip the confirmation modal and confirm the booking directly —
        // finalizeBookingRequest above was already called with isEnquiry:false.
        if (amountToPay <= 0 || !razorpayOrder) {
          // setShowPaintingConfirm(true);
          clearBookingSession();
          setPrompt({
            promptTile: "Booking confirmed",
            promptBody: result?.message || "Booking confirmed",
          });
          setNavigationDecision("/");
          setShowMessageModal(true);
          setIsLoading(false);
          return;
        }

        // ✅ Open Razorpay for site visit — payment-verify flips isEnquiry:false
        await payWithRazorpay({
          bookingId,
          razorpayOrder,
          customer: data?.customer,
          API_BASE_URL,
          onSuccess: () => {
            clearBookingSession();
            setPrompt({
              promptTile: "Payment successful",
              promptBody: "Payment successful & booking confirmed",
            });
            setNavigationDecision("/");
            setShowMessageModal(true);
            setIsLoading(false);
          },
          onFailure: (msg) => {
            setShowMessageModal(true);
            setPrompt({
              promptTile: "Payment Failed",
              promptBody: msg || "Payment failed",
            });
            setNavigationDecision("close");
            setShowMessageModal(true);
            setIsLoading(false);
          },
        });
        return;
      }

      // ✅ DEEP CLEANING (first installment)
      const result = await finalizeBookingRequest(data);

      const bookingId = result?.bookingId || result?.booking?._id;
      const razorpayOrder = result?.razorpayOrder;

      if (razorpayOrder && bookingId) {
        await payWithRazorpay({
          bookingId,
          razorpayOrder,
          customer: data?.customer,
          API_BASE_URL,
          onSuccess: () => {
            clearBookingSession();
            setShowMessageModal(true);
            setPrompt({
              promptTile: "Payment successful",
              promptBody: "Payment successful & booking confirmed",
            });
            setNavigationDecision("/");
            setShowMessageModal(true);
            setIsLoading(false);
          },
          onFailure: (msg) => {
            setShowMessageModal(true);
            setPrompt({
              promptTile: "Payment Failed",
              promptBody: msg || "Payment failed",
            });
            setNavigationDecision("close");
            setShowMessageModal(true);
            setIsLoading(false);
          },
        });
        return;
      }

      setPrompt({
        promptTile: "Success",
        promptBody: result?.message || "Booking successful",
      });
      setNavigationDecision("/");
      setShowMessageModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Booking failed:", error);
      setShowMessageModal(true);
      setPrompt({
        promptTile: "Booking failed",
        promptBody: error?.message || "Booking failed. Please try again.",
      });
      setNavigationDecision("close");
      setIsLoading(false);
    }
  };

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
                      ₹{siteVisitCharge}
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
                        ? siteVisitCharge
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
                        ? siteVisitCharge
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
                      ? siteVisitCharge
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
              {!(isHousePainting && Number(siteVisitCharge || 0) === 0) && (
                <div
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "17px",
                      color: "black",
                      fontWeight: 600,
                    }}
                  >
                    Amount to pay
                  </span>
                  <span
                    style={{
                      fontSize: "17px",
                      color: "black",
                      fontWeight: 600,
                    }}
                  >
                    ₹
                    {serviceType === "house_painting"
                      ? siteVisitCharge
                      : addPrice()}
                  </span>
                </div>
              )}
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
                  {isLoading
                    ? "Processing..."
                    : isHousePainting && Number(siteVisitCharge || 0) === 0
                      ? "Confirm Booking"
                      : "Proceed to Pay"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* House Painting Confirmation Modal — no longer used.
          For site-visit-free house painting the "Confirm Booking" button
          now finalizes the booking directly without this confirmation step. */}
      {/*
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
              const result = await finalizeBookingRequest(payload);
              alert(result?.message || "Enquiry created");
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
              const result = await finalizeBookingRequest(payload);
              clearEnquiryBookingId();
              alert(result?.message || "Booking successful");
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      */}

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
      {showMessageModal && (
        <PopupModal
          show={showMessageModal}
          message={prompt}
          onSave={handleModalDone}
        />
      )}
    </div>
  );
};

export default Checkout;
