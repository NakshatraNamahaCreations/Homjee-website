import moment from "moment";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import SuccessImage from "../assets/ecommerce.png";
import pdfImage from "../assets/pdf.png";

function PaymentSuccessModal({ show, bookingData, paidAmount, onClose }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // console.log("paidAmount", paidAmount);

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="payment-modal"
    >
      <div className="modal-content position-relative">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
              color: "black",
            }}
            onClick={() => window.location.reload()}
            // onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            className="mt-3"
            src={SuccessImage}
            style={{ width: 90, marginBottom: 15 }}
            alt="success"
          />
        </div>

        <h4 className="fw-bold text-center">Payment Successful!</h4>
        <p
          style={{ color: "#000000bf", fontSize: "15px", textAlign: "center" }}
        >
          Payment successful! Your transaction has been processed smoothly.
        </p>
        <div
          style={{ color: "#000000bf", fontSize: "12px", textAlign: "center" }}
        >
          Amount
        </div>
        <div
          className="mb-2"
          style={{
            color: "#000000",
            fontSize: "25px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ₹ {paidAmount || 0}
        </div>

        <div className="text-muted small text-center mb-3">
          {moment().format("DD-MM-YYYY")} • Booking ID:{" "}
          {bookingData?.bookingDetails?.booking_id}
        </div>

        {/* Scallop bottom */}
        <div className="scallop text-center pb-3">
          <button
            className="px-4"
            style={{
              border: "1px solid #dfdfdf",
              backgroundColor: "transparent",
              color: "black",
              fontSize: "12px",
              borderRadius: 5,
            }}
            // onClick={() => window.location.reload()}
          >
            <img src={pdfImage} style={{ width: 17, height: 17 }} /> Download
          </button>
          {/* <button
            className="btn btn-primary px-4"
            onClick={() => window.location.reload()}
          >
            Done
          </button> */}
        </div>
      </div>
    </Modal>
  );
}

export default PaymentSuccessModal;
