import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function VendorRatings() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const vendorId = query.get("vendorId");
  const bookingId = query.get("bookingId");
  const vendorName = query.get("vendorName") || "Vendor";
  const vendorPhoto =
    "https://idaindia.org.in/wp-content/uploads/2022/08/indian-testimonial-pranav-img-02-v01.png";
  //   query.get("vendorPhoto"); // optional

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleRatingSelect = async (value) => {
    setRating(value);

    // Redirect if rating is 4 or 5
    if (value >= 4) {
      window.location.href = "https://g.page/your-google-review-link";
      return;
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating");

    const payload = {
      vendorId,
      bookingId,
      rating,
      feedback,
    };

    await axios.post("/api/vendor-ratings", payload);
    alert("Thank you! Your feedback is submitted.");
    navigate("/thank-you");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      {/* Back Arrow */}
      <div
        style={{ marginBottom: 20, cursor: "pointer", fontWeight: 600 }}
        // onClick={() => navigate(-1)}
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack style={{ fontSize: "35px" }} /> Homjee - Deep
        Cleaning & Paintings
      </div>

      {/* Vendor Info */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <img
          src={
            vendorPhoto ||
            "https://idaindia.org.in/wp-content/uploads/2022/08/indian-testimonial-pranav-img-02-v01.png"
          }
          alt="vendor"
          style={{
            width: 55,
            height: 55,
            borderRadius: "50%",
            marginRight: 10,
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{vendorName}</div>
          <div style={{ color: "#666", marginTop: 3 }}>
            Posting publicly for this service
          </div>
        </div>
      </div>

      {/* Google-style Stars */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 25 }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={35}
            color={rating >= star ? "#f4b400" : "#e4e5e9"}
            onClick={() => handleRatingSelect(star)}
            style={{ cursor: "pointer", marginRight: 8 }}
          />
        ))}
      </div>

      {/* Feedback only for 1–3 rating */}
      {rating > 0 && rating <= 3 && (
        <>
          <textarea
            placeholder="Share details of your experience"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: "100%",
              minHeight: 130,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "12px 0",
              marginTop: 20,
              background: "#000",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Post
          </button>
        </>
      )}
    </div>
  );
}
