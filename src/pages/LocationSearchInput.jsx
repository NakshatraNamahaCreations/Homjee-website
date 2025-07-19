import React, { useEffect, useRef } from "react";

function LocationSearchInput({ setCoordinates }) {
  const inputRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCoordinates({ lat, lng });
          }
        });

        clearInterval(interval); // stop polling
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for a location"
      style={{ padding: 10, width: "100%" }}
    />
  );
}

export default LocationSearchInput;
