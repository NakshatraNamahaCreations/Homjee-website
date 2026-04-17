import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaCreditCard,
} from "react-icons/fa";
import SlotSelectionModal from "./SlotSelectionModal";
import AddressModal from "./AddressModal";
import { useAddressContext } from "../utils/AddressContext";
import { useSelectedSlotContext } from "../utils/SlotContext";
import { postRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS } from "../ApiService/apiConstants";
import { CartContext } from "./CartContext";
import moment from "moment";

const Checkout = () => {
  const location = useLocation();
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
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
  const [selectedSlots, setSelectedSlots] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const { addressDataContext } = useAddressContext();
  const { selectedSlot, setSelectedSlot } = useSelectedSlotContext();
  const { cartItems, updateCartItem, getQuantity, totalPrice } =
    useContext(CartContext);

  console.log("selectedAddress", selectedAddress);
  console.log("cartItems", cartItems);
  console.log("addressDataContext", addressDataContext);
  console.log("selectedSlot", selectedSlot);

  // console.log(addressDataContext);
  // Open AddressModal automatically if openAddressModal is true

  useEffect(() => {
    if (openAddressModal) {
      setShowAddressModal(true);
    }
  }, [openAddressModal]);

  // Function to handle opening the address modal
  const handleOpenAddressModal = () => {
    setShowAddressModal(true);
  };

  // Function to handle closing the address modal
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
  };

  // Function to handle new address form input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle saving a new address
  const handleSaveAddress = (address) => {
    setAddressSelection(address);
    setShowAddressModal(false);
  };

  // Function to handle selecting a predefined address
  const handleSelectAddress = (address) => {
    setAddressSelection(address);
    setShowAddressModal(false);
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
  useEffect(() => {
    if (addressSelection && !selectedSlots) {
      handleOpenSlotModal();
    }
  }, [addressSelection]);

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
  console.log("userData", userData);

  const calculateTotalAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((acc, val) => acc + val.price * (val.quantity || 1), 0)
      : 0;
  const data = {
    customer: {
      customerId: userData?._id,
      phone: userData?.mobileNumber,
      name: "Kiruthika",
    },
    service: cartItems.map((ele, idx) => ({
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
      houseFlatNumber: selectedAddress.houseNumber,
      streetArea: selectedAddress.address,
      landMark: selectedAddress.landmark,
      lat: 25.1145815,
      long: 55.1396246,
    },
    selectedSlot: {
      slotDate: selectedSlot?.date,
      slotTime: selectedSlot?.time,
    },
  };

  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Please add at least one service to the cart.");
      return;
    }
    try {
      const result = await postRequest(API_ENDPOINTS.CREATE_BOOKINGS, data);
      console.log("Booking Success", result);
      alert(result.message || "Booking successful");
      window.location.assign("/deepcleaning");
      // console.log("structed data", data);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

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
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FaPhoneAlt
                style={{ marginRight: "8px", fontSize: "14px", color: "#666" }}
              />
              <span style={{ fontSize: "14px", color: "#666" }}>
                Send booking details to
              </span>
            </div>
            {/* {isEditingPhone ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                />
                <button
                  onClick={() => setIsEditingPhone(false)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#FF0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            ) : ( */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
                +91 {userData?.mobileNumber || null}
              </p>
              {/* <FaEdit
                style={{ color: "#FF0000", cursor: "pointer" }}
                onClick={() => setIsEditingPhone(true)}
              /> */}
            </div>
            {/* )} */}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FaMapMarkerAlt
                style={{ marginRight: "8px", fontSize: "14px", color: "#666" }}
              />
              <span style={{ fontSize: "14px", color: "#666" }}>Address</span>
            </div>
            {/* {!addressSelection && (
              <button
                onClick={handleOpenAddressModal}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "transparent",
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Select an address
              </button>
            )} */}
            {selectedAddress && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <p
                  style={{ fontSize: "14px", marginTop: "8px", color: "#333" }}
                >
                  {selectedAddress?.houseNumber || ""},
                  {selectedAddress?.address || ""},
                </p>
                {/* <FaEdit
                style={{ color: "#FF0000", cursor: "pointer" }}
                onClick={handleOpenAddressModal}
              /> */}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FaClock
                style={{ marginRight: "8px", fontSize: "14px", color: "#666" }}
              />
              <span style={{ fontSize: "14px", color: "#666" }}>Slot</span>
            </div>
            <div>
              <p style={{ fontSize: "14px", marginTop: "8px", color: "#333" }}>
                {selectedSlot?.date}, {selectedSlot?.time},
              </p>
            </div>
            {/* {addressSelection && !selectedSlots ? (
              <button
                onClick={handleOpenSlotModal}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "transparent",
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Select slot
              </button>
            ) : !addressSelection ? (
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "5px",
                  fontSize: "14px",
                  color: "#888",
                  backgroundColor: "#f5f5f5",
                }}
              >
                Choose a time slot (Select an address first)
              </div>
            ) : (
              selectedSlots && (
                <p
                  style={{ fontSize: "14px", marginTop: "8px", color: "#333" }}
                >
                  {selectedSlots.date} at {selectedSlots.time}
                </p>
              )
            )} */}
          </div>
          <div style={{ marginBottom: "15px" }}>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FaCreditCard
                style={{ marginRight: "8px", fontSize: "14px", color: "#666" }}
              />
              <span style={{ fontSize: "14px", color: "#666" }}>
                Payment Method
              </span>
            </div>
            <div
              style={{
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#888",
                cursor: "pointer",
              }}
              onClick={handleOpenPaymentModal}
            >
              Select payment method
            </div> */}
            {/* {addressSelection && selectedSlots && ( */}
            <button
              onClick={handleProceedToCheckout}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "transparent",
                color: "red",
                border: "1px solid red",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Proceed to Pay
            </button>
            {/* )} */}
          </div>
        </div>

        {/* Right Section - Payment Section */}
        <div
          style={{
            flex: "1",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "5px",
              height: "fit-content",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {" "}
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
                      updateCartItem(item.name, item.price, -1, item.service)
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
                      updateCartItem(item.name, item.price, 1, item.service)
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
                  style={{ fontSize: "14px", color: "#333", fontWeight: "600" }}
                >
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "5px",
              height: "fit-content",
              padding: "1rem",
              marginTop: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h4
              style={{
                display: "block",
                color: "#333",
                fontSize: "16px",
                fontWeight: 600,
                // marginBottom: "15px",
                // paddingBottom: "5px",
                // borderBottom: "1px solid #e0e0e0",
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
                // fontWeight: 500,
              }}
            >
              <span style={{ fontSize: "13px", color: "#333" }}>
                Item total
              </span>
              <span style={{ fontSize: "13px", color: "#333" }}>
                ₹{calculateTotalAmount}
              </span>
            </div>
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
                  style={{ fontSize: "12px", color: "black", fontWeight: 300 }}
                >
                  ₹2839 payable after service
                </div>
              </span>
              <span style={{ fontSize: "14px", color: "#333" }}>
                ₹{calculateTotalAmount}
              </span>
            </div>
            <hr />
            {/* <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  // borderBottom: "1px dotted #888",
                  color: "#666",
                  fontSize: "12px",
                  marginRight: "8px",
                  flexGrow: 1,
                }}
              >
                Advance payment
              </span>
              <span style={{ fontSize: "14px", color: "#333" }}>₹349</span>
            </div> */}
            {/* <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              <span style={{ fontSize: "14px", color: "#333" }}>
                Total Amount
              </span>
              <span style={{ fontSize: "14px", color: "#333" }}>
                ₹{calculateTotalAmount}
              </span>
            </div> */}
            {/* <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "14px", color: "#333" }}>
                Advance Payment
              </span>
              <span style={{ fontSize: "14px", color: "#333" }}>₹709</span>
            </div>
            <p
              style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}
            >
              ₹2839 payable after the service
            </p>
            <div style={{ textAlign: "right" }}>
              <h4
                style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}
              >
                Amount to pay
              </h4>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
               ₹{calculateTotalAmount}
              </p>
              <a
                href="#"
                style={{ color: "black", textDecoration: "", fontSize: "12px" }}
              >
                View breakup
              </a>
            </div> */}
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                // fontWeight: 500,
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
                ₹{calculateTotalAmount}
              </span>
            </div>
            {/* <div style={{ textAlign: "right" }}>
              <h4
                style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}
              >
                
              </h4>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
                ₹{calculateTotalAmount}
              </p>
            </div> */}
          </div>
        </div>
      </div>
      {/* Address Modal */}
      <AddressModal
        show={showAddressModal}
        handleClose={handleCloseAddressModal}
        savedAddresses={savedAddresses}
        selectedAddress={addressSelection}
        handleSelectAddress={handleSelectAddress}
        newAddress={newAddress}
        handleAddressChange={handleAddressChange}
        handleSaveAddress={handleSaveAddress}
        type="checkout"
      />

      {/* Slot Selection Modal */}
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
