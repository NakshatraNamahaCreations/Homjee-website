import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
import { Modal } from "react-bootstrap";

export default function VendorRatings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [isResLoading, setIsResLoading] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const query = new URLSearchParams(location.search);
  const vendorId = query.get("vendorId");
  const bookingId = query.get("bookingId");
  const customerId = query.get("customerId");
  const vendorName = query.get("vendorName") || "Vendor";
  const vendorPhoto =
    // "https://idaindia.org.in/wp-content/uploads/2022/08/indian-testimonial-pranav-img-02-v01.png";
    query.get("vendorPhoto"); // optional

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isRatingLocked, setIsRatingLocked] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  console.log("customerId", customerId);

  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.GET_VENDOR_RATING_BY_ID}?vendorId=${vendorId}&bookingId=${bookingId}&customerId=${customerId}`
        );

        if (res.data?.isLocked) {
          setExistingRating(res.data);
          setIsRatingLocked(true);
        }
      } catch (err) {
        console.log("No previous rating", err);
      }
    }

    fetchRating();
  }, []);

  const handleSubmit = async (ratingValue) => {
    // prefer passed ratingValue, otherwise fallback to state
    const effectiveRating =
      typeof ratingValue === "number" ? ratingValue : rating;

    if (!effectiveRating || effectiveRating === 0) {
      setMessageType("warning");
      setShowMessage("Please select a rating");
      setShowCustomPopup(true);
      return { success: false };
    }

    // if 1-3 stars require feedback
    if (effectiveRating <= 3 && (!feedback || feedback.trim().length === 0)) {
      setMessageType("warning");
      setShowMessage("Please add feedback for ratings below 4 stars.");
      setShowCustomPopup(true);
      return { success: false };
    }

    try {
      setIsResLoading(true);

      const payload = {
        vendorId,
        bookingId,
        customerId,
        rating: effectiveRating,
        // For 4-5 we can send empty string for feedback (server handles)
        feedback: effectiveRating >= 4 ? "" : (feedback || "").trim(),
      };

      const res = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.WRITE_VENDOR_RATING}`,
        payload
      );

      // success handling based on server response
      if (res.data && res.data.success) {
        // lock UI locally
        setIsRatingLocked(true);
        // make sure UI shows the rating we just submitted
        setRating(effectiveRating);

        // If server instructs redirect (for 4-5 stars), handle it
        if (res.data.redirect) {
          // optional: small delay to show message
          setMessageType("success");
          // setShowMessage("Thanks!");
          setShowCustomPopup(true);

          // Use the official Google review link (or from server)
          const googleUrl =
            res.data.googleUrl || "https://business.google.com/reviews";
          // slight delay so user sees toast (optional)
          setTimeout(() => {
            window.location.href = googleUrl;
          }, 600);
          return { success: true, redirected: true };
        }

        // normal 1-3 flow
        setMessageType("success");
        setShowMessage("Your feedback is submitted.");
        setShowCustomPopup(true);

        return { success: true };
      } else {
        // If server returned success:false with message
        setMessageType("warning");
        setShowMessage(res.data?.message || "Something went wrong. Try again.");
        setShowCustomPopup(true);
        return { success: false };
      }
    } catch (error) {
      console.error("Error while submitting rating:", error);

      // if API returned 4xx with useful message, show it
      const serverMsg =
        error?.response?.data?.message || error?.response?.data || null;

      setMessageType("warning");
      setShowMessage(serverMsg || "Something went wrong! Try again...");
      setShowCustomPopup(true);

      return { success: false };
    } finally {
      setIsResLoading(false);
    }
  };

  // handleRatingSelect: pass value to handleSubmit to avoid stale state
  const handleRatingSelect = async (value) => {
    if (isRatingLocked || isResLoading) return;

    // set rating in UI (optimistic)
    setRating(value);

    // If 4-5 stars, auto-save + redirect — pass value to submit
    if (value >= 4) {
      const result = await handleSubmit(value);

      // if server didn't redirect but returned success, you can still redirect
      // (server ideally returns redirect:true)
      if (result.success && !result.redirected) {
        // fallback redirect
        window.location.href = "https://business.google.com/reviews";
      }
      return;
    }

    // For 1-3 stars: just set rating and let user add feedback then press Post
    // (we don't auto-submit here)
    setRating(value);
  };

  const decideToNavigate = () => {
    if (messageType === "success") {
      return () => navigate("/");
    } else {
      return () => setShowCustomPopup(false);
    }
  };

  return (
    <>
      <div style={{ padding: 20 }}>
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
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
        >
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
        {!isRatingLocked && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 25,
              pointerEvents: "auto",
            }}
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
        )}
        {rating > 0 && rating <= 3 && !isRatingLocked && (
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
              disabled={isResLoading}
              style={{
                width: "100%",
                padding: "12px 0",
                marginTop: 20,
                background: isResLoading ? "#666" : "#000",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                cursor: isResLoading ? "not-allowed" : "pointer",
                fontSize: 16,
              }}
            >
              {isResLoading ? "Posting..." : "Post"}
            </button>
          </>
        )}
        {isRatingLocked && existingRating && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <h4>Your Rating</h4>

            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={32}
                color={existingRating.rating >= star ? "#f4b400" : "#ccc"}
              />
            ))}

            {existingRating.rating <= 3 && existingRating.feedback && (
              <>
                <h5 style={{ marginTop: 15 }}>Your Feedback</h5>
                <p>{existingRating.feedback}</p>
              </>
            )}
          </div>
        )}
      </div>
      <Modal
        show={showCustomPopup}
        onHide={() => setShowCustomPopup(false)}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="payment-modal"
      >
        <div className="modal-content text-center p-3">
          <div
            className="my-2"
            style={{ color: "#000000bf", fontSize: "20px", fontWeight: 600 }}
          >
            {messageType === "success" ? "Thank you!" : "Warning"}
          </div>
          <p style={{ color: "#000000bf", fontSize: "16px" }}> {showMessage}</p>
          <div className="d-flex justify-content-center align-items-center">
            <button
              onClick={decideToNavigate()}
              className="btn btn-primary px-4"
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
