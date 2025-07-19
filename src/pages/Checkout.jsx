import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaCreditCard,
} from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { useAddressContext } from "../utils/AddressContext";
import { useSelectedSlotContext } from "../utils/SlotContext";
import { getRequest, postRequest, putRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS } from "../ApiService/apiConstants";
import { CartContext } from "./CartContext";
import moment from "moment";
import { Button, Form, Modal } from "react-bootstrap";
import SlotSelectionModal from "./SlotSelectionModal";
import "./checkout.css";

const Checkout = () => {
  const location = useLocation();
  const { serviceType } = location.state || {};
  console.log("serviceType", serviceType);
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
  const showSelectedSlot = JSON.parse(sessionStorage.getItem("selectedSlots"));

  const { phoneNumber: initialPhoneNumber, openAddressModal } =
    location.state || { phoneNumber: "", openAddressModal: false };
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSelection, setAddressSelection] = useState(null);
  // const { cartItems, updateCartItem, getQuantity, totalPrice } =
  //   useContext(CartContext);
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [showSlotModal, setShowSlotModal] = useState(true);
  const [priceConfig, setPriceConfig] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const { addressDataContext, setAddressDataContext } = useAddressContext();
  const { selectedSlot, setSelectedSlot } = useSelectedSlotContext();
  const { cartItems, setCartItems, updateCartItem, getQuantity, totalPrice } =
    useContext(CartContext);

  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [showAnotherPopup, setAnotherPopup] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const [mapAddress, setMapAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");

  console.log("selectedAddress from session", selectedAddress);
  // console.log("cartItems", cartItems);
  console.log("addressDataContext context api", addressDataContext);
  // console.log("showSelectedSlot", showSelectedSlot);

  const handleCurrentLocation = () => {
    const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    // Clear any previous watch ID if you were using one (optional safeguard)
    // navigator.geolocation.clearWatch(previousWatchId);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Lat:", latitude, "Lng:", longitude);

        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

        try {
          const response = await fetch(geocodingUrl);
          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            const addressComponents = data.results[0].address_components;

            const city = addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name;

            const town = addressComponents.find((component) =>
              component.types.includes("sublocality_level_1")
            )?.long_name;

            // ✅ Update map URL and address
            setMapUrl(
              `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
            );
            setMapAddress(address || `${city || ""} ${town || ""}`);

            setAnotherPopup(false);
            // ✅ Show location confirmation modal
            setShowLocationPopup(true);
          } else {
            alert("Could not fetch a valid address from your location.");
          }
        } catch (error) {
          console.error("Geocoding Error:", error);
          alert("Something went wrong while fetching the address.");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        if (error.code === 1) {
          alert("Permission to access location was denied.");
        } else if (error.code === 2) {
          alert("Location unavailable.");
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // ✅ increase timeout to reduce "Timeout expired" error
        maximumAge: 0, // Always fetch fresh location
      }
    );
  };

  const handleAddress = async () => {
    console.log("function called");
    const uniqueCode = `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const data = {
      savedAddress: {
        uniqueCode: uniqueCode,
        address: mapAddress,
        houseNumber: houseNumber,
        landmark: landmark,
      },
    };

    if (!houseNumber.trim()) return alert("House/Flat Number is required");

    try {
      const result = await putRequest(
        `${API_ENDPOINTS.SAVE_ADDRESS}${userData?._id}`,
        data
      );
      setAddressDataContext(data.savedAddress);
      sessionStorage.setItem(
        "selectedAddress",
        JSON.stringify(data.savedAddress)
      );
      setShowLocationPopup(false);
      setAnotherPopup(false);
      console.log("Address Saved", result);
      // alert(result.message || "Address Saved");
    } catch (error) {
      console.error("Address failed:", error);
    }
  };

  // useEffect(() => {
  //   if (serviceType === "house-painters") {
  //     setCartItems([]); // Clears the cart
  //   }
  // }, [serviceType]);

  const cancellationsData = [
    {
      id: 1,
      title: "More than 48 hrs before the service",
      fee: "Free",
    },
    {
      id: 1,
      title: "Within 48 hrs of the service",
      fee: "Up to ₹499",
    },
    {
      id: 1,
      title: "Within 24 hrs of the service",
      fee: "Up to ₹999",
    },
  ];
  const handleSelectAddress = (addr) => {
    console.log(addr);
    setAddressDataContext(addr);
    setSelectedAddressId(addr.uniqueCode);
    sessionStorage.setItem("selectedAddress", JSON.stringify(addr));
    // navigate("/deep-cleaning-packages");
  };
  // Function to handle opening the slot modal
  const handleOpenSlotModal = () => {
    setShowSlotModal(true);
  };

  // Function to handle closing the slot modal
  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
  };

  // Function to handle selecting a slot
  const handleSelectSlot = (slot) => {
    // console.log("slot", slot);
    setSelectedSlot(slot);
    sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
    setShowSlotModal(false);
  };

  // Function to handle opening the payment modal
  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  // Function to handle closing the payment modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleSelectPaymentOption = (e) => {
    console.log("target option", e);
    // setShowPaymentModal(false);
  };

  // Automatically open slot modal after address is selected
  // useEffect(() => {
  //   if (addressSelection && !selectedSlots) {
  //     handleOpenSlotModal();
  //   }
  // }, [addressSelection]);

  // Predefined addresses for demonstration
  const savedAddresses = [
    {
      houseNumber: "123",
      street: "Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    },
    {
      houseNumber: "456",
      street: "Park Avenue",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001",
    },
  ];

  // Predefined slots for demonstration
  const availableSlots = [
    { date: "2025-06-06", time: "10:00 AM - 12:00 PM" },
    { date: "2025-06-06", time: "02:00 PM - 04:00 PM" },
    { date: "2025-06-07", time: "09:00 AM - 11:00 AM" },
  ];

  // Predefined payment methods for demonstration
  const paymentMethods = [
    { name: "Credit/Debit Card" },
    { name: "UPI" },
    { name: "Net Banking" },
    { name: "Cash on Delivery" },
  ];
  // console.log("userData", userData);

  const calculateTotalAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((acc, val) => acc + val.price * (val.quantity || 1), 0)
      : 0;

  const checkEnquiry = () => {
    if (serviceType === "house-painters" && priceConfig?.siteVisitCharge > 0) {
      return false;
    } else if (serviceType === "deep-cleaning") {
      return false;
    } else {
      return true;
    }
  };

  const data = {
    customer: {
      customerId: userData?._id,
      phone: userData?.mobileNumber,
      name: "Kiruthika",
    },
    service:
      serviceType === "house-painters"
        ? [
            {
              category: "House Painters & Waterproofing",
              serviceName: "House Painters & Waterproofing",
              price: priceConfig?.siteVisitCharge || 0,
              quantity: 1,
            },
          ]
        : cartItems.map((ele) => ({
            category: "Deep Cleaning",
            serviceName: ele.name,
            price: ele.price,
            quantity: ele.quantity,
          })),

    bookingDetails: {
      bookingDate: moment().toISOString(),
      bookingTime: moment().format("LT"),
      paidAmount: calculateTotalAmount || 0,
    },
    address: {
      houseFlatNumber: selectedAddress?.houseNumber,
      streetArea: selectedAddress?.address,
      landMark: selectedAddress?.landmark,
      lat: 25.1145815,
      long: 55.1396246,
    },
    selectedSlot: {
      slotDate: showSelectedSlot?.date,
      slotTime: showSelectedSlot?.time,
    },
    // isEnquiry: checkEnquiry,
  };

  const handleProceedToCheckout = async () => {
    // if (cartItems.length === 0) {
    //   alert("Please add at least one service to the cart.");
    //   return;
    // }
    try {
      const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);
      console.log("Booking Success", result);
      alert(result.message || "Booking successful");
      window.location.assign("/");
      // console.log("structed data", data);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const fetchServiceConfig = async () => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_SERVICE_PRICE_CONFIG);
      // console.log("response", response);
      // console.log("API RES", API_ENDPOINTS.GET_SERVICE_PRICE_CONFIG);
      setPriceConfig(response.data);
    } catch (error) {
      console.error("GET error:", error.response || error);
      throw error.response ? error.response.data : error;
    }
  };
  useEffect(() => {
    fetchServiceConfig();
  }, []);
  const handleEnquiry = () => {
    alert("Enquiry Submitted!");
    // window.location.assign("/");
  };
  // console.log("priceConfig", priceConfig);
  return (
    <div className="d-none d-lg-block">
      <div
        style={{
          width: "1200px",
          margin: "40px auto",
          display: "flex",
          gap: "20px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Left Section */}
        <div
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
              // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <p
                  style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}
                >
                  +91 {userData?.mobileNumber || null}
                </p>
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
                <span style={{ fontSize: "14px", color: "#666" }}>Address</span>{" "}
              </div>
              {/* {selectedAddress && ( */}
              {/* <> */}
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
                    {`${selectedAddress?.tag || "Home"} - ${
                      selectedAddress?.houseNumber || ""
                    }${
                      selectedAddress?.address
                        ? `, ${
                            selectedAddress.address.length > 50
                              ? selectedAddress.address.substring(0, 50) + "..."
                              : selectedAddress.address
                          }`
                        : ""
                    }`}
                  </p>
                </div>

                <button
                  onClick={() => setIsLocationModalVisible(true)}
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
              {/* </> */}
              {/* )} */}
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
              {showSelectedSlot === null && (
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
                    }}
                  >
                    Select time & date
                  </button>
                </div>
              )}
              {showSelectedSlot && (
                <>
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
                      >
                        {showSelectedSlot?.date}, {showSelectedSlot?.time}
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
                </>
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
              Free cancellations if done more than 48 hrs before the service or
              if a professional isn’t assigned. A fee will be charged otherwise.
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
              <div className="mt-4">
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
                {cancellationsData.map((ele, idx) => (
                  <div
                    key={idx + 1}
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
              paddingRight: "10px", // To avoid layout shift when hiding scrollbar
              marginBottom: "100px", // space for fixed bottom section
            }}
          >
            {(serviceType === "deep-cleaning" && cartItems.length > 0) ||
            (serviceType === "house-painters" &&
              priceConfig?.siteVisitCharge > 0) ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  height: "fit-content",
                  padding: "1rem",
                  border: "1px solid #e3e3e3",
                  // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {serviceType === "deep-cleaning" && cartItems.length > 0 ? (
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
                                item.service
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
                                item.service
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
                ) : serviceType === "deep-cleaning" &&
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

                {serviceType === "house-painters" &&
                  priceConfig?.siteVisitCharge > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#333" }}>
                        House Painters & Waterproofing
                      </span>
                      <span style={{ fontSize: "13px", color: "#333" }}>
                        ₹{priceConfig.siteVisitCharge}
                      </span>
                    </div>
                  )}
              </div>
            ) : null}
            {(serviceType === "deep-cleaning" && cartItems.length > 0) ||
            (serviceType === "house-painters" &&
              priceConfig?.siteVisitCharge > 0) ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  height: "fit-content",
                  padding: "1rem",
                  border: "1px solid #e3e3e3",
                  marginTop: 15,
                  marginBottom: "10px",
                  // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                  <span style={{ fontSize: "13px", color: "#333" }}>
                    Item total
                  </span>
                  <span style={{ fontSize: "13px", color: "#333" }}>
                    ₹
                    {serviceType === "house-painters"
                      ? priceConfig?.siteVisitCharge
                      : calculateTotalAmount}
                  </span>
                </div>
                {serviceType === "deep-cleaning" && (
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
                        ₹2839 payable after service
                      </div>
                    </span>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      ₹
                      {serviceType === "house-painters"
                        ? priceConfig?.siteVisitCharge
                        : calculateTotalAmount}{" "}
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
                    style={{ fontSize: "15px", color: "#333", fontWeight: 600 }}
                  >
                    Amount to pay
                  </span>
                  <span
                    style={{ fontSize: "15px", color: "#333", fontWeight: 600 }}
                  >
                    ₹
                    {serviceType === "house-painters"
                      ? priceConfig?.siteVisitCharge
                      : calculateTotalAmount}
                  </span>
                </div>
              </div>
            ) : null}

            {serviceType === "house-painters" &&
            (!priceConfig || priceConfig?.siteVisitCharge <= 0) ? (
              <button
                onClick={showSelectedSlot ? handleProceedToCheckout : null}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: showSelectedSlot ? "red" : "#7c7c7c17",
                  color: showSelectedSlot ? "white" : "#a3a3a3ff",
                  border: showSelectedSlot
                    ? "1px solid red"
                    : "1px solid #ffffff17",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  cursor: showSelectedSlot ? "pointer" : "not-allowed",
                }}
              >
                Enquiry
              </button>
            ) : null}
          </div>
          {(serviceType === "deep-cleaning" && cartItems.length > 0) ||
          (serviceType === "house-painters" &&
            priceConfig?.siteVisitCharge > 0) ? (
            <div
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
                padding: "1rem",
                position: "fixed",
                bottom: 0,
                // left: 0,
                // right: "75%",
                zIndex: 10,
                width: "44%",
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
                  style={{ fontSize: "16px", color: "black", fontWeight: 600 }}
                >
                  Amount to pay
                </span>
                <span
                  style={{ fontSize: "16px", color: "black", fontWeight: 600 }}
                >
                  ₹
                  {serviceType === "house-painters"
                    ? priceConfig?.siteVisitCharge
                    : calculateTotalAmount}
                </span>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <button
                  onClick={showSelectedSlot ? handleProceedToCheckout : null}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: showSelectedSlot ? "red" : "#7c7c7c17",
                    color: showSelectedSlot ? "white" : "#a3a3a3ff",
                    border: showSelectedSlot
                      ? "1px solid red"
                      : "1px solid #ffffff17",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginTop: "10px",
                    cursor: showSelectedSlot ? "pointer" : "not-allowed",
                  }}
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        centered
        backdrop="static"
        keyboard={false}
        show={isLocationModalVisible}
        onHide={() => setIsLocationModalVisible(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Saved Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              color: "#e60000",
              fontSize: 14,
              textAlign: "left",
              marginBottom: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              setAnotherPopup(true);
              setIsLocationModalVisible(false);
            }}
          >
            + Add another address
          </div>
          {userData && userData?.savedAddress?.length > 0 && (
            <div className="mt-4">
              {userData?.savedAddress?.map((ele, idx) => (
                <div key={idx}>
                  <div
                    className="row"
                    style={{
                      marginBottom: 10,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => handleSelectAddress(ele)}
                  >
                    <div className="col-md-1">
                      {/* <input
                              type="radio"
                              name="selectedAddress"
                              checked={ele.uniqueCode === selectedAddressId}
                              onChange={() => handleSelectAddress(ele)}
                            /> */}
                      <Form.Check // prettier-ignore
                        type="radio"
                        id={ele.uniqueCode}
                        name="selectedAddress"
                        checked={ele.uniqueCode === selectedAddressId}
                        // onChange={() => handleSelectAddress(ele)}
                        // label={`default ${type}`}
                      />
                    </div>

                    <div
                      className="col-md-11"
                      style={{
                        fontSize: "12px",
                        textAlign: "left",
                      }}
                    >
                      {ele.houseNumber}, {ele.address}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
          {selectedAddressId !== null && (
            <div
              onClick={() => setIsLocationModalVisible(false)}
              style={{
                backgroundColor: "#FF0000",
                color: "white",
                cursor: "pointer",
                padding: "10px",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              Procced
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: 12,
              marginTop: 20,
            }}
          >
            powered by{" "}
            <span style={{ color: "#4285F4", fontWeight: 600 }}>G</span>
            <span style={{ color: "#EA4335", fontWeight: 600 }}>o</span>
            <span style={{ color: "#FBBC05", fontWeight: 600 }}>o</span>
            <span style={{ color: "#4285F4", fontWeight: 600 }}>g</span>
            <span style={{ color: "#34A853", fontWeight: 600 }}>l</span>
            <span style={{ color: "#EA4335", fontWeight: 600 }}>e</span>
          </div>
        </Modal.Body>
      </Modal>
      {/* asking current location */}
      <Modal
        centered
        backdrop="static"
        keyboard={false}
        show={showAnotherPopup}
        onHide={() => {
          setAnotherPopup(false);
          setIsLocationModalVisible(true);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Add New Address</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            onClick={handleCurrentLocation}
            style={{
              color: "#FF0000",
              cursor: "pointer",
              padding: "10px",
              fontSize: "14px",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <FaMapMarkerAlt style={{ marginRight: 8 }} />
            Use current location
          </div>
        </Modal.Body>
        {/* <Modal.Footer>vcbnvcnbvc</Modal.Footer> */}
      </Modal>
      {/* showing current location */}
      <Modal
        show={showLocationPopup}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setShowLocationPopup(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Current Location</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <iframe
                title="map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={mapUrl}
              />
            </div>
            <div className="col-md-6">
              <div>
                <div
                  style={{
                    marginBottom: 16,
                  }}
                >
                  {/* <Button
                        variant="outline-danger"
                        onClick={() => {
                          setAnotherPopup(true);
                          console.log("popup opened");
                        }}
                        style={{
                          marginBottom: 20,
                        }}
                      >
                        Change
                      </Button> */}
                  <div style={{ fontSize: 14 }}>{mapAddress}</div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>
                    House/Flat Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="Enter House/Flat Number"
                    style={{ borderRadius: 8, fontSize: 14 }}
                  />
                </Form.Group>
                {/* <Form.Group className="mb-3">
                      <Form.Label>
                        Street Location <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        // value={mapAddress}
                        // onChange={(e) => setMapAddress(e.target.value)}
                        placeholder="Enter House/Flat Number"
                        style={{ borderRadius: 8, fontSize: 14 }}
                      />
                    </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Landmark (Optional)</Form.Label>
                  <Form.Control
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Enter Landmark"
                    style={{ borderRadius: 8, fontSize: 14 }}
                  />
                </Form.Group>

                <Button
                  onClick={handleAddress}
                  disabled={!houseNumber.trim()}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: !houseNumber.trim() ? "#eee" : "#FF0000",
                    color: !houseNumber.trim() ? "#aaa" : "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    // fontWeight: 600,
                    cursor: !houseNumber.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Save and proceed
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>vcbnvcnbvc</Modal.Footer> */}
      </Modal>

      <SlotSelectionModal
        show={showSlotModal}
        onClose={handleCloseSlotModal}
        availableSlots={availableSlots}
        handleSelectSlot={handleSelectSlot}
      />

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: "1000",
            }}
            onClick={handleClosePaymentModal}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "600px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              zIndex: "1001",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "0",
                  color: "#333",
                }}
              >
                Select Payment Method
              </h3>
              <button
                onClick={handleClosePaymentModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#333",
                }}
              >
                Payment Options
              </h4>
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "5px",
                    marginBottom: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    transition: "background-color 0.3s",
                  }}
                  onClick={(e) => handleSelectPaymentOption(e.target.value)}
                >
                  <p
                    key={index}
                    style={{ fontSize: "14px", margin: "0", color: "#333" }}
                  >
                    {method.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
