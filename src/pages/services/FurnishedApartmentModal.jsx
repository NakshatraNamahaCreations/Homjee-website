import React, { useContext } from "react";
import { CartContext } from "../CartContext";

// Consistent import paths
import furnishedTypesOfCleaning from "/media/typesofcleaning.jpeg";
import furnishedWhatWeClean from "/media/whatweclean.jpeg";
import furnishedKitchen from "/media/kitchen.jpeg";
import furnishedFloor from "/media/floor.jpeg";
import furnishedBathroom from "/media/bathroom.webp";
import furnishedBalcony from "/media/bolcany.jpeg";
import furnishedIncludes from "/media/includes.jpeg";
import furnishedExcludes from "/media/Excludes.jpeg"; // Verify case sensitivity of file name
import furnishedWhatWeDo from "/media/whatwedo.jpeg";

const FurnishedApartmentModal = ({ pkgGroup, closeModal }) => {
  const { updateCartItem, getQuantity } = useContext(CartContext);
  const serviceName = "Furnished Apartment"; // Match CartProvider and desired cart structure

  // Guard clause for invalid pkgGroup
  if (!pkgGroup || !Array.isArray(pkgGroup)) {
    console.warn("pkgGroup is missing or not an array");
    return null;
  }

  // Calculate totals for footer
  const totalQuantity = pkgGroup.reduce(
    (total, pkg) => total + getQuantity(pkg.name, serviceName),
    0
  );
  const totalPrice = pkgGroup.reduce(
    (total, pkg) => total + getQuantity(pkg.name, serviceName) * pkg.price,
    0
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          width: "500px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            .modal-content::-webkit-scrollbar {
              display: none;
            }
            .modal-content {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `}
        </style>
        <div
          className="modal-content"
          style={{
            overflowY: "auto",
            padding: "20px",
            flex: 1,
          }}
        >
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#333",
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
          <h2
            id="modal-title"
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "10px",
              color: "#333",
            }}
          >
            {serviceName} - {pkgGroup[0]?.name?.split(" - ")[0] || "Unknown"}
          </h2>
          {pkgGroup.map((pkg, index) => (
            <div
              key={pkg.id || index}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "5px",
                  }}
                >
                  {pkg.name?.split(" - ")[1] || "Unknown Package"}
                </h4>
                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    marginBottom: "8px",
                  }}
                >
                  ₹{pkg.price || 0} •{" "}
                  {pkg.name?.includes("Premium") ? "6 hrs" : "5 hrs"}
                </p>
                <ul
                  style={{
                    paddingLeft: "20px",
                    fontSize: "13px",
                    marginBottom: "8px",
                    color: "#333",
                  }}
                >
                  <li>{pkg.details || "No details available"}</li>
                  <li>{pkg.extras || "No extras available"}</li>
                </ul>
              </div>
              <div style={{ marginLeft: "15px", marginTop: "8px" }}>
                {getQuantity(pkg.name, serviceName) > 0 ? (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: "1px solid red",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCartItem(pkg.name, pkg.price, -1, serviceName);
                      }}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#fff",
                        border: "none",
                        fontSize: "16px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      aria-label={`Remove one ${pkg.name} from cart`}
                    >
                      −
                    </button>
                    <span style={{ padding: "5px 15px", fontSize: "14px" }}>
                      {getQuantity(pkg.name, serviceName)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCartItem(pkg.name, pkg.price, 1, serviceName);
                      }}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "red",
                        color: "#fff",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      aria-label={`Add one ${pkg.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    style={{
                      backgroundColor: "transparent",
                      color: "red",
                      border: "1px solid red",
                      padding: "8px 18px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      updateCartItem(pkg.name, pkg.price, 1, serviceName)
                    }
                    aria-label={`Add ${pkg.name} to cart`}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            {[
              { src: furnishedTypesOfCleaning, alt: "Types of cleaning" },
              { src: furnishedWhatWeClean, alt: "What we clean" },
              { src: furnishedKitchen, alt: "Kitchen" },
              { src: furnishedBathroom, alt: "Bathroom" },
              { src: furnishedBalcony, alt: "Balcony" },
              { src: furnishedFloor, alt: "Floor" },
              { src: furnishedIncludes, alt: "Includes" },
              { src: furnishedExcludes, alt: "Excludes" },
              { src: furnishedWhatWeDo, alt: "What we do" },
            ].map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "450px",
                  height: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
                onError={(e) =>
                  console.error(`Failed to load image: ${image.src}`)
                }
              />
            ))}
          </div>
        </div>
        {totalQuantity > 0 && (
          <div
            style={{
              borderTop: "1px solid #ddd",
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
              {totalQuantity} × ₹{totalPrice}
            </div>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                padding: "10px 25px",
                borderRadius: "10px",
                fontSize: "15px",
                cursor: "pointer",
              }}
              aria-label="Confirm and close modal"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FurnishedApartmentModal;
