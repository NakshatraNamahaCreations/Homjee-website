import React, { useState } from "react";
import moment from "moment";

const SlotSelectionModal = ({ show, onClose, handleSelectSlot }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  // console.log("selectedDate", selectedDate);
  // console.log("selectedTimeSlot", selectedTimeSlot);
  if (!show) return null;

  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return { day, fullDate };
  });
  // const isoDate = moment(selectedDate, "ddd, MMM DD, YYYY").toISOString(); //old/storing as ISO
  const isoDate = moment(selectedDate).format("YYYY-MM-DD");
  // console.log("isoDate", isoDate);

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
  ];

  const canProceed = selectedDate && selectedTimeSlot;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1000,
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 20,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          zIndex: 1001,
          fontFamily: "'Roboto', sans-serif",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <h3
            style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#333" }}
          >
            When should the professional arrive?
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#666",
              lineHeight: 1,
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: 14, marginBottom: 20, color: "#666" }}>
          Service will take approx. 5 hrs
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {dates.map((dateObj, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(dateObj.fullDate)}
              style={{
                flex: 1,
                width: 47,
                height: 47,
                borderRadius: 8,
                border:
                  selectedDate === dateObj.fullDate
                    ? "2px solid #FF0000"
                    : "1px solid #ccc",
                backgroundColor:
                  selectedDate === dateObj.fullDate ? "#FF0000" : "#fff",
                cursor: "pointer",
                fontWeight: 500,
                color: selectedDate === dateObj.fullDate ? "#fff" : "#333",
                fontSize: 12,
                transition: "all 0.2s ease",
                whiteSpace: "normal",
                lineHeight: "1.2",
                padding: "2px 4px",
              }}
              aria-pressed={selectedDate === dateObj.fullDate}
              title={dateObj.fullDate}
            >
              {dateObj.day}
              <br />
              {dateObj.fullDate.split(", ")[1]}
            </button>
          ))}
        </div>

        <h4
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 10,
            color: "#333",
          }}
        >
          Select start time of service
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {timeSlots.map((time, index) => (
            <button
              key={index}
              onClick={() => setSelectedTimeSlot(time)}
              style={{
                padding: 10,
                borderRadius: 6,
                border:
                  selectedTimeSlot === time
                    ? "2px solid #FF0000"
                    : "1px solid #ccc",
                backgroundColor: selectedTimeSlot === time ? "#FF0000" : "#fff",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 13,
                color: selectedTimeSlot === time ? "#fff" : "#333",
                transition: "all 0.2s ease",
              }}
              aria-pressed={selectedTimeSlot === time}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Proceed to Checkout */}
        <button
          disabled={!canProceed}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            backgroundColor: canProceed ? "#FF0000" : "#ccc",
            color: "#fff",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => {
            if (canProceed) {
              const selectedSlot = {
                date: isoDate,
                time: selectedTimeSlot,
              };
              handleSelectSlot(selectedSlot);
            } else {
              null;
            }
          }}
        >
          Proceed to checkout
        </button>
      </div>
    </>
  );
};

export default SlotSelectionModal;
