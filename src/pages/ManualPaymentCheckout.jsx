import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Spinner } from "react-bootstrap";
import { getRequest, putRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS } from "../ApiService/apiConstants";

function ManualPaymentCheckout() {
  const { bookingId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchManualPayment = async () => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${API_ENDPOINTS.MANUAL_PAYMENT}/${bookingId}`
      );
      if (res?.success) {
        setPayment(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch manual payment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManualPayment();
  }, [bookingId]);

  const handlePay = async () => {
    try {
      setLoading(true);

      // Generate providerRef like "manual-pay-20260112T174530Z" (ISO format without colons)
      const now = new Date();
      const providerRef = `manual-pay-${now
        .toISOString()
        .replace(/[:.]/g, "")}`;

      await putRequest(
        `${API_ENDPOINTS.MARK_MANUAL_PAYMENT_PAID}/${payment._id}`,
        {
          method: "UPI", // method is always UPI here
          providerRef, // pass the generated providerRef
        }
      );

      alert("Payment Successful");

      // Update payment status in state, updating nested payment object properly
      setPayment({
        ...payment,
        payment: {
          ...payment.payment,
          status: "Paid",
          method: "UPI",
          providerRef, // update state with the generated providerRef
          paidAt: now.toISOString(),
        },
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !payment) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100vw",
        height: "90vh",
        padding: "1rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <Card
        className="shadow-sm"
        style={{ width: "100%", maxWidth: 500, borderRadius: "12px" }}
      >
        <Card.Body>
          <h6 className="fw-bold mb-4 text-center">Payment Details</h6>

          <div className="mb-2 fs-6">
            <strong>Name:</strong> {payment.name}
          </div>

          <div className="mb-2  ds-2 text-muted">
            📞 <strong>Phone:</strong> {payment.phone}
          </div>

          <div className="mb-2 ds-2">
            <strong>Service:</strong> {payment.service}
          </div>

          <div className="mb-2 ds-2">
            <strong>City:</strong> {payment.city}
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>
              <strong>Amount to Pay:</strong>
            </span>
            <span className="fs-5 fw-bold">₹ {payment.amount}</span>
          </div>

          <div className="mb-3">
            <strong>Status:</strong>{" "}
            <span
              className={
                payment.payment.status.toLowerCase() === "paid"
                  ? "text-success"
                  : payment.payment.status.toLowerCase() === "pending"
                  ? "text-warning"
                  : "text-danger"
              }
            >
              {payment.payment.status}
            </span>
          </div>

          <Button
            className="w-100"
            disabled={
              loading || payment.payment.status.toLowerCase() === "paid"
            }
            onClick={handlePay}
          >
            {payment.payment.status.toLowerCase() === "paid"
              ? "Paid ✅"
              : "Pay Now"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ManualPaymentCheckout;
