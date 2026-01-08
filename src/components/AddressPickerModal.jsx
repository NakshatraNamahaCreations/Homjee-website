// AddressPickerModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const GOOGLE_MAPS_API_KEY =
  import.meta?.env?.VITE_GOOGLE_MAPS_KEY ||
  "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

/* -------------------- Google Maps Loader (Maps + Places) -------------------- */
let __gmapsPromise = null;

const loadGoogleMapsPlaces = () => {
  try {
    if (__gmapsPromise) return __gmapsPromise;

    __gmapsPromise = new Promise((resolve, reject) => {
      try {
        // ✅ already loaded
        if (window.google?.maps) return resolve(true);

        // ✅ if script already exists, wait for it
        const existing = Array.from(
          document.querySelectorAll("script[src]")
        ).find((s) =>
          s.src.includes("https://maps.googleapis.com/maps/api/js")
        );

        if (existing) {
          let tries = 0;
          const t = setInterval(() => {
            try {
              tries += 1;
              if (window.google?.maps) {
                clearInterval(t);
                resolve(true);
              }
              if (tries > 50) {
                clearInterval(t);
                reject(new Error("Google Maps not available."));
              }
            } catch (e) {
              // ignore
            }
          }, 100);
          return;
        }

        // ✅ inject new script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          try {
            if (window.google?.maps) resolve(true);
            else reject(new Error("Google Maps loaded but not available."));
          } catch (e) {
            reject(e);
          }
        };

        script.onerror = () =>
          reject(new Error("Failed to load Google Maps script."));
        document.body.appendChild(script);
      } catch (e) {
        reject(e);
      }
    });

    return __gmapsPromise;
  } catch (e) {
    return Promise.reject(e);
  }
};

/* ------------------------------ Helpers ----------------------------------- */
const safe = (v, fallback = "") =>
  v === undefined || v === null ? fallback : v;

const extractCity = (addressComponents = []) => {
  try {
    const cityComp =
      addressComponents.find((c) => c.types?.includes("locality")) ||
      addressComponents.find((c) =>
        c.types?.includes("administrative_area_level_2")
      ) ||
      addressComponents.find((c) => c.types?.includes("sublocality")) ||
      addressComponents.find((c) =>
        c.types?.includes("administrative_area_level_1")
      );

    return safe(cityComp?.long_name, "");
  } catch (e) {
    return "";
  }
};

export default function AddressPickerModal({
  show,
  onClose,
  initialLatLng = { lat: 12.9716, lng: 77.5946 },
  onSave,

  // config props
  initialAddress = "",
  initialHouseFlat = "",
  initialLandmark = "",
  initialCity = "",

  allowSearch = true,
  allowMapPick = true,

  disableHouseFlat = false,
  disableLandmark = false,

  primaryCtaLabel = "Save & Proceed",

  showChangeButton = false,
  onClickChange = () => {},
}) {
  const mapRef = useRef(null);
  const mapDivRef = useRef(null);
  const markerRef = useRef(null);
  const acRef = useRef(null);
  const searchInputRef = useRef(null);
  const geocoderRef = useRef(null);

  const mapClickListenerRef = useRef(null);
  const markerDragListenerRef = useRef(null);
  const acListenerRef = useRef(null);

  const [mapsReady, setMapsReady] = useState(false);

  // controlled fields
  const [searchText, setSearchText] = useState(initialAddress || "");
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || "");
  const [selectedCity, setSelectedCity] = useState(initialCity || "");
  const [latLng, setLatLng] = useState({
    lat: Number(initialLatLng?.lat ?? 12.9716),
    lng: Number(initialLatLng?.lng ?? 77.5946),
  });
  const [houseNumber, setHouseNumber] = useState(initialHouseFlat || "");
  const [landmark, setLandmark] = useState(initialLandmark || "");

  /* --------------------- Load Google when modal opens --------------------- */
  useEffect(() => {
    (async () => {
      try {
        if (!show) return;
        await loadGoogleMapsPlaces();
        setMapsReady(true);
      } catch (e) {
        console.error("Google Maps load error:", e);
        setMapsReady(false);
      }
    })();
  }, [show]);

  /* ---------------------- Sync incoming props to state -------------------- */
  useEffect(() => {
    try {
      setSelectedAddress(initialAddress || "");
      setSelectedCity(initialCity || "");

      if (allowSearch) setSearchText(initialAddress || "");
      else setSearchText("");

      setHouseNumber(initialHouseFlat || "");
      setLandmark(initialLandmark || "");
    } catch (e) {
      console.error("sync initial fields failed", e);
    }
  }, [
    initialAddress,
    initialCity,
    initialHouseFlat,
    initialLandmark,
    allowSearch,
  ]);

  useEffect(() => {
    try {
      if (initialLatLng?.lat && initialLatLng?.lng) {
        setLatLng({
          lat: Number(initialLatLng.lat),
          lng: Number(initialLatLng.lng),
        });
      }
    } catch (e) {
      console.error("sync initialLatLng failed", e);
    }
  }, [initialLatLng?.lat, initialLatLng?.lng]);

  /* --------------------------- Reverse geocode ---------------------------- */
  const reverseGeocode = async (pos) => {
    try {
      const geocoder = geocoderRef.current;
      if (!geocoder) return { formatted: "", city: "" };

      return await new Promise((resolve) => {
        try {
          geocoder.geocode({ location: pos }, (results, status) => {
            try {
              if (status === "OK" && results?.length) {
                const best = results[0];
                resolve({
                  formatted: safe(best.formatted_address, ""),
                  city: extractCity(best.address_components || []),
                });
              } else {
                resolve({ formatted: "", city: "" });
              }
            } catch (e) {
              resolve({ formatted: "", city: "" });
            }
          });
        } catch (e) {
          resolve({ formatted: "", city: "" });
        }
      });
    } catch (e) {
      return { formatted: "", city: "" };
    }
  };

  /* ----------------------- Set location everywhere ------------------------ */
  const setFromLatLng = async (pos, placeMeta = null) => {
    try {
      setLatLng(pos);

      // map + marker update
      try {
        if (markerRef.current) {
          markerRef.current.setPosition(pos);
          markerRef.current.setDraggable(!!allowMapPick);
        }
        if (mapRef.current) {
          mapRef.current.panTo(pos);
          if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(15);
        }
      } catch (e) {
        console.error("Error updating map/marker:", e);
      }

      // address from autocomplete
      if (placeMeta?.formatted) {
        setSelectedAddress(placeMeta.formatted);
        setSelectedCity(extractCity(placeMeta.components || []));
        return;
      }

      // reverse geocode
      const { formatted, city } = await reverseGeocode(pos);
      setSelectedAddress(formatted);
      setSelectedCity(city);

      if (formatted && allowSearch) setSearchText(formatted);
    } catch (e) {
      console.error("setFromLatLng error:", e);
    }
  };

  /* --------------------------- Create Map (once) -------------------------- */
  useEffect(() => {
    try {
      if (!show || !mapsReady) return;
      if (!mapDivRef.current) return;

      // if map already exists, don't recreate
      if (mapRef.current) return;

      // create geocoder
      geocoderRef.current = new window.google.maps.Geocoder();

      // create map
      mapRef.current = new window.google.maps.Map(mapDivRef.current, {
        center: latLng,
        zoom: 15,
        disableDefaultUI: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      // create marker
      markerRef.current = new window.google.maps.Marker({
        position: latLng,
        map: mapRef.current,
        draggable: !!allowMapPick,
      });

      // ✅ important: resize after modal paint
      window.setTimeout(() => {
        try {
          if (!mapRef.current) return;
          window.google?.maps?.event?.trigger(mapRef.current, "resize");
          mapRef.current.setCenter(latLng);
          markerRef.current?.setPosition(latLng);
        } catch (e) {
          console.error("map resize trigger failed", e);
        }
      }, 150);
    } catch (e) {
      console.error("Map init error:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mapsReady]);

  /* ------------------ Keep map in sync whenever latLng changes ------------ */
  useEffect(() => {
    try {
      if (!show || !mapsReady) return;
      if (!mapRef.current || !markerRef.current) return;

      mapRef.current.setCenter(latLng);
      markerRef.current.setPosition(latLng);

      window.setTimeout(() => {
        try {
          if (!mapRef.current) return;
          window.google?.maps?.event?.trigger(mapRef.current, "resize");
          mapRef.current.setCenter(latLng);
          markerRef.current?.setPosition(latLng);
        } catch (e) {
          console.error("map resize trigger failed", e);
        }
      }, 150);
    } catch (e) {
      console.error("map sync effect failed", e);
    }
  }, [show, mapsReady, latLng?.lat, latLng?.lng]);

  /* ------------------- Update interaction when allowMapPick changes -------- */
  useEffect(() => {
    try {
      if (!show || !mapsReady) return;
      if (!mapRef.current || !markerRef.current) return;

      // update draggable
      markerRef.current.setDraggable(!!allowMapPick);

      // clear old listeners
      try {
        if (mapClickListenerRef.current) {
          window.google.maps.event.removeListener(mapClickListenerRef.current);
          mapClickListenerRef.current = null;
        }
        if (markerDragListenerRef.current) {
          window.google.maps.event.removeListener(markerDragListenerRef.current);
          markerDragListenerRef.current = null;
        }
      } catch (e) {}

      // attach listeners only if allowed
      if (allowMapPick) {
        mapClickListenerRef.current = mapRef.current.addListener("click", (e) =>
          setFromLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        );
        markerDragListenerRef.current = markerRef.current.addListener(
          "dragend",
          (e) => setFromLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        );
      }
    } catch (e) {
      console.error("allowMapPick listener update failed", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mapsReady, allowMapPick]);

  /* ------------------------ Init Autocomplete (optional) ------------------- */
  useEffect(() => {
    try {
      if (!show || !mapsReady) return;

      // clear old autocomplete listener
      try {
        if (acListenerRef.current) {
          window.google.maps.event.removeListener(acListenerRef.current);
          acListenerRef.current = null;
        }
      } catch (e) {}

      if (!allowSearch) return;

      const input = searchInputRef.current;
      if (!input) return;

      if (!window.google?.maps?.places?.Autocomplete) {
        console.warn("Places Autocomplete not available on this build.");
        return;
      }

      const ac = new window.google.maps.places.Autocomplete(input, {
        fields: ["formatted_address", "geometry", "address_components"],
        types: ["geocode", "establishment"],
      });

      acRef.current = ac;

      acListenerRef.current = ac.addListener("place_changed", () => {
        try {
          const place = ac.getPlace();
          if (!place?.geometry?.location) return;

          const formatted = safe(place.formatted_address, input.value);
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setSearchText(formatted);
          setFromLatLng(
            { lat, lng },
            { formatted, components: place.address_components }
          );
        } catch (e) {
          console.error("Autocomplete place_changed error:", e);
        }
      });
    } catch (e) {
      console.error("Autocomplete init error:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mapsReady, allowSearch]);

  /* ------------------------------- Cleanup -------------------------------- */
  useEffect(() => {
    try {
      if (show) return;

      // clear listeners
      try {
        if (mapClickListenerRef.current) {
          window.google?.maps?.event?.removeListener(mapClickListenerRef.current);
          mapClickListenerRef.current = null;
        }
        if (markerDragListenerRef.current) {
          window.google?.maps?.event?.removeListener(markerDragListenerRef.current);
          markerDragListenerRef.current = null;
        }
        if (acListenerRef.current) {
          window.google?.maps?.event?.removeListener(acListenerRef.current);
          acListenerRef.current = null;
        }
      } catch (e) {}

      try {
        if (markerRef.current)
          window.google?.maps?.event?.clearInstanceListeners(markerRef.current);
        if (mapRef.current)
          window.google?.maps?.event?.clearInstanceListeners(mapRef.current);
      } catch (e) {}

      // destroy refs
      markerRef.current = null;
      mapRef.current = null;
      geocoderRef.current = null;
      acRef.current = null;

      // clear map DOM safely
      if (mapDivRef.current) {
        mapDivRef.current.innerHTML = "";
      }
    } catch (e) {
      console.error("cleanup on modal close failed", e);
    }
  }, [show]);

  /* ----------------------------- Save ------------------------------------ */
  const handleSave = async () => {
    try {
      if (!disableHouseFlat && !houseNumber?.trim()) {
        alert("House/Flat Number is required");
        return;
      }

      const payload = {
        address: selectedAddress,
        city: selectedCity,
        lat: latLng.lat,
        lng: latLng.lng,
        houseNumber: (houseNumber || "").trim(),
        landmark: (landmark || "").trim(),
      };

      try {
        if (typeof onSave === "function") onSave(payload);
      } catch (e) {
        console.error("onSave error:", e);
      }

      try {
        onClose?.();
      } catch (e) {
        console.error("onClose error:", e);
      }
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  /* ----------------------------- UI -------------------------------------- */
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      enforceFocus={false}
      restoreFocus={false}
    >
      <style>{`.pac-container{ z-index: 999999 !important; }`}</style>

      <Modal.Header closeButton>
        <Modal.Title>Select Address</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ display: "flex", gap: 16 }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 360 }}>
            {allowSearch ? (
              <Form.Control
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search your location..."
                autoComplete="off"
                style={{ marginBottom: 10 }}
                disabled={!mapsReady}
              />
            ) : (
              <div
                style={{
                  marginBottom: 10,
                  padding: 8,
                  background: "#f5f5f5",
                  borderRadius: 8,
                }}
              >
                <small>Search disabled - address is pre-filled</small>
              </div>
            )}

            {/* ✅ IMPORTANT: wrapper with EMPTY map div, overlays as siblings */}
            <div
              style={{
                height: 320,
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                background: "#f3f3f3",
                border: allowMapPick ? "2px solid #e5747a" : "2px solid #ccc",
                position: "relative",
              }}
            >
              <div ref={mapDivRef} style={{ height: "100%", width: "100%" }} />

              {!mapsReady && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.9)",
                    zIndex: 2,
                  }}
                >
                  Loading map...
                </div>
              )}

              {/* {!allowMapPick && mapsReady && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    zIndex: 3,
                  }}
                >
                  Map interaction disabled
                </div>
              )} */}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1, minWidth: 360 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Selected Address
            </div>

            {showChangeButton && (
              <Button
                variant="secondary"
                onClick={() => {
                  try {
                    onClickChange?.();
                  } catch (e) {
                    console.error("onClickChange failed", e);
                  }
                }}
                style={{
                  width: "40%",
                  marginBottom: 10,
                  borderRadius: 10,
                  borderColor: "#e00a14",
                  backgroundColor: "#e00a14",
                  color: "#fff",
                }}
                className="btn-sm"
              >
                Change Address
              </Button>
            )}

            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                minHeight: 90,
                background: "#fafafa",
              }}
            >
              <div style={{ fontSize: 14, marginBottom: 6 }}>
                {selectedAddress || "Pick a location from map or search"}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>
                City: <b>{selectedCity || "—"}</b>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>
                House/Flat Number <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Enter House/Flat Number"
                disabled={disableHouseFlat || !mapsReady}
                readOnly={disableHouseFlat}
                style={{
                  backgroundColor: disableHouseFlat ? "#f5f5f5" : "white",
                  cursor: disableHouseFlat ? "not-allowed" : "text",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Landmark (Optional)</Form.Label>
              <Form.Control
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Enter Landmark"
                disabled={disableLandmark || !mapsReady}
                readOnly={disableLandmark}
                style={{
                  backgroundColor: disableLandmark ? "#f5f5f5" : "white",
                  cursor: disableLandmark ? "not-allowed" : "text",
                }}
              />
            </Form.Group>

            <Button
              onClick={handleSave}
              style={{
                width: "100%",
                borderRadius: 10,
                padding: "10px 12px",
                border: "none",
                background: "#e00a14ff",
                fontWeight: "bold",
              }}
              disabled={!mapsReady}
            >
              {primaryCtaLabel}
            </Button>

            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              Lat: {latLng?.lat?.toFixed?.(6) || "N/A"} | Lng:{" "}
              {latLng?.lng?.toFixed?.(6) || "N/A"}
            </div>

            <div style={{ marginTop: 8, fontSize: 10, color: "#aaa" }}>
              Mode: {allowMapPick ? "Interactive" : "View Only"} | Search:{" "}
              {allowSearch ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}


// AddressPickerModal.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";

// const GOOGLE_MAPS_API_KEY =
//   import.meta?.env?.VITE_GOOGLE_MAPS_KEY ||
//   "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

// /* -------------------- Google Maps Loader (Maps + Places) -------------------- */
// let __gmapsPromise = null;

// const loadGoogleMapsPlaces = () => {
//   try {
//     if (__gmapsPromise) return __gmapsPromise;

//     __gmapsPromise = new Promise((resolve, reject) => {
//       try {
//         // ✅ already loaded
//         if (window.google?.maps?.places) return resolve(true);

//         // ✅ if script already exists, wait for it
//         const existing = Array.from(
//           document.querySelectorAll("script[src]")
//         ).find((s) =>
//           s.src.includes("https://maps.googleapis.com/maps/api/js")
//         );

//         if (existing) {
//           let tries = 0;
//           const t = setInterval(() => {
//             try {
//               tries += 1;
//               if (window.google?.maps?.places) {
//                 clearInterval(t);
//                 resolve(true);
//               }
//               if (tries > 50) {
//                 clearInterval(t);
//                 reject(new Error("Google Maps Places not available."));
//               }
//             } catch (e) {
//               // ignore
//             }
//           }, 100);
//           return;
//         }

//         // ✅ inject new script
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//         script.async = true;
//         script.defer = true;

//         script.onload = () => {
//           try {
//             if (window.google?.maps?.places) resolve(true);
//             else
//               reject(new Error("Google Maps loaded but Places not available."));
//           } catch (e) {
//             reject(e);
//           }
//         };

//         script.onerror = () =>
//           reject(new Error("Failed to load Google Maps script."));
//         document.body.appendChild(script);
//       } catch (e) {
//         reject(e);
//       }
//     });

//     return __gmapsPromise;
//   } catch (e) {
//     return Promise.reject(e);
//   }
// };

// /* ------------------------------ Helpers ----------------------------------- */
// const safe = (v, fallback = "") =>
//   v === undefined || v === null ? fallback : v;

// const extractCity = (addressComponents = []) => {
//   try {
//     const cityComp =
//       addressComponents.find((c) => c.types?.includes("locality")) ||
//       addressComponents.find((c) =>
//         c.types?.includes("administrative_area_level_2")
//       ) ||
//       addressComponents.find((c) => c.types?.includes("sublocality")) ||
//       addressComponents.find((c) =>
//         c.types?.includes("administrative_area_level_1")
//       );

//     return safe(cityComp?.long_name, "");
//   } catch (e) {
//     return "";
//   }
// };

// export default function AddressPickerModal({
//   show,
//   onClose,
//   initialLatLng = { lat: 12.9716, lng: 77.5946 },
//   onSave,
//   // ✅ NEW PROPS for configuration
//   initialAddress = "",
//   initialHouseFlat = "",
//   initialLandmark = "",
//   initialCity = "",
//   allowSearch = true,
//   allowMapPick = true,
//   disableHouseFlat = false,
//   disableLandmark = false,
//   primaryCtaLabel = "Save & Proceed",
//   showChangeButton = false,
//   onClickChange = () => {},
// }) {
//   console.log("=== ADDRESS PICKER MODAL RENDER ===");
//   console.log("Props received:");
//   console.log("initialAddress:", initialAddress);
//   console.log("initialLatLng:", initialLatLng);
//   console.log("allowSearch:", allowSearch);
//   console.log("allowMapPick:", allowMapPick);
//   console.log("disableHouseFlat:", disableHouseFlat);
//   console.log("disableLandmark:", disableLandmark);
//   console.log("primaryCtaLabel:", primaryCtaLabel);
//   console.log("showChangeButton:", showChangeButton);

//   const mapRef = useRef(null);
//   const mapDivRef = useRef(null);
//   const markerRef = useRef(null);
//   const acRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const geocoderRef = useRef(null);

//   const [mapsReady, setMapsReady] = useState(false);

//   // ✅ Initialize state with props
//   const [searchText, setSearchText] = useState(initialAddress || "");
//   const [selectedAddress, setSelectedAddress] = useState(initialAddress || "");
//   const [selectedCity, setSelectedCity] = useState(initialCity || "");
//   const [latLng, setLatLng] = useState(initialLatLng);
//   const [houseNumber, setHouseNumber] = useState(initialHouseFlat || "");
//   const [landmark, setLandmark] = useState(initialLandmark || "");

//   /* --------------------- Init loader when modal opens --------------------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         if (!show) return;
//         console.log("Loading Google Maps...");
//         await loadGoogleMapsPlaces();
//         console.log("Google Maps loaded successfully");
//         setMapsReady(true);
//       } catch (e) {
//         console.error("Google Maps load error:", e);
//         setMapsReady(false);
//       }
//     })();
//   }, [show]);

//   /* -------------------------- Init Map (once) ----------------------------- */
//   useEffect(() => {
//     try {
//       console.log("Map init useEffect triggered");
//       console.log(
//         "show:",
//         show,
//         "mapsReady:",
//         mapsReady,
//         "allowMapPick:",
//         allowMapPick
//       );

//       if (!show || !mapsReady) return;
//       if (!mapDivRef.current) return;
//       if (mapRef.current) {
//         console.log("Map already created, updating position");
//         // Update marker position if latLng changed
//         if (markerRef.current) {
//           markerRef.current.setPosition(latLng);
//         }
//         if (mapRef.current) {
//           mapRef.current.panTo(latLng);
//         }
//         return;
//       }

//       console.log("Creating new map instance");
//       geocoderRef.current = new window.google.maps.Geocoder();

//       mapRef.current = new window.google.maps.Map(mapDivRef.current, {
//         center: latLng,
//         zoom: 15,
//         disableDefaultUI: false,
//         streetViewControl: false,
//         mapTypeControl: false,
//         fullscreenControl: false,
//       });

//       markerRef.current = new window.google.maps.Marker({
//         position: latLng,
//         map: mapRef.current,
//         draggable: allowMapPick, // ✅ Only draggable if allowed
//         title: "Drag to change location",
//       });

//       // ✅ ADD THIS RIGHT HERE (after map+marker created)
//       try {
//         window.setTimeout(() => {
//           try {
//             if (!mapRef.current) return;
//             window.google.maps.event.trigger(mapRef.current, "resize");
//             mapRef.current.setCenter(latLng);
//             markerRef.current?.setPosition(latLng);
//           } catch (e) {
//             console.error("map resize trigger failed", e);
//           }
//         }, 200);
//       } catch (e) {
//         console.error("setTimeout resize failed", e);
//       }

//       // ✅ Only add click listener if map picking is allowed
//       if (allowMapPick) {
//         console.log("Adding map click listener");
//         mapRef.current.addListener("click", (e) => {
//           try {
//             console.log("Map clicked at:", e.latLng.lat(), e.latLng.lng());
//             const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//             setFromLatLng(next);
//           } catch (err) {
//             console.error("Map click error:", err);
//           }
//         });
//       }

//       // ✅ Only add dragend listener if map picking is allowed
//       if (allowMapPick) {
//         console.log("Adding marker dragend listener");
//         markerRef.current.addListener("dragend", (e) => {
//           try {
//             console.log("Marker dragged to:", e.latLng.lat(), e.latLng.lng());
//             const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//             setFromLatLng(next);
//           } catch (err) {
//             console.error("Marker drag error:", err);
//           }
//         });
//       }

//       // ✅ If we have initial address, show it, else do reverse geocode
//       if (initialAddress && initialLatLng.lat && initialLatLng.lng) {
//         console.log("Setting initial address from props");
//         setSelectedAddress(initialAddress);
//         setSelectedCity(initialCity);
//         // Ensure map shows the right location
//         mapRef.current.setCenter(latLng);
//         markerRef.current.setPosition(latLng);
//       } else {
//         console.log("No initial address, doing reverse geocode");
//         setFromLatLng(latLng);
//       }
//     } catch (e) {
//       console.error("Map init error:", e);
//     }
//   }, [show, mapsReady, allowMapPick, initialAddress, initialCity]);

//   /* ------------------------ Init Autocomplete ----------------------------- */
//   useEffect(() => {
//     try {
//       if (!show || !mapsReady) return;
//       if (!allowSearch) {
//         console.log("Search not allowed, skipping autocomplete init");
//         return; // ✅ Don't init autocomplete if search is not allowed
//       }

//       const input = searchInputRef.current;
//       if (!input) return;

//       console.log("Initializing autocomplete");

//       // cleanup old autocomplete
//       try {
//         if (acRef.current) acRef.current = null;
//       } catch (e) {}

//       const ac = new window.google.maps.places.Autocomplete(input, {
//         fields: ["formatted_address", "geometry", "address_components"],
//         types: ["geocode", "establishment"],
//       });

//       acRef.current = ac;

//       const listener = ac.addListener("place_changed", () => {
//         try {
//           const place = ac.getPlace();
//           console.log("Place selected:", place);
//           if (!place?.geometry?.location) return;

//           const formatted = safe(place.formatted_address, input.value);
//           const lat = place.geometry.location.lat();
//           const lng = place.geometry.location.lng();

//           console.log("Selected place:", formatted, lat, lng);

//           // ✅ IMPORTANT: update controlled input so it shows selected suggestion
//           setSearchText(formatted);

//           // ✅ update map + marker + selected address
//           setFromLatLng(
//             { lat, lng },
//             { formatted, components: place.address_components }
//           );
//         } catch (err) {
//           console.error("Autocomplete place_changed error:", err);
//         }
//       });

//       return () => {
//         try {
//           window.google.maps.event.removeListener(listener);
//         } catch (e) {}
//       };
//     } catch (e) {
//       console.error("Autocomplete init error:", e);
//     }
//   }, [show, mapsReady, allowSearch]);

//   useEffect(() => {
//     try {
//       // Selected address box (right side)
//       setSelectedAddress(initialAddress || "");
//       setSelectedCity(initialCity || "");

//       // Search input (left side) should reflect address only when search is enabled
//       if (allowSearch) setSearchText(initialAddress || "");
//       else setSearchText(""); // or keep it as-is; but I recommend clearing in view-only

//       // House + landmark fields
//       setHouseNumber(initialHouseFlat || "");
//       setLandmark(initialLandmark || "");
//     } catch (e) {
//       console.error("sync initial fields failed", e);
//     }
//   }, [
//     initialAddress,
//     initialCity,
//     initialHouseFlat,
//     initialLandmark,
//     allowSearch,
//   ]);

//   useEffect(() => {
//     try {
//       if (initialLatLng?.lat && initialLatLng?.lng) {
//         const next = {
//           lat: Number(initialLatLng.lat),
//           lng: Number(initialLatLng.lng),
//         };
//         setLatLng(next);

//         // if map already exists, update its position
//         if (mapRef.current) {
//           mapRef.current.setCenter(next);
//           markerRef.current?.setPosition(next);
//         }
//       }
//     } catch (e) {
//       console.error("sync initialLatLng failed", e);
//     }
//   }, [initialLatLng?.lat, initialLatLng?.lng]);

//   useEffect(() => {
//     try {
//       if (show) return;

//       // Modal closed -> destroy map references
//       mapRef.current = null;
//       markerRef.current = null;
//       geocoderRef.current = null;
//       acRef.current = null;

//       // Clear old map DOM (important for next open)
//       if (mapDivRef.current) {
//         mapDivRef.current.innerHTML = "";
//       }

//       setMapsReady(false);
//     } catch (e) {
//       console.error("cleanup on modal close failed", e);
//     }
//   }, [show]);

//   /* ------------------------- Reverse Geocode ------------------------------ */
//   const reverseGeocode = async (pos) => {
//     try {
//       console.log("Reverse geocoding:", pos);
//       const geocoder = geocoderRef.current;
//       if (!geocoder) {
//         console.log("Geocoder not ready");
//         return { formatted: "", city: "" };
//       }

//       return await new Promise((resolve) => {
//         try {
//           geocoder.geocode({ location: pos }, (results, status) => {
//             try {
//               console.log("Geocode status:", status, "Results:", results);
//               if (status === "OK" && results?.length) {
//                 const best = results[0];
//                 const formatted = safe(best.formatted_address, "");
//                 const city = extractCity(best.address_components || []);
//                 console.log("Reverse geocode success:", { formatted, city });
//                 resolve({
//                   formatted,
//                   city,
//                 });
//               } else {
//                 console.log("Reverse geocode failed:", status);
//                 resolve({ formatted: "", city: "" });
//               }
//             } catch (e) {
//               console.error("Error in geocode callback:", e);
//               resolve({ formatted: "", city: "" });
//             }
//           });
//         } catch (e) {
//           console.error("Geocode promise error:", e);
//           resolve({ formatted: "", city: "" });
//         }
//       });
//     } catch (e) {
//       console.error("Reverse geocode error:", e);
//       return { formatted: "", city: "" };
//     }
//   };

//   /* ----------------------- Set location everywhere ------------------------ */
//   const setFromLatLng = async (pos, placeMeta = null) => {
//     try {
//       console.log("setFromLatLng called with:", pos, placeMeta);
//       setLatLng(pos);

//       // marker + map
//       try {
//         if (markerRef.current) {
//           markerRef.current.setPosition(pos);
//           markerRef.current.setDraggable(!!allowMapPick);
//         }
//         if (mapRef.current) {
//           markerRef.current.setPosition(latLng);
//           mapRef.current.panTo(pos);
//           // keep same zoom feel
//           if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(15);
//         }
//       } catch (e) {
//         console.error("Error updating map/marker:", e);
//       }

//       // if we already have formatted address from autocomplete
//       if (placeMeta?.formatted) {
//         console.log("Using address from autocomplete:", placeMeta.formatted);
//         setSelectedAddress(placeMeta.formatted);
//         setSelectedCity(extractCity(placeMeta.components || []));
//         return;
//       }

//       // else reverse geocode
//       const { formatted, city } = await reverseGeocode(pos);
//       console.log("Reverse geocode result:", { formatted, city });
//       setSelectedAddress(formatted);
//       setSelectedCity(city);

//       // keep search box aligned to selected address (optional but nice)
//       if (formatted && allowSearch) {
//         setSearchText(formatted);
//       }
//     } catch (e) {
//       console.error("setFromLatLng error:", e);
//     }
//   };

//   /* ----------------------------- Save ------------------------------------ */
//   const handleSave = async () => {
//     try {
//       console.log("Save button clicked");
//       console.log("House number:", houseNumber);
//       console.log("Disable house flat:", disableHouseFlat);

//       // ✅ Only validate house number if it's not disabled (for existing users)
//       if (!disableHouseFlat && !houseNumber?.trim()) {
//         alert("House/Flat Number is required");
//         return;
//       }

//       const payload = {
//         address: selectedAddress,
//         city: selectedCity,
//         lat: latLng.lat,
//         lng: latLng.lng,
//         houseNumber: houseNumber.trim(),
//         landmark: landmark.trim(),
//       };

//       console.log("Saving address payload:", payload);

//       try {
//         if (typeof onSave === "function") {
//           console.log("Calling onSave callback");
//           onSave(payload);
//         } else {
//           console.error("onSave is not a function");
//         }
//       } catch (e) {
//         console.error("onSave error:", e);
//       }

//       try {
//         onClose?.();
//       } catch (e) {
//         console.error("onClose error:", e);
//       }
//     } catch (e) {
//       console.error("Save error:", e);
//     }
//   };

//   /* ----------------------------- UI -------------------------------------- */
//   return (
//     <Modal
//       show={show}
//       onHide={onClose}
//       centered
//       size="lg"
//       enforceFocus={false} // ✅ FIX: lets you click the autocomplete dropdown
//       restoreFocus={false} // ✅ avoids focus glitches
//     >
//       {/* ✅ FIX: ensure google dropdown appears above modal */}
//       <style>{`
//         .pac-container{ z-index: 999999 !important; }
//       `}</style>

//       <Modal.Header closeButton>
//         <Modal.Title>Select Address</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div style={{ display: "flex", gap: 16 }}>
//           {/* LEFT: search + map */}
//           <div style={{ flex: 1, minWidth: 360 }}>
//             {/* ✅ Only show search input if allowSearch is true */}
//             {allowSearch ? (
//               <Form.Control
//                 ref={searchInputRef}
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 placeholder="Search your location..."
//                 autoComplete="off"
//                 style={{ marginBottom: 10 }}
//                 disabled={!mapsReady}
//               />
//             ) : (
//               <div
//                 style={{
//                   marginBottom: 10,
//                   padding: 8,
//                   background: "#f5f5f5",
//                   borderRadius: 8,
//                 }}
//               >
//                 <small>Search disabled - address is pre-filled</small>
//               </div>
//             )}
//             <div
//               style={{
//                 height: 320,
//                 width: "100%",
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 background: "#f3f3f3",
//                 border: allowMapPick ? "2px solid #e5747a" : "2px solid #ccc",
//                 position: "relative",
//               }}
//             >
//               {/* ✅ EMPTY map div */}
//               <div ref={mapDivRef} style={{ height: "100%", width: "100%" }} />

//               {/* ✅ overlays as siblings */}
//               {!mapsReady && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     background: "rgba(255,255,255,0.9)",
//                     zIndex: 2,
//                   }}
//                 >
//                   Loading map...
//                 </div>
//               )}

//               {!allowMapPick && mapsReady && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 10,
//                     left: 10,
//                     background: "rgba(0,0,0,0.7)",
//                     color: "white",
//                     padding: "4px 8px",
//                     borderRadius: 4,
//                     fontSize: 12,
//                     zIndex: 3,
//                   }}
//                 >
//                   Map interaction disabled
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT: selected address + details */}
//           <div style={{ flex: 1, minWidth: 360 }}>
//             <div style={{ fontWeight: 600, marginBottom: 8 }}>
//               Selected Address
//             </div>
//             {showChangeButton && (
//               <Button
//                 variant="secondary"
//                 onClick={onClickChange}
//                 style={{
//                   width: "40%",
//                   marginBottom: 10,
//                   borderRadius: 10,
//                   borderColor: "#e00a14",
//                   backgroundColor: "#e00a14", // ✅ correct
//                   color: "#fff",
//                 }}
//                 className="btn-sm"
//               >
//                 Change Address
//               </Button>
//             )}

//             <div
//               style={{
//                 border: "1px solid #eee",
//                 borderRadius: 12,
//                 padding: 12,
//                 marginBottom: 12,
//                 minHeight: 90,
//                 background: "#fafafa",
//               }}
//             >
//               <div style={{ fontSize: 14, marginBottom: 6 }}>
//                 {selectedAddress || "Pick a location from map or search"}
//               </div>
//               <div style={{ fontSize: 13, color: "#666" }}>
//                 City: <b>{selectedCity || "—"}</b>
//               </div>
//             </div>

//             <Form.Group className="mb-3">
//               <Form.Label>
//                 House/Flat Number <span style={{ color: "red" }}>*</span>
//               </Form.Label>
//               <Form.Control
//                 value={houseNumber}
//                 onChange={(e) => setHouseNumber(e.target.value)}
//                 placeholder="Enter House/Flat Number"
//                 disabled={disableHouseFlat || !mapsReady}
//                 readOnly={disableHouseFlat}
//                 style={{
//                   backgroundColor: disableHouseFlat ? "#f5f5f5" : "white",
//                   cursor: disableHouseFlat ? "not-allowed" : "text",
//                 }}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Landmark (Optional)</Form.Label>
//               <Form.Control
//                 value={landmark}
//                 onChange={(e) => setLandmark(e.target.value)}
//                 placeholder="Enter Landmark"
//                 disabled={disableLandmark || !mapsReady}
//                 readOnly={disableLandmark}
//                 style={{
//                   backgroundColor: disableLandmark ? "#f5f5f5" : "white",
//                   cursor: disableLandmark ? "not-allowed" : "text",
//                 }}
//               />
//             </Form.Group>

//             {/* ✅ Show Change button if needed */}

//             <Button
//               onClick={handleSave}
//               style={{
//                 width: "100%",
//                 borderRadius: 10,
//                 padding: "10px 12px",
//                 border: "none",
//                 background: "#e00a14ff",
//                 fontWeight: "bold",
//               }}
//               disabled={!mapsReady}
//             >
//               {primaryCtaLabel}
//             </Button>

//             <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
//               Lat: {latLng?.lat?.toFixed?.(6) || "N/A"} | Lng:{" "}
//               {latLng?.lng?.toFixed?.(6) || "N/A"}
//             </div>

//             {/* Debug info */}
//             <div style={{ marginTop: 8, fontSize: 10, color: "#aaa" }}>
//               Mode: {allowMapPick ? "Interactive" : "View Only"} | Search:{" "}
//               {allowSearch ? "Enabled" : "Disabled"}
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import { FaTimes } from "react-icons/fa";

// /**
//  * ✅ Put in .env (Vite)
//  * VITE_GOOGLE_MAPS_KEY=xxxxx
//  */
// const GOOGLE_MAPS_API_KEY =
//   import.meta?.env?.VITE_GOOGLE_MAPS_KEY || "PASTE_YOUR_KEY_HERE";

// /** ✅ Loader (maps + places) */
// let __gmapsPromise = null;

// const loadGoogleMapsPlaces = () => {
//   try {
//     if (__gmapsPromise) return __gmapsPromise;

//     __gmapsPromise = new Promise((resolve, reject) => {
//       try {
//         if (window.google?.maps?.places) return resolve(true);

//         const existing = Array.from(
//           document.querySelectorAll("script[src]")
//         ).find((s) =>
//           s.src.includes("https://maps.googleapis.com/maps/api/js")
//         );

//         if (existing) {
//           let tries = 0;
//           const t = setInterval(() => {
//             try {
//               tries += 1;
//               if (window.google?.maps?.places) {
//                 clearInterval(t);
//                 resolve(true);
//               }
//               if (tries > 60) {
//                 clearInterval(t);
//                 reject(
//                   new Error("Google Maps loaded but Places not available")
//                 );
//               }
//             } catch (e) {
//               clearInterval(t);
//               reject(e);
//             }
//           }, 150);
//           return;
//         }

//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
//           GOOGLE_MAPS_API_KEY
//         )}&libraries=places`;
//         script.async = true;
//         script.defer = true;

//         script.onload = () => resolve(true);
//         script.onerror = () =>
//           reject(new Error("Google Maps script load failed"));
//         document.head.appendChild(script);
//       } catch (e) {
//         reject(e);
//       }
//     });

//     return __gmapsPromise;
//   } catch (e) {
//     console.error("loadGoogleMapsPlaces error:", e);
//     return Promise.reject(e);
//   }
// };

// export default function AddressPickerModal({
//   open = true, // ✅ NEW: parent can pass show/open
//   onClose,
//   onSelect,
//   initialAddress = "",
//   initialHouseFlat = "",
//   initialLandmark = "",
//   initialLat = null,
//   initialLng = null,
//   title = "Select Address",

//   // ✅ NEW
//   allowSearch = true,
//   allowMapPick = true,
//   showChangeButton = false,
//   onClickChange,
// }) {
//   const mapDivRef = useRef(null);
//   const inputRef = useRef(null);

//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const geocoderRef = useRef(null);

//   const autoServiceRef = useRef(null);
//   const placesServiceRef = useRef(null);
//   const placesDummyDivRef = useRef(null);

//   const typingTimerRef = useRef(null);

//   const [loading, setLoading] = useState(true);

//   const [searchText, setSearchText] = useState(initialAddress || "");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSug, setShowSug] = useState(false);

//   const [addr, setAddr] = useState(initialAddress || "");
//   const [houseFlat, setHouseFlat] = useState(initialHouseFlat || "");
//   const [landmark, setLandmark] = useState(initialLandmark || "");

//   const [city, setCity] = useState(""); // ✅ NEW (optional but useful)

//   const [coords, setCoords] = useState({
//     lat: typeof initialLat === "number" ? initialLat : null,
//     lng: typeof initialLng === "number" ? initialLng : null,
//   });

//   const [isMobile, setIsMobile] = useState(() => {
//     try {
//       return window.innerWidth < 900;
//     } catch (e) {
//       return false;
//     }
//   });

//   // ✅ Helper: extract city from address_components
//   const extractCity = (components) => {
//     try {
//       const list = Array.isArray(components) ? components : [];
//       const get = (type) =>
//         list.find((c) => Array.isArray(c.types) && c.types.includes(type))
//           ?.long_name || "";
//       return (
//         get("locality") ||
//         get("administrative_area_level_2") ||
//         get("administrative_area_level_1") ||
//         ""
//       );
//     } catch (e) {
//       return "";
//     }
//   };

//   // ✅ Reverse geocode (fixed checks)
//   const reverseGeocode = (pos, fallback = "") => {
//     try {
//       const valid =
//         pos &&
//         typeof pos.lat === "number" &&
//         typeof pos.lng === "number" &&
//         geocoderRef.current;

//       if (!valid) return;

//       geocoderRef.current.geocode({ location: pos }, (results) => {
//         try {
//           const formatted =
//             results?.[0]?.formatted_address ||
//             fallback ||
//             `${pos.lat}, ${pos.lng}`;

//           setAddr(formatted);
//           setSearchText(formatted);
//           setShowSug(false);
//           setSuggestions([]);

//           const c = extractCity(results?.[0]?.address_components);
//           if (c) setCity(c);

//           setCoords({ lat: pos.lat, lng: pos.lng });

//           if (markerRef.current) markerRef.current.setPosition(pos);
//           if (mapRef.current) mapRef.current.panTo(pos);
//         } catch (e) {
//           console.warn("reverseGeocode cb error:", e);
//         }
//       });
//     } catch (e) {
//       console.warn("reverseGeocode error:", e);
//     }
//   };

//   // ✅ Responsive
//   useEffect(() => {
//     const onResize = () => {
//       try {
//         setIsMobile(window.innerWidth < 900);
//       } catch (e) {}
//     };
//     try {
//       window.addEventListener("resize", onResize);
//     } catch (e) {}
//     return () => {
//       try {
//         window.removeEventListener("resize", onResize);
//       } catch (e) {}
//     };
//   }, []);

//   // ✅ Sync props to local state (this part is okay in your code)
//   useEffect(() => {
//     try {
//       setAddr(initialAddress || "");
//       setSearchText(initialAddress || "");
//       setHouseFlat(initialHouseFlat || "");
//       setLandmark(initialLandmark || "");
//       setCoords({
//         lat: typeof initialLat === "number" ? initialLat : null,
//         lng: typeof initialLng === "number" ? initialLng : null,
//       });
//     } catch (e) {
//       console.warn("props sync error:", e);
//     }
//   }, [
//     initialAddress,
//     initialHouseFlat,
//     initialLandmark,
//     initialLat,
//     initialLng,
//   ]);

//   // ✅ Init map ONCE
//   useEffect(() => {
//     let mounted = true;

//     const initMap = async () => {
//       try {
//         setLoading(true);

//         await loadGoogleMapsPlaces();
//         if (!mounted) return;

//         geocoderRef.current = new window.google.maps.Geocoder();

//         const center = {
//           lat: typeof coords.lat === "number" ? coords.lat : 12.9716,
//           lng: typeof coords.lng === "number" ? coords.lng : 77.5946,
//         };

//         // ✅ Create map
//         mapRef.current = new window.google.maps.Map(mapDivRef.current, {
//           center,
//           zoom: 15,
//           fullscreenControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,

//           // ✅ lock/unlock interactions
//           draggable: allowMapPick,
//           scrollwheel: allowMapPick,
//           disableDoubleClickZoom: !allowMapPick,
//           gestureHandling: allowMapPick ? "auto" : "none",
//           keyboardShortcuts: allowMapPick,
//         });

//         // ✅ Create marker
//         markerRef.current = new window.google.maps.Marker({
//           map: mapRef.current,
//           position: center,
//           draggable: allowMapPick,
//         });

//         // ✅ Places services
//         try {
//           autoServiceRef.current =
//             new window.google.maps.places.AutocompleteService();
//           placesServiceRef.current =
//             new window.google.maps.places.PlacesService(
//               placesDummyDivRef.current
//             );
//         } catch (e) {
//           console.error("PlacesService init error:", e);
//         }

//         // ✅ IMPORTANT: clear old listeners (prevents duplicate firing)
//         try {
//           if (markerRef.current) {
//             window.google.maps.event.clearInstanceListeners(markerRef.current);
//           }
//           if (mapRef.current) {
//             window.google.maps.event.clearInstanceListeners(mapRef.current);
//           }
//         } catch (e) {
//           console.warn("clear listeners error:", e);
//         }

//         // ✅ Add listeners ONLY if picking is allowed
//         if (allowMapPick) {
//           window.google.maps.event.addListener(
//             markerRef.current,
//             "dragend",
//             (e) => {
//               try {
//                 const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//                 reverseGeocode(pos);
//               } catch (err) {
//                 console.warn("marker dragend error:", err);
//               }
//             }
//           );

//           window.google.maps.event.addListener(mapRef.current, "click", (e) => {
//             try {
//               const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//               markerRef.current?.setPosition(pos);
//               reverseGeocode(pos);
//             } catch (err) {
//               console.warn("map click error:", err);
//             }
//           });
//         }

//         // ✅ If initial coords exist, reverse geocode it
//         if (typeof coords.lat === "number" && typeof coords.lng === "number") {
//           reverseGeocode({ lat: coords.lat, lng: coords.lng }, addr);
//         } else {
//           // ✅ Otherwise use geolocation
//           try {
//             if (navigator.geolocation) {
//               navigator.geolocation.getCurrentPosition(
//                 (p) => {
//                   try {
//                     const pos = {
//                       lat: p.coords.latitude,
//                       lng: p.coords.longitude,
//                     };
//                     markerRef.current?.setPosition(pos);
//                     mapRef.current?.setCenter(pos);
//                     reverseGeocode(pos);
//                   } catch (e) {
//                     console.warn("geo success handler error:", e);
//                   }
//                 },
//                 (err) => console.warn("geolocation error:", err),
//                 { enableHighAccuracy: true, timeout: 8000 }
//               );
//             }
//           } catch (e) {
//             console.warn("geolocation init error:", e);
//           }
//         }

//         setLoading(false);
//       } catch (e) {
//         console.error("initMap error:", e);
//         setLoading(false);
//       }
//     };

//     initMap();

//     return () => {
//       mounted = false;
//       try {
//         if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
//       } catch (e) {}
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /**
//    * ✅ KEY FIX:
//    * When parent updates initialLat/initialLng later,
//    * coords state changes -> update marker & center.
//    */
//   useEffect(() => {
//     try {
//       if (!mapRef.current || !markerRef.current) return;
//       if (typeof coords.lat !== "number" || typeof coords.lng !== "number")
//         return;

//       const pos = { lat: coords.lat, lng: coords.lng };
//       markerRef.current.setPosition(pos);
//       mapRef.current.panTo(pos);

//       // If address is empty but coords is present, reverse geocode once
//       if (!addr?.trim() && geocoderRef.current) {
//         reverseGeocode(pos);
//       }
//     } catch (e) {
//       console.warn("coords->map sync error:", e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [coords.lat, coords.lng]);

//   // ✅ Suggestions
//   const fetchSuggestions = (text) => {
//     if (!allowSearch) return;
//     try {
//       const q = String(text || "").trim();
//       if (!q) {
//         setSuggestions([]);
//         setShowSug(false);
//         return;
//       }
//       if (!autoServiceRef.current) return;

//       autoServiceRef.current.getPlacePredictions(
//         { input: q, componentRestrictions: { country: "in" } },
//         (preds) => {
//           try {
//             const list = Array.isArray(preds) ? preds : [];
//             setSuggestions(list);
//             setShowSug(true);
//           } catch (e) {
//             console.warn("getPlacePredictions cb error:", e);
//           }
//         }
//       );
//     } catch (e) {
//       console.warn("fetchSuggestions error:", e);
//     }
//   };

//   // ✅ Suggestion select -> get details
//   const selectSuggestion = (prediction) => {
//     if (!allowSearch) return;
//     try {
//       if (!prediction?.place_id) return;
//       if (!placesServiceRef.current) return;

//       placesServiceRef.current.getDetails(
//         {
//           placeId: prediction.place_id,
//           fields: ["formatted_address", "geometry", "address_components"], // ✅ add comps
//         },
//         (place) => {
//           try {
//             const loc = place?.geometry?.location;
//             if (!loc) return;

//             const pos = { lat: loc.lat(), lng: loc.lng() };
//             const formatted =
//               place?.formatted_address || prediction.description;

//             setAddr(formatted || "");
//             setSearchText(formatted || "");
//             setSuggestions([]);
//             setShowSug(false);

//             const c = extractCity(place?.address_components);
//             if (c) setCity(c);

//             setCoords(pos);

//             markerRef.current?.setPosition(pos);
//             mapRef.current?.panTo(pos);
//           } catch (e) {
//             console.warn("getDetails cb error:", e);
//           }
//         }
//       );
//     } catch (e) {
//       console.warn("selectSuggestion error:", e);
//     }
//   };

//   const handleSave = () => {
//     try {
//       const payload = {
//         address: addr?.trim() || "",
//         houseNumber: houseFlat?.trim() || "",
//         landmark: landmark?.trim() || "",
//         latitude: typeof coords.lat === "number" ? coords.lat : null,
//         longitude: typeof coords.lng === "number" ? coords.lng : null,
//         city: city || "",
//       };

//       if (!payload.address) {
//         alert("Please select an address from the suggestions.");
//         return;
//       }
//       if (!payload.houseNumber) {
//         alert("House/Flat Number is required");
//         return;
//       }
//       if (
//         typeof payload.latitude !== "number" ||
//         typeof payload.longitude !== "number"
//       ) {
//         alert("Please pick a valid point on map");
//         return;
//       }

//       onSelect?.(payload);
//       onClose?.();
//     } catch (e) {
//       console.error("handleSave error:", e);
//     }
//   };

//   // ✅ Visibility control
//   if (!open) return null;

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <div ref={placesDummyDivRef} style={{ display: "none" }} />

//         <div style={styles.header}>
//           <div style={styles.title}>{title}</div>
//           <button
//             style={styles.closeBtn}
//             onClick={() => {
//               try {
//                 onClose?.();
//               } catch (e) {
//                 console.error("close error:", e);
//               }
//             }}
//           >
//             <FaTimes />
//           </button>
//         </div>

//         <div
//           style={{
//             ...styles.body,
//             flexDirection: isMobile ? "column" : "row",
//           }}
//         >
//           <div style={styles.leftPane}>
//             {allowSearch && (
//               <div style={{ padding: "0 16px", position: "relative" }}>
//                 <input
//                   ref={inputRef}
//                   value={searchText}
//                   placeholder="Search location..."
//                   style={styles.search}
//                   autoComplete="off"
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setSearchText(val);

//                     if (typingTimerRef.current)
//                       clearTimeout(typingTimerRef.current);
//                     typingTimerRef.current = setTimeout(() => {
//                       fetchSuggestions(val);
//                     }, 250);
//                   }}
//                   onFocus={() => {
//                     if (suggestions.length) setShowSug(true);
//                   }}
//                   onBlur={() => {
//                     setTimeout(() => setShowSug(false), 180);
//                   }}
//                 />

//                 {showSug && suggestions.length > 0 && (
//                   <div style={styles.suggestionBox}>
//                     {suggestions.map((p) => (
//                       <div
//                         key={p.place_id}
//                         style={styles.suggestionItem}
//                         onMouseDown={(e) => e.preventDefault()}
//                         onClick={() => selectSuggestion(p)}
//                       >
//                         {p.description}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div style={styles.mapWrap}>
//               <div ref={mapDivRef} style={styles.map} />
//               {loading && <div style={styles.loading}>Loading map…</div>}
//             </div>
//           </div>

//           <div style={styles.rightPane}>
//              {showChangeButton && (
//             <button
//               onClick={() => onClickChange?.()}
//               style={{
//                 backgroundColor: "red",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 8,
//                 padding: "6px 12px",
//                 fontSize: 14,
//                 fontWeight: 500,
//                 marginBottom: 12,
//                 cursor: "pointer",
//                 width: "fit-content",
//                 margin:"20px 10px"
//               }}
//             >
//               Change
//             </button>
//           )}

//             <div style={styles.form}>
//               <textarea
//                 value={addr}
//                 readOnly
//                 style={styles.textarea}
//                 placeholder="Selected address will appear here"
//               />

//               <input
//                 value={houseFlat}
//                 onChange={(e) => {
//                   try {
//                     setHouseFlat(e.target.value);
//                   } catch (err) {}
//                 }}
//                 placeholder="House / Flat / Building"
//                 style={styles.input}
//               />

//               <input
//                 value={landmark}
//                 onChange={(e) => {
//                   try {
//                     setLandmark(e.target.value);
//                   } catch (err) {}
//                 }}
//                 placeholder="Landmark (optional)"
//                 style={styles.input}
//               />

//               <button style={styles.saveBtn} onClick={handleSave}>
//                 Save Address
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /** ✅ Styles */
// const styles = {
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.55)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//     padding: 16,
//   },

//   // ✅ Modal is COLUMN now (Header top + Body below)
//   modal: {
//     width: "min(1100px, 70vw)",
//     background: "#fff",
//     borderRadius: 14,
//     overflow: "hidden",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//     display: "flex",
//     flexDirection: "column",
//   },

//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "14px 16px",
//     borderBottom: "1px solid #eee",
//   },
//   title: { fontSize: 16, fontWeight: 700, color: "#e60000" },
//   closeBtn: {
//     // width: 38,
//     // height: 38,
//     borderRadius: 10,
//     border: "1px solid #eee",
//     background: "#fff",
//     color: "#111",
//     cursor: "pointer",
//     display: "grid",
//     placeItems: "center",
//   },

//   // ✅ Body row: left + right
//   body: {
//     display: "flex",
//     width: "100%",
//     minHeight: 520,
//   },

//   // ✅ Left panel (map area)
//   leftPane: {
//     flex: 1,
//     minWidth: 0,
//     borderRight: "1px solid #eee",
//   },

//   // ✅ Right panel (form area)
//   rightPane: {
//     flex: "0 0 380px", // fixed width on desktop
//     minWidth: 0,
//     background: "#fff",
//   },

//   search: {
//     width: "100%",
//     margin: "14px 0 12px",
//     padding: 12,
//     border: "1px solid #ddd",
//     borderRadius: 10,
//     fontSize: 14,
//     backgroundColor: "#fff",
//     color: "#111",
//     outline: "none",
//   },

//   suggestionBox: {
//     position: "absolute",
//     top: 58,
//     left: 16,
//     right: 16,
//     background: "#fff",
//     border: "1px solid #e7e7e7",
//     borderRadius: 10,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
//     zIndex: 999999,
//     maxHeight: 220,
//     overflowY: "auto",
//   },
//   suggestionItem: {
//     padding: "10px 12px",
//     fontSize: 14,
//     cursor: "pointer",
//     borderBottom: "1px solid #f2f2f2",
//     color: "#111",
//   },

//   mapWrap: {
//     position: "relative",
//     height: 420,
//     background: "#f7f7f7",
//   },
//   map: { width: "100%", height: "100%" },
//   loading: {
//     position: "absolute",
//     top: 12,
//     left: 12,
//     background: "rgba(255,255,255,0.92)",
//     border: "1px solid #eee",
//     padding: "8px 10px",
//     borderRadius: 10,
//     fontSize: 13,
//     color: "#111",
//   },

//   form: {
//     padding: 16,
//   },
//   input: {
//     width: "100%",
//     padding: 12,
//     border: "1px solid #ddd",
//     borderRadius: 10,
//     fontSize: 14,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//     color: "#111",
//     outline: "none",
//   },
//   textarea: {
//     width: "100%",
//     minHeight: 90,
//     resize: "none",
//     padding: 12,
//     border: "1px solid #ddd",
//     borderRadius: 10,
//     fontSize: 14,
//     marginBottom: 14,
//     backgroundColor: "#fafafa",
//     color: "#111",
//     outline: "none",
//   },
//   saveBtn: {
//     width: "100%",
//     padding: 12,
//     borderRadius: 10,
//     border: "none",
//     background: "#e60000",
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
// };
