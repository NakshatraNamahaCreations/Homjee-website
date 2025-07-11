import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";

const AddressModal = ({
  show,
  handleClose,
  savedAddresses,
  selectedAddress,
  handleSelectAddress,
  newAddress,
  handleAddressChange,
  handleSaveAddress,
}) => {
  const [searchInput, setSearchInput] = useState(""); // Search input for map
  const [mapAddress, setMapAddress] = useState(""); // Address selected from map
  const [houseNumber, setHouseNumber] = useState(""); // House number input
  const [landmark, setLandmark] = useState(""); // Landmark input

  const handleLocationSelected = (loc) => {
    setMapAddress(loc);
  };

  const handleSave = () => {
    if (!houseNumber.trim()) return alert("House/Flat Number is required");
    handleSaveAddress({
      location: mapAddress,
      houseNumber,
      landmark,
    });
    setSearchInput("");
    setMapAddress("");
    setHouseNumber("");
    setLandmark("");
    handleClose(); // Close the modal
  };

  // Construct dynamic Google Maps embed URL
  const mapUrl = searchInput
    ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(searchInput)}&zoom=14`
    : `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=India&zoom=4`;

  if (!show) return null;

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
              <div
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
              </div>
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
                <Form.Label>Landmark (Optional)</Form.Label>
                <Form.Control
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Enter Landmark"
                  style={{ borderRadius: 8, fontSize: 14 }}
                />
              </Form.Group>

              <Button
                onClick={handleSave}
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