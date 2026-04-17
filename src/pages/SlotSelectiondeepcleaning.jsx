import React, { useState } from "react";
import { useSelectedSlotContext } from "../utils/SlotContext";

const SlotSelectiondeepcleaning = ({
  show,
  onClose,
  onSelect,
  availableSlots,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const { setSelectedSlot } = useSelectedSlotContext();

  if (!show) return null;

  // Use provided availableSlots instead of generating dates
  const dates = availableSlots.map((slot) => ({
    day: new Date(slot.date).toLocaleDateString("en-US", { weekday: "short" }),
    fullDate: new Date(slot.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }));

  const timeSlots = availableSlots
    .filter(
      (slot, index, self) =>
        index ===
        self.findIndex((s) => s.date === slot.date && s.time === slot.time)
    )
    .map((slot) => slot.time);

  // Button enabled only if both date and time are selected
  const canProceed = selectedDate && selectedTimeSlot;

  const handleSelectSlot = () => {
    const selectedSlot = {
      date: selectedDate,
      time: selectedTimeSlot,
    };
    setSelectedSlot(selectedSlot);
    onSelect(selectedSlot);
  };

  // console.log("selectedDate", typeof selectedDate);
  // console.log("selectedTimeSlot", typeof selectedTimeSlot);
  return (
    <>
      {/* Backdrop */}
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

      {/* Modal */}
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
        {/* Header */}
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

        {/* Subtext */}
        <p style={{ fontSize: 14, marginBottom: 20, color: "#666" }}>
          Service will take approx. 5 hrs
        </p>

        {/* Date Selector */}
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

        {/* Time Slot Selector */}
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
          onClick={handleSelectSlot}
        >
          Proceed to Select the Slot
        </button>
      </div>
    </>
  );
};

export default SlotSelectiondeepcleaning;
