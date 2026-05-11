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

// Format minutes -> "2 hrs", "30 mins", "2 hrs 30 mins". Returns null if 0/invalid.
const formatDuration = (mins) => {
  const total = Number(mins) || 0;
  if (total <= 0) return null;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const hPart = h > 0 ? `${h} ${h === 1 ? "hr" : "hrs"}` : "";
  const mPart = m > 0 ? `${m} ${m === 1 ? "min" : "mins"}` : "";
  return [hPart, mPart].filter(Boolean).join(" ");
};

const SlotSelectionModal = ({
  show,
  onClose,
  handleSelectSlot,
  fetchAvailableSlots,
  type = "booking", // "booking" | "reschedule"
  serviceDurationMinutes, // optional — total duration of selected services in minutes
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  // Slots whose vendors are all booked/held — rendered as disabled tiles
  // so the user can see them but can't select them. Spec requirement.
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotReason, setSlotReason] = useState(null);

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
        setUnavailableSlots([]);
        setSlotReason(null);
        setSelectedTimeSlot(null);

        // Accept either legacy array shape or the new
        // { slots, unavailableSlots, reason } object. unavailableSlots is
        // optional — when present, those tiles render disabled so users
        // can see them but can't pick them.
        const result = await fetchAvailableSlots(selectedDate);
        const list = Array.isArray(result) ? result : result?.slots || [];
        const unavailable = Array.isArray(result)
          ? []
          : result?.unavailableSlots || [];
        const reason = Array.isArray(result) ? null : result?.reason || null;
        setAvailableSlots(list);
        setUnavailableSlots(unavailable);
        setSlotReason(reason);
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
        true,
      );

      return m.isValid() ? m : null;
    } catch (e) {
      console.error("toSlotDateTime error:", e);
      return null;
    }
  };

  // ✅ Merge available + unavailable into a single time-ordered list so we
  // can render them side-by-side. Unavailable tiles are rendered disabled
  // (visible but not clickable) per spec.
  // For today, slots earlier than now+2h are dropped entirely.
  const filteredSlots = useMemo(() => {
    try {
      if (!selectedDate) {
        return (availableSlots || []).map((t) => ({
          time: t,
          available: true,
        }));
      }

      const isToday = selectedDate === moment().format("YYYY-MM-DD");
      const minTime = isToday ? moment().add(2, "hours") : null;

      const merged = [
        ...(availableSlots || []).map((t) => ({ time: t, available: true })),
        ...(unavailableSlots || []).map((t) => ({ time: t, available: false })),
      ];

      // Sort by parsed time so tiles appear chronologically regardless of
      // backend ordering of the two arrays.
      merged.sort((a, b) => {
        const ta = toSlotDateTime(selectedDate, a.time);
        const tb = toSlotDateTime(selectedDate, b.time);
        if (!ta || !tb) return 0;
        return ta.valueOf() - tb.valueOf();
      });

      if (!minTime) return merged;
      return merged.filter((s) => {
        const slotDT = toSlotDateTime(selectedDate, s.time);
        if (!slotDT) return true; // if parsing fails, don't hide it
        return slotDT.isSameOrAfter(minTime);
      });
    } catch (e) {
      console.error("filteredSlots error:", e);
      return (availableSlots || []).map((t) => ({ time: t, available: true }));
    }
  }, [availableSlots, unavailableSlots, selectedDate]);

  // if currently selected slot becomes invalid after filtering, clear it
  useEffect(() => {
    try {
      if (!selectedTimeSlot) return;
      const stillSelectable = filteredSlots.some(
        (s) => s.time === selectedTimeSlot && s.available,
      );
      if (!stillSelectable) setSelectedTimeSlot(null);
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
        {formatDuration(serviceDurationMinutes) && (
          <p style={{ color: "#666", fontSize: 14 }}>
            Service will take approx. {formatDuration(serviceDurationMinutes)}
          </p>
        )}

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

        <style>{`
          @keyframes slotSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {loadingSlots ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 0",
              marginBottom: 20,
              minHeight: 140,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #f0f0f0",
                borderTopColor: "#FF0000",
                borderRadius: "50%",
                animation: "slotSpin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: 13, color: "#666", marginTop: 12 }}>
              Fetching available slots...
            </p>
          </div>
        ) : filteredSlots.length === 0 && selectedDate ? (
          <p
            style={{
              fontSize: 13,
              color: "#999",
              textAlign: "center",
              padding: "30px 0",
              marginBottom: 20,
            }}
          >
            {slotReason || "No slots available for this date"}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {filteredSlots.map(({ time, available }) => {
              const isSelected = selectedTimeSlot === time;
              return (
                <button
                  key={time}
                  disabled={!available}
                  title={
                    available ? undefined : "Not available — already booked"
                  }
                  onClick={() => available && setSelectedTimeSlot(time)}
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    position: "relative",
                    border: isSelected
                      ? "2px solid red"
                      : available
                        ? "1px solid #ccc"
                        : "1px dashed #ddd",
                    background: isSelected
                      ? "red"
                      : available
                        ? "#fff"
                        : "#f5f5f5",
                    color: isSelected ? "#fff" : available ? "#000" : "#aaa",
                    cursor: available ? "pointer" : "not-allowed",
                    textDecoration: available ? "none" : "line-through",
                  }}
                >
                  {time}
                  {/* {!available && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "#999",
                        marginTop: 2,
                        textDecoration: "none",
                      }}
                    >
                      Not available
                    </div>
                  )} */}
                </button>
              );
            })}
          </div>
        )}

        {/* Proceed — acquires the Redis hold and navigates to checkout. */}
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
