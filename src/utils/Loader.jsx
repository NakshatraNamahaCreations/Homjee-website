import React from "react";
import "./loader.css"; // Import CSS for the loader

const Loader = () => {
  return (
    <div className="global-loader-overlay">
      <div className="global-spinner"></div>
    </div>
  );
};

export default Loader;
