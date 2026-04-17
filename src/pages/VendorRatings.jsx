import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoStarSharp } from "react-icons/io5";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
import { Modal } from "react-bootstrap";
import GlobalLoader from "../utils/GlobalLoader";

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
  const [loading, setLoading] = useState(false);

  console.log("customerId", customerId);

  useEffect(() => {
    async function fetchRating() {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
    // if (effectiveRating <= 3 && (!feedback || feedback.trim().length === 0)) {
    //   setMessageType("warning");
    //   setShowMessage("Please add feedback for ratings below 4 stars.");
    //   setShowCustomPopup(true);
    //   return { success: false };
    // }

    try {
      setIsResLoading(true);
      setLoading(true);
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
          // setMessageType("success");
          // setShowMessage("Thanks!");
          // setShowCustomPopup(true);

          // Use the official Google review link (or from server)
          const googleUrl =
            res.data.googleUrl || "https://g.page/r/CbCGCiPVza_2EBE/review";
          // slight delay so user sees toast (optional)
          setTimeout(() => {
            window.location.href = googleUrl;
          }, 500);
          return { success: true, redirected: true };
        }

        // normal 1-3 flow
        setMessageType("success");
        navigate("/");
        // setShowMessage("Your feedback is submitted.");
        // setShowCustomPopup(true);

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
      setLoading(false);
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
        window.location.href = "https://g.page/r/CbCGCiPVza_2EBE/review";
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
      {loading && <GlobalLoader />}
      <div
        style={{
          color: "white",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        {/* Back Arrow */}
        <h2
          style={{
            // fontFamily: "Google Sans, Roboto, Arial, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: "24px",
            color: "#0c0c0cff",
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            margin: "auto 0",
            height: "68px",
          }}
          onClick={() => navigate("/")}
        >
          Homjee
        </h2>

        {/* Vendor Info */}
        <div
          className="d-flex"
          style={{
            // paddingTop: "16px",
            paddingLeft: "32px",
            paddingRight: "32px",
            // position: "relative",
          }}
        >
          <img
            src={
              vendorPhoto ||
              "https://idaindia.org.in/wp-content/uploads/2022/08/indian-testimonial-pranav-img-02-v01.png"
            }
            alt="vendor"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 10,
              display: "inline-block",
            }}
          />
          <div>
            <div
              style={{
                // fontFamily: "Roboto, Arial, sans-serif",
                fontSize: "20px",
                fontWeight: 400,
                letterSpacing: 0,
                lineHeight: "26px",
                color: "#1a1a1aff",
                overflow: "hidden",
                textAlign: "left",
                textOverflow: "ellipsis",
              }}
            >
              {vendorName}
            </div>
            <div
              style={{
                color: "#e9e9e9ff",
                marginTop: 3,
                color: "#1f1f1f",
                fontSize: 14,
                lineHeight: "18px",
                fontWeight: 400,
                color: "#1a1a1aff",
              }}
            >
              Posting publicly across Homjee
            </div>
          </div>
        </div>
        {/* select star */}
        {!isRatingLocked && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 25,
              pointerEvents: "auto",
              marginTop: "20px",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <IoStarSharp
                key={star}
                size={48}
                color={rating >= star ? "#f4b400" : "#e4e5e9"}
                onClick={() => handleRatingSelect(star)}
                style={{ cursor: "pointer", marginRight: 8 }}
              />
            ))}
          </div>
        )}
        {/* feed back text area */}
        {rating > 0 && rating <= 3 && !isRatingLocked && (
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
        )}
        {/* button to post */}
        {rating > 0 && rating <= 3 && !isRatingLocked && (
          <button
            onClick={handleSubmit}
            disabled={
              isRatingLocked || isResLoading || rating === 0 || rating > 3
              //  || (rating <= 3 && feedback.trim() === "")
            }
            style={{
              width: "100%",
              padding: "12px 0",
              marginTop: 20,
              background:
                !isRatingLocked && !isResLoading && rating > 0 && rating <= 3
                  ? // && feedback.trim() !== ""
                    "#8ab4f8"
                  : "#666",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor:
                isRatingLocked || isResLoading || rating === 0 || rating > 3
                  ? // || (rating <= 3 && feedback.trim() === "")
                    "not-allowed"
                  : "pointer",
              fontSize: 16,
              opacity: isRatingLocked ? 0.5 : 1,
            }}
          >
            {isResLoading ? "Posting..." : "Post"}
          </button>
        )}
        {isRatingLocked && existingRating && (
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <h4 style={{ color: "#1f1f1f" }}>Your Rating</h4>

            {[1, 2, 3, 4, 5].map((star) => (
              <IoStarSharp
                key={star}
                size={48}
                color={existingRating.rating >= star ? "#f4b400" : "#ccc"}
              />
            ))}

            {existingRating.rating <= 3 && existingRating.feedback && (
              <>
                <h5 style={{ marginTop: 15, color: "#1f1f1f" }}>
                  Your Feedback
                </h5>
                <p style={{ color: "#1f1f1f" }}>{existingRating.feedback}</p>
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
