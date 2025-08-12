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
import map from "../assets/map.png";
import searchLocation from "../assets/search-location.png";
import Autocomplete from "react-google-autocomplete";

const Checkout = () => {
  const location = useLocation();
  const { serviceType } = location.state || {};
  console.log("serviceType", serviceType);
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
  const showSelectedSlot = JSON.parse(sessionStorage.getItem("selectedSlots"));

  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

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
  const [showSlotModal, setShowSlotModal] = useState(false);
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

  const [mapLat, setMapLat] = useState(null);
  const [mapLng, setMapLng] = useState(null);
  const [mapUrl, setMapUrl] = useState("");
  const [userAddress, setUserAddress] = useState(null);

  const [mapAddress, setMapAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showSearchBarOptions, setShowSearchBarOptions] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showOptionOpoup, setShowOptionOpoup] = useState(false);
  console.log("cartItems", cartItems);

  console.log("addressDataContext context api", addressDataContext);
  const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
        try {
          const response = await fetch(geocodingUrl);
          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setMapAddress(address);
            setMapUrl(
              `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
            );
            setHouseNumber("");
            setLandmark("");
            setShowOptionOpoup(false);
            setShowLocationPopup(true);
          }
        } catch (error) {
          alert("Error getting location.");
        }
      },
      (error) => alert("Location error: " + error.message),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };
  useEffect(() => {
    if (isNewUser && showLocationPopup) {
      handleCurrentLocation();
    }
  }, [isNewUser, showLocationPopup]);

  const fetchUserAddress = async () => {
    try {
      const response = await getRequest(
        `${API_ENDPOINTS.GET_ADDRESS}${userData?._id}`
      );
      if (response.address) {
        setIsNewUser(false);
        setUserAddress(response.address);
        const urlMap = `https://www.google.com/maps?q=${response.address.latitude},${response.address.longitude}&z=15&output=embed`;
        setMapUrl(urlMap);
        setMapAddress(response.address.address);
        setLatitude(response.address.latitude);
        setLongitude(response.address.longitude);
        setHouseNumber((prev) =>
          prev.trim() ? prev : response.address?.houseNumber || ""
        );
        setLandmark((prev) =>
          prev.trim() ? prev : response.address?.landmark || ""
        );
      } else {
        setIsNewUser(true);
        setLocationRequested(true);
        setMapAddress("");
        setMapUrl("");
        handleCurrentLocation();
      }
    } catch (error) {
      console.error("GET error:", error.response || error);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchUserAddress();
    }
  }, [userData?._id]);

  const handleAddress = async () => {
    console.log("function called");
    const uniqueCode = `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const data = {
      savedAddress: {
        uniqueCode: uniqueCode,
        address: mapAddress,
        houseNumber: houseNumber,
        landmark: landmark,
        latitude: latitude,
        longitude: longitude,
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
    }
    return true;
  };

  const data = {
    customer: {
      customerId: userData?._id,
      phone: userData?.mobileNumber,
      name: userData?.userName,
    },
    service:
      serviceType === "house-painters"
        ? [
            {
              // category: "House Painters & Waterproofing",
              category: "House Painting",
              serviceName: "House Painters & Waterproofing",
              price: priceConfig?.siteVisitCharge || 0,
              quantity: 1,
            },
          ]
        : cartItems.map((ele) => ({
            category: "Deep Cleaning",
            subCategory: ele.service,
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
      houseFlatNumber: selectedAddress?.houseNumber || "",
      streetArea: selectedAddress?.address || "",
      landMark: selectedAddress?.landmark || "",
      location: {
        type: "Point",
        coordinates: [
          selectedAddress?.longitude || 0,
          selectedAddress?.latitude || 0,
        ],
      },
    },
    selectedSlot: {
      slotDate: showSelectedSlot?.date,
      slotTime: showSelectedSlot?.time,
    },
    isEnquiry: checkEnquiry(),
  };

  const handleProceedToCheckout = async () => {
    // if (cartItems.length === 0) {
    //   alert("Please add at least one service to the cart.");
    //   return;
    // }
    try {
      const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);
      console.log("Booking Success", result);
      setCartItems([]);
      sessionStorage.clear();
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
        className="row"
        style={{
          // width: "1200px",
          margin: "30px auto",
          // display: "flex",
          // gap: "20px",
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
              // style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{ fontSize: "14px", color: "#333", fontWeight: "600" }}
                >
                  {userData?.userName || null}
                </div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  +91 {userData?.mobileNumber || null}
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
                            selectedAddress.address.length > 30
                              ? selectedAddress.address.substring(0, 30) + "..."
                              : selectedAddress.address
                          }`
                        : ""
                    }`}
                  </p>
                </div>

                <button
                  onClick={() => setShowLocationPopup(true)}
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
                        {moment(showSelectedSlot?.date).format("ll")},{" "}
                        {showSelectedSlot?.time}
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
              paddingRight: "10px", // To avoid layout shift when hiding scrollbar
              marginBottom: "70px", // space for fixed bottom section
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
                        ₹0
                        {/* ₹2839 payable after service */}
                      </div>
                    </span>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      ₹ 0
                      {/* {serviceType === "house-painters"
                        ? priceConfig?.siteVisitCharge
                        : calculateTotalAmount}{" "} */}
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
                  // cursor: "pointer",
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
                    // cursor: "pointer",
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
        show={showLocationPopup}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setShowLocationPopup(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Change Address</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {showSearchBarOptions ? (
                  <Autocomplete
                    apiKey={GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      if (place.geometry) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        const formattedAddress = place.formatted_address;

                        setLatitude(lat);
                        setLongitude(lng);
                        setMapAddress(formattedAddress);
                        setMapUrl(
                          `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
                        );

                        setIsLocationModalVisible(false);
                        setShowLocationPopup(true);
                      }
                    }}
                    style={{
                      width: "100%",
                      backgroundColor: "#f1f1f1",
                      border: "1px solid #dfdfdf",
                      borderRadius: "6px",
                      padding: "7px 10px",
                      color: "black",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                ) : null}

                <div style={{ height: "300px", width: "100%" }}>
                  {mapUrl ? (
                    <iframe
                      title="map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={mapUrl}
                    />
                  ) : (
                    <div
                      style={{
                        color: "#999",
                        textAlign: "center",
                        paddingTop: 130,
                      }}
                    >
                      Loading map...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div>
                {isNewUser ? (
                  mapAddress ? (
                    <div style={{ fontSize: 14, marginBottom: 16 }}>
                      {mapAddress}
                    </div>
                  ) : (
                    <div style={{ fontSize: 14, color: "#999" }}>
                      Detecting current location...
                    </div>
                  )
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      onClick={() => {
                        setShowLocationPopup(false);
                        setShowOptionOpoup(true);
                      }}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        alignSelf: "flex-start",
                        padding: "6px 12px",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      Change
                    </Button>
                    <div className="mt-4" style={{ fontSize: 14 }}>
                      {mapAddress}
                    </div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>
                    House/Flat Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    defaultValue={houseNumber}
                    onChange={(e) => {
                      console.log("Typing:", e.target.value);
                      setHouseNumber(e.target.value);
                    }}
                    placeholder="Enter House/Flat Number"
                    style={{ borderRadius: 8, fontSize: 14 }}
                  />
                </Form.Group>

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

                    cursor: !houseNumber.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Save and proceed
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showOptionOpoup}
        size="small"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setShowOptionOpoup(false);
          setShowLocationPopup(true);
        }}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleCurrentLocation}
              >
                <img src={map} style={{ width: "50%" }} />
              </div>
              <p style={{ textAlign: "center" }}>Current Location</p>
            </div>
            <div className="col-md-6">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setHouseNumber("");
                  setLandmark("");
                  setShowOptionOpoup(false);
                  setShowLocationPopup(true);
                  setShowSearchBarOptions(true);
                }}
              >
                <img src={searchLocation} style={{ width: "50%" }} />
              </div>
              <p style={{ textAlign: "center" }}>Search By Location</p>
            </div>
          </div>
        </Modal.Body>
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
