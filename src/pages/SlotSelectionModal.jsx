

// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";

// const SlotSelectionModal = ({
//   show,
//   onClose,
//   handleSelectSlot,
//   fetchAvailableSlots,
//   type = "booking", // "booking" | "reschedule"
// }) => {
//   // ✅ Hooks MUST always run
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);

//   const dates = useMemo(() => {
//     const today = new Date();
//     return Array.from({ length: 8 }, (_, i) => {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);

//       return {
//         label: date.toLocaleDateString("en-US", { weekday: "short" }),
//         date,
//         value: moment(date).format("YYYY-MM-DD"),
//         display: date.getDate(),
//       };
//     });
//   }, []);

//   // ✅ Auto-select today's date when modal opens
//   useEffect(() => {
//     try {
//       if (show && dates.length > 0) {
//         setSelectedDate(dates[0].value);
//       }
//     } catch (err) {
//       console.error("Auto-select date error:", err);
//     }
//   }, [show, dates]);

//   // ✅ Fetch slots when date changes
//   useEffect(() => {
//     if (!selectedDate || !fetchAvailableSlots) return;

//     const loadSlots = async () => {
//       try {
//         setLoadingSlots(true);
//         setAvailableSlots([]);
//         setSelectedTimeSlot(null);

//         const slots = await fetchAvailableSlots(selectedDate);
//         setAvailableSlots(slots || []);
//       } catch (err) {
//         console.error("Failed to fetch slots", err);
//       } finally {
//         setLoadingSlots(false);
//       }
//     };

//     loadSlots();
//   }, [selectedDate, fetchAvailableSlots]);

//   const canProceed = selectedDate && selectedTimeSlot;

//   // ✅ Button text based on type
//   const buttonText =
//     type === "booking" ? "Proceed to checkout" : "Confirm Rescheduling";

//   // ✅ Render nothing if modal is closed
//   if (!show) return null;

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           background: "rgba(0,0,0,0.6)",
//           zIndex: 1000,
//         }}
//       />

//       {/* Modal */}
//       <div
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 600,
//           background: "#fff",
//           borderRadius: 10,
//           padding: 20,
//           zIndex: 1001,
//         }}
//       >
//         <h3 style={{ marginBottom: 5 }}>
//           When should the professional arrive?
//         </h3>
//         <p style={{ color: "#666", fontSize: 14 }}>
//           Service will take approx. 5 hrs
//         </p>

//         {/* Date Selection */}
//         <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
//           {dates.map((d) => (
//             <button
//               key={d.value}
//               onClick={() => setSelectedDate(d.value)}
//               style={{
//                 width: 60,
//                 height: 60,
//                 borderRadius: 8,
//                 border:
//                   selectedDate === d.value ? "2px solid red" : "1px solid #ccc",
//                 background: selectedDate === d.value ? "red" : "#fff",
//                 color: selectedDate === d.value ? "#fff" : "#000",
//                 cursor: "pointer",
//               }}
//             >
//               <div style={{ fontSize: 12 }}>{d.label}</div>
//               <div style={{ fontSize: 16, fontWeight: 600 }}>{d.display}</div>
//             </button>
//           ))}
//         </div>

//         {/* Time Slots */}
//         <h4>Select start time</h4>

//         {loadingSlots && (
//           <p style={{ fontSize: 13, color: "#666" }}>
//             Fetching available slots...
//           </p>
//         )}

//         {!loadingSlots && availableSlots.length === 0 && selectedDate && (
//           <p style={{ fontSize: 13, color: "#999" }}>
//             No slots available for this date
//           </p>
//         )}

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: 10,
//             marginBottom: 20,
//           }}
//         >
//           {availableSlots.map((time) => (
//             <button
//               key={time}
//               onClick={() => setSelectedTimeSlot(time)}
//               style={{
//                 padding: 10,
//                 borderRadius: 6,
//                 border:
//                   selectedTimeSlot === time
//                     ? "2px solid red"
//                     : "1px solid #ccc",
//                 background: selectedTimeSlot === time ? "red" : "#fff",
//                 color: selectedTimeSlot === time ? "#fff" : "#000",
//                 cursor: "pointer",
//               }}
//             >
//               {time}
//             </button>
//           ))}
//         </div>

//         {/* Proceed */}
//         <button
//           disabled={!canProceed}
//           onClick={() => {
//             try {
//               handleSelectSlot({
//                 date: selectedDate,
//                 time: selectedTimeSlot,
//               });
//             } catch (err) {
//               console.error("handleSelectSlot error:", err);
//             }
//           }}
//           style={{
//             width: "100%",
//             padding: 12,
//             borderRadius: 6,
//             background: canProceed ? "red" : "#ccc",
//             color: "#fff",
//             border: "none",
//             fontWeight: 600,
//             cursor: canProceed ? "pointer" : "not-allowed",
//           }}
//         >
//           {buttonText}
//         </button>
//       </div>
//     </>
//   );
// };

// export default SlotSelectionModal;

import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";

const SlotSelectionModal = ({
  show,
  onClose,
  handleSelectSlot,
  fetchAvailableSlots,
  type = "booking", // "booking" | "reschedule"
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        date,
        value: moment(date).format("YYYY-MM-DD"),
        display: date.getDate(),
      };
    });
  }, []);

  // ✅ Auto-select today's date when modal opens
  useEffect(() => {
    try {
      if (show && dates.length > 0) {
        setSelectedDate(dates[0].value);
      }
    } catch (err) {
      console.error("Auto-select date error:", err);
    }
  }, [show, dates]);

  // ✅ Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate || !fetchAvailableSlots) return;

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setAvailableSlots([]);
        setSelectedTimeSlot(null);

        const slots = await fetchAvailableSlots(selectedDate);
        setAvailableSlots(Array.isArray(slots) ? slots : []);
      } catch (err) {
        console.error("Failed to fetch slots", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedDate, fetchAvailableSlots]);

  // ✅ Parse slot time safely
  const toSlotDateTime = (dateYYYYMMDD, timeStr) => {
    try {
      if (!dateYYYYMMDD || !timeStr) return null;

      // if backend sends range like "10:00 AM - 12:00 PM", take start time
      const startTime = String(timeStr).split("-")[0].trim();

      // support multiple formats
      const m = moment(
        `${dateYYYYMMDD} ${startTime}`,
        [
          "YYYY-MM-DD hh:mm A",
          "YYYY-MM-DD h:mm A",
          "YYYY-MM-DD HH:mm",
          "YYYY-MM-DD H:mm",
          "YYYY-MM-DD hh A",
          "YYYY-MM-DD h A",
        ],
        true
      );

      return m.isValid() ? m : null;
    } catch (e) {
      console.error("toSlotDateTime error:", e);
      return null;
    }
  };

  // ✅ Filter: if selected date is today -> show only slots after now + 2 hours
  const filteredSlots = useMemo(() => {
    try {
      if (!selectedDate) return availableSlots;

      const isToday = selectedDate === moment().format("YYYY-MM-DD");
      if (!isToday) return availableSlots;

      const minTime = moment().add(2, "hours");

      return (availableSlots || []).filter((t) => {
        const slotDT = toSlotDateTime(selectedDate, t);

        // if parsing fails, DON'T hide it (safer)
        if (!slotDT) return true;

        return slotDT.isSameOrAfter(minTime);
      });
    } catch (e) {
      console.error("filteredSlots error:", e);
      return availableSlots;
    }
  }, [availableSlots, selectedDate]);

  // if currently selected slot becomes invalid after filtering, clear it
  useEffect(() => {
    try {
      if (!selectedTimeSlot) return;

      const stillExists = filteredSlots.includes(selectedTimeSlot);
      if (!stillExists) setSelectedTimeSlot(null);
    } catch (e) {
      console.error("selectedTimeSlot validate error:", e);
    }
  }, [filteredSlots, selectedTimeSlot]);

  const canProceed = selectedDate && selectedTimeSlot;

  const buttonText =
    type === "booking" ? "Proceed to checkout" : "Confirm Rescheduling";

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          background: "#fff",
          borderRadius: 10,
          padding: 20,
          zIndex: 1001,
        }}
      >
        <h3 style={{ marginBottom: 5 }}>
          When should the professional arrive?
        </h3>
        <p style={{ color: "#666", fontSize: 14 }}>
          {/* optional: update based on your actual duration */}
          Service will take approx. 5 hrs
        </p>

        {/* Date Selection */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDate(d.value)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                border:
                  selectedDate === d.value ? "2px solid red" : "1px solid #ccc",
                background: selectedDate === d.value ? "red" : "#fff",
                color: selectedDate === d.value ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 12 }}>{d.label}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{d.display}</div>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <h4>Select start time</h4>

        {loadingSlots && (
          <p style={{ fontSize: 13, color: "#666" }}>
            Fetching available slots...
          </p>
        )}

        {!loadingSlots && filteredSlots.length === 0 && selectedDate && (
          <p style={{ fontSize: 13, color: "#999" }}>
            No slots available for this date
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {filteredSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTimeSlot(time)}
              style={{
                padding: 10,
                borderRadius: 6,
                border:
                  selectedTimeSlot === time
                    ? "2px solid red"
                    : "1px solid #ccc",
                background: selectedTimeSlot === time ? "red" : "#fff",
                color: selectedTimeSlot === time ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Proceed */}
        <button
          disabled={!canProceed}
          onClick={() => {
            try {
              handleSelectSlot({
                date: selectedDate,
                time: selectedTimeSlot,
              });
            } catch (err) {
              console.error("handleSelectSlot error:", err);
            }
          }}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            background: canProceed ? "red" : "#ccc",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
};

export default SlotSelectionModal;
