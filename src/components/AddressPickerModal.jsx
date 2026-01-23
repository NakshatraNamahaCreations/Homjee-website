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
  const [searchText, setSearchText] = useState(""); // ✅ ALWAYS start blank
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
      if (!show) return;

      setSelectedAddress(initialAddress || "");
      setSelectedCity(initialCity || "");

      // ✅ ALWAYS blank search box (even if existing/current address is shown)
      setSearchText("");

      setHouseNumber(initialHouseFlat || "");
      setLandmark(initialLandmark || "");
    } catch (e) {
      console.error("sync initial fields failed", e);
    }
  }, [show, initialAddress, initialCity, initialHouseFlat, initialLandmark]);

  useEffect(() => {
    try {
      if (!show) return;
      if (initialLatLng?.lat && initialLatLng?.lng) {
        setLatLng({
          lat: Number(initialLatLng.lat),
          lng: Number(initialLatLng.lng),
        });
      }
    } catch (e) {
      console.error("sync initialLatLng failed", e);
    }
  }, [show, initialLatLng?.lat, initialLatLng?.lng]);

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
          markerRef.current.setDraggable(true); // ✅ ALWAYS draggable
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
        setSearchText(""); // ✅ keep search blank after selection
        return;
      }

      // reverse geocode
      const { formatted, city } = await reverseGeocode(pos);
      setSelectedAddress(formatted);
      setSelectedCity(city);
      setSearchText(""); // ✅ keep search blank
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

      // create marker (✅ ALWAYS draggable)
      markerRef.current = new window.google.maps.Marker({
        position: latLng,
        map: mapRef.current,
        draggable: true,
      });

      // ✅ attach listeners ALWAYS
      mapClickListenerRef.current = mapRef.current.addListener("click", (e) =>
        setFromLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      );

      markerDragListenerRef.current = markerRef.current.addListener(
        "dragend",
        (e) => setFromLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      );

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

  /* ------------------------ Init Autocomplete (ALWAYS) ------------------- */
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

          // ✅ set selected address + keep search blank after selection
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
  }, [show, mapsReady]);

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
      // ✅ only validate house number if it is NOT disabled
      if (!houseNumber?.trim()) {
        alert("House/Flat Number is required");
        return;
      }

      // ✅ basic address validation
      if (!selectedAddress?.trim()) {
        alert("Please select an address");
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
  const isSaveDisabled =
    !mapsReady ||
    !selectedAddress?.trim() ||
    !houseNumber?.trim();

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
            {/* ✅ Search ALWAYS visible */}
            <Form.Control
              ref={searchInputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search new address..."
              autoComplete="off"
              style={{ marginBottom: 10 }}
              disabled={!mapsReady}
            />

            {/* Map ALWAYS visible */}
            <div
              style={{
                height: 320,
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                background: "#f3f3f3",
                border: "2px solid #e5747a",
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
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1, minWidth: 360 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Selected Address
            </div>

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
                House/Flat Number{" "}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder={"Enter House/Flat Number"}
                disabled={ !mapsReady}
          
                style={{
                  backgroundColor:  "white",
                
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Landmark (Optional)</Form.Label>
              <Form.Control
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={ "Enter Landmark"}
                disabled={ !mapsReady}
  
                style={{
                  backgroundColor:  "white",
         
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
              disabled={isSaveDisabled}
            >
             Save & Proceed
            </Button>

            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              Lat: {latLng?.lat?.toFixed?.(6) || "N/A"} | Lng:{" "}
              {latLng?.lng?.toFixed?.(6) || "N/A"}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// // AddressPickerModal.jsx
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
//         if (window.google?.maps) return resolve(true);

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
//               if (window.google?.maps) {
//                 clearInterval(t);
//                 resolve(true);
//               }
//               if (tries > 50) {
//                 clearInterval(t);
//                 reject(new Error("Google Maps not available."));
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
//             if (window.google?.maps) resolve(true);
//             else reject(new Error("Google Maps loaded but not available."));
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

//   // config props
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
//   const mapRef = useRef(null);
//   const mapDivRef = useRef(null);
//   const markerRef = useRef(null);
//   const acRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const geocoderRef = useRef(null);

//   const mapClickListenerRef = useRef(null);
//   const markerDragListenerRef = useRef(null);
//   const acListenerRef = useRef(null);

//   const [mapsReady, setMapsReady] = useState(false);

//   // controlled fields
//   const [searchText, setSearchText] = useState(initialAddress || "");
//   const [selectedAddress, setSelectedAddress] = useState(initialAddress || "");
//   const [selectedCity, setSelectedCity] = useState(initialCity || "");
//   const [latLng, setLatLng] = useState({
//     lat: Number(initialLatLng?.lat ?? 12.9716),
//     lng: Number(initialLatLng?.lng ?? 77.5946),
//   });
//   const [houseNumber, setHouseNumber] = useState(initialHouseFlat || "");
//   const [landmark, setLandmark] = useState(initialLandmark || "");

//   /* --------------------- Load Google when modal opens --------------------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         if (!show) return;
//         await loadGoogleMapsPlaces();
//         setMapsReady(true);
//       } catch (e) {
//         console.error("Google Maps load error:", e);
//         setMapsReady(false);
//       }
//     })();
//   }, [show]);

//   /* ---------------------- Sync incoming props to state -------------------- */
//   useEffect(() => {
//     try {
//       setSelectedAddress(initialAddress || "");
//       setSelectedCity(initialCity || "");

//       if (allowSearch) setSearchText(initialAddress || "");
//       else setSearchText("");

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
//         setLatLng({
//           lat: Number(initialLatLng.lat),
//           lng: Number(initialLatLng.lng),
//         });
//       }
//     } catch (e) {
//       console.error("sync initialLatLng failed", e);
//     }
//   }, [initialLatLng?.lat, initialLatLng?.lng]);

//   /* --------------------------- Reverse geocode ---------------------------- */
//   const reverseGeocode = async (pos) => {
//     try {
//       const geocoder = geocoderRef.current;
//       if (!geocoder) return { formatted: "", city: "" };

//       return await new Promise((resolve) => {
//         try {
//           geocoder.geocode({ location: pos }, (results, status) => {
//             try {
//               if (status === "OK" && results?.length) {
//                 const best = results[0];
//                 resolve({
//                   formatted: safe(best.formatted_address, ""),
//                   city: extractCity(best.address_components || []),
//                 });
//               } else {
//                 resolve({ formatted: "", city: "" });
//               }
//             } catch (e) {
//               resolve({ formatted: "", city: "" });
//             }
//           });
//         } catch (e) {
//           resolve({ formatted: "", city: "" });
//         }
//       });
//     } catch (e) {
//       return { formatted: "", city: "" };
//     }
//   };

//   /* ----------------------- Set location everywhere ------------------------ */
//   const setFromLatLng = async (pos, placeMeta = null) => {
//     try {
//       setLatLng(pos);

//       // map + marker update
//       try {
//         if (markerRef.current) {
//           markerRef.current.setPosition(pos);
//           markerRef.current.setDraggable(!!allowMapPick);
//         }
//         if (mapRef.current) {
//           mapRef.current.panTo(pos);
//           if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(15);
//         }
//       } catch (e) {
//         console.error("Error updating map/marker:", e);
//       }

//       // address from autocomplete
//       if (placeMeta?.formatted) {
//         setSelectedAddress(placeMeta.formatted);
//         setSelectedCity(extractCity(placeMeta.components || []));
//         return;
//       }

//       // reverse geocode
//       const { formatted, city } = await reverseGeocode(pos);
//       setSelectedAddress(formatted);
//       setSelectedCity(city);

//       if (formatted && allowSearch) setSearchText(formatted);
//     } catch (e) {
//       console.error("setFromLatLng error:", e);
//     }
//   };

//   /* --------------------------- Create Map (once) -------------------------- */
//   useEffect(() => {
//     try {
//       if (!show || !mapsReady) return;
//       if (!mapDivRef.current) return;

//       // if map already exists, don't recreate
//       if (mapRef.current) return;

//       // create geocoder
//       geocoderRef.current = new window.google.maps.Geocoder();

//       // create map
//       mapRef.current = new window.google.maps.Map(mapDivRef.current, {
//         center: latLng,
//         zoom: 15,
//         disableDefaultUI: false,
//         streetViewControl: false,
//         mapTypeControl: false,
//         fullscreenControl: false,
//       });

//       // create marker
//       markerRef.current = new window.google.maps.Marker({
//         position: latLng,
//         map: mapRef.current,
//         draggable: !!allowMapPick,
//       });

//       // ✅ important: resize after modal paint
//       window.setTimeout(() => {
//         try {
//           if (!mapRef.current) return;
//           window.google?.maps?.event?.trigger(mapRef.current, "resize");
//           mapRef.current.setCenter(latLng);
//           markerRef.current?.setPosition(latLng);
//         } catch (e) {
//           console.error("map resize trigger failed", e);
//         }
//       }, 150);
//     } catch (e) {
//       console.error("Map init error:", e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [show, mapsReady]);

//   /* ------------------ Keep map in sync whenever latLng changes ------------ */
//   useEffect(() => {
//     try {
//       if (!show || !mapsReady) return;
//       if (!mapRef.current || !markerRef.current) return;

//       mapRef.current.setCenter(latLng);
//       markerRef.current.setPosition(latLng);

//       window.setTimeout(() => {
//         try {
//           if (!mapRef.current) return;
//           window.google?.maps?.event?.trigger(mapRef.current, "resize");
//           mapRef.current.setCenter(latLng);
//           markerRef.current?.setPosition(latLng);
//         } catch (e) {
//           console.error("map resize trigger failed", e);
//         }
//       }, 150);
//     } catch (e) {
//       console.error("map sync effect failed", e);
//     }
//   }, [show, mapsReady, latLng?.lat, latLng?.lng]);

//   /* ------------------- Update interaction when allowMapPick changes -------- */
//   useEffect(() => {
//     try {
//       if (!show || !mapsReady) return;
//       if (!mapRef.current || !markerRef.current) return;

//       // update draggable
//       markerRef.current.setDraggable(!!allowMapPick);

//       // clear old listeners
//       try {
//         if (mapClickListenerRef.current) {
//           window.google.maps.event.removeListener(mapClickListenerRef.current);
//           mapClickListenerRef.current = null;
//         }
//         if (markerDragListenerRef.current) {
//           window.google.maps.event.removeListener(markerDragListenerRef.current);
//           markerDragListenerRef.current = null;
//         }
//       } catch (e) {}

//       // attach listeners only if allowed
//       if (allowMapPick) {
//         mapClickListenerRef.current = mapRef.current.addListener("click", (e) =>
//           setFromLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
//         );
//         markerDragListenerRef.current = markerRef.current.addListener(
//           "dragend",
//           (e) => setFromLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
//         );
//       }
//     } catch (e) {
//       console.error("allowMapPick listener update failed", e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [show, mapsReady, allowMapPick]);

//   /* ------------------------ Init Autocomplete (optional) ------------------- */
//   useEffect(() => {
//     try {
//       if (!show || !mapsReady) return;

//       // clear old autocomplete listener
//       try {
//         if (acListenerRef.current) {
//           window.google.maps.event.removeListener(acListenerRef.current);
//           acListenerRef.current = null;
//         }
//       } catch (e) {}

//       if (!allowSearch) return;

//       const input = searchInputRef.current;
//       if (!input) return;

//       if (!window.google?.maps?.places?.Autocomplete) {
//         console.warn("Places Autocomplete not available on this build.");
//         return;
//       }

//       const ac = new window.google.maps.places.Autocomplete(input, {
//         fields: ["formatted_address", "geometry", "address_components"],
//         types: ["geocode", "establishment"],
//       });

//       acRef.current = ac;

//       acListenerRef.current = ac.addListener("place_changed", () => {
//         try {
//           const place = ac.getPlace();
//           if (!place?.geometry?.location) return;

//           const formatted = safe(place.formatted_address, input.value);
//           const lat = place.geometry.location.lat();
//           const lng = place.geometry.location.lng();

//           setSearchText(formatted);
//           setFromLatLng(
//             { lat, lng },
//             { formatted, components: place.address_components }
//           );
//         } catch (e) {
//           console.error("Autocomplete place_changed error:", e);
//         }
//       });
//     } catch (e) {
//       console.error("Autocomplete init error:", e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [show, mapsReady, allowSearch]);

//   /* ------------------------------- Cleanup -------------------------------- */
//   useEffect(() => {
//     try {
//       if (show) return;

//       // clear listeners
//       try {
//         if (mapClickListenerRef.current) {
//           window.google?.maps?.event?.removeListener(mapClickListenerRef.current);
//           mapClickListenerRef.current = null;
//         }
//         if (markerDragListenerRef.current) {
//           window.google?.maps?.event?.removeListener(markerDragListenerRef.current);
//           markerDragListenerRef.current = null;
//         }
//         if (acListenerRef.current) {
//           window.google?.maps?.event?.removeListener(acListenerRef.current);
//           acListenerRef.current = null;
//         }
//       } catch (e) {}

//       try {
//         if (markerRef.current)
//           window.google?.maps?.event?.clearInstanceListeners(markerRef.current);
//         if (mapRef.current)
//           window.google?.maps?.event?.clearInstanceListeners(mapRef.current);
//       } catch (e) {}

//       // destroy refs
//       markerRef.current = null;
//       mapRef.current = null;
//       geocoderRef.current = null;
//       acRef.current = null;

//       // clear map DOM safely
//       if (mapDivRef.current) {
//         mapDivRef.current.innerHTML = "";
//       }
//     } catch (e) {
//       console.error("cleanup on modal close failed", e);
//     }
//   }, [show]);

//   /* ----------------------------- Save ------------------------------------ */
//   const handleSave = async () => {
//     try {
//       if (!disableHouseFlat && !houseNumber?.trim()) {
//         alert("House/Flat Number is required");
//         return;
//       }

//       const payload = {
//         address: selectedAddress,
//         city: selectedCity,
//         lat: latLng.lat,
//         lng: latLng.lng,
//         houseNumber: (houseNumber || "").trim(),
//         landmark: (landmark || "").trim(),
//       };

//       try {
//         if (typeof onSave === "function") onSave(payload);
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
//       enforceFocus={false}
//       restoreFocus={false}
//     >
//       <style>{`.pac-container{ z-index: 999999 !important; }`}</style>

//       <Modal.Header closeButton>
//         <Modal.Title>Select Address</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div style={{ display: "flex", gap: 16 }}>
//           {/* LEFT */}
//           <div style={{ flex: 1, minWidth: 360 }}>
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

//             {/* ✅ IMPORTANT: wrapper with EMPTY map div, overlays as siblings */}
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
//               <div ref={mapDivRef} style={{ height: "100%", width: "100%" }} />

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

//               {/* {!allowMapPick && mapsReady && (
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
//               )} */}
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div style={{ flex: 1, minWidth: 360 }}>
//             <div style={{ fontWeight: 600, marginBottom: 8 }}>
//               Selected Address
//             </div>

//             {showChangeButton && (
//               <Button
//                 variant="secondary"
//                 onClick={() => {
//                   try {
//                     onClickChange?.();
//                   } catch (e) {
//                     console.error("onClickChange failed", e);
//                   }
//                 }}
//                 style={{
//                   width: "40%",
//                   marginBottom: 10,
//                   borderRadius: 10,
//                   borderColor: "#e00a14",
//                   backgroundColor: "#e00a14",
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

