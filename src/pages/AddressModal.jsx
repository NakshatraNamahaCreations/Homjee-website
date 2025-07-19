import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";
import LocationSearchInput from "./LocationSearchInput";
import { useAddressContext } from "../utils/AddressContext";
import { useNavigate } from "react-router-dom";
import { putRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS } from "../ApiService/apiConstants";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";

const AddressModal = ({
  show,
  handleClose,
  savedAddresses,
  selectedAddress,
  handleSelectAddress,
  newAddress,
  handleAddressChange,
  handleSaveAddress,
  // type,
}) => {
  const navigate = useNavigate();

  const [coords, setCoords] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // Search input for map
  const [mapAddress, setMapAddress] = useState(""); // Address selected from map
  const [houseNumber, setHouseNumber] = useState(""); // House number input
  const [landmark, setLandmark] = useState(""); // Landmark input
  const { addressDataContext, setAddressDataContext } = useAddressContext();
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const handleLocationSelected = (loc) => {
    setMapAddress(loc);
  };

  // const handleSelect = async (address) => {
  //   setSearchInput(address);
  //   const results = await geocodeByAddress(address);
  //   const latLng = await getLatLng(results[0]);
  //   console.log("Lat/Lng:", latLng);
  //   // If you want, update your mapUrl with lat/lng instead
  // };

  const handleSave = async () => {
    const addressObj = {
      address: mapAddress,
      houseNumber: houseNumber,
      landmark: landmark,
    };
    if (!houseNumber.trim()) return alert("House/Flat Number is required");

    // handleSaveAddress({
    //   location: mapAddress,
    //   houseNumber,
    //   landmark,
    // });
    setAddressDataContext(addressObj);
    sessionStorage.setItem("selectedAddress", JSON.stringify(addressObj));
    // await handleSaveAddress();
    setSearchInput("");
    setMapAddress("");
    setHouseNumber("");
    setLandmark("");
    handleClose(); // Close the modal
    navigate("/deep-cleaning-packages");
  };

  const handleAddress = async () => {
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
      console.log("Address Saved", result);
      handleClose();
      navigate("/deep-cleaning-packages");
      alert(result.message || "Address Saved");
    } catch (error) {
      console.error("Address failed:", error);
    }
  };

  // Construct dynamic Google Maps embed URL
  const mapUrl = searchInput
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk&q=${encodeURIComponent(
        searchInput
      )}&zoom=14`
    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk&q=India&zoom=4`;

  if (!show) return null;
  // console.log("searchInput", searchInput);
  return (
    <div
      id="modal-backdrop"
      onClick={(e) => e.target.id === "modal-backdrop" && handleClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1040,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: 960,
          maxWidth: "98vw",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          overflow: "hidden",
          padding: "30px",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Row>
          <Col md={6}>
            {/* Search Input for Location */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search location (e.g., area, city)"
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </Form.Group>
            {/* 
            <LocationSearchInput setCoordinates={setCoords} />
            {coords && (
              <iframe
                title="map"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
              />
            )} */}

            {/* Google Map iframe */}
            <div style={{ position: "relative", height: "400px" }}>
              <iframe
                title="map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={mapUrl}
              />

              {/* <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "55%",
                  transform: "translate(-50%, -50%)",
                  background: "#222",
                  color: "#fff",
                  padding: "12px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.11)",
                  pointerEvents: "none",
                }}
              >
                Place the pin accurately on map
              </div> */}
            </div>
          </Col>
          <Col md={6}>
            {/* Right: Form for address details */}
            <div style={{ padding: "24px 0 0 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {mapAddress}
                </div>
                <Button
                  variant="link"
                  onClick={() => setMapAddress("")}
                  style={{
                    textDecoration: "none",
                    color: "#FF0000",
                    fontWeight: 500,
                  }}
                >
                  Change
                </Button>
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
              <Form.Group className="mb-3">
                <Form.Label>
                  Street Location <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  value={mapAddress}
                  onChange={(e) => setMapAddress(e.target.value)}
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
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: !houseNumber.trim() ? "not-allowed" : "pointer",
                }}
              >
                Save and proceed
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddressModal;
