import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiPhone, FiMapPin, FiCheckCircle, FiClock } from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { PiPaintBrushHousehold } from "react-icons/pi";
import { BiRupee } from "react-icons/bi";
import { getRequest, postRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS } from "../ApiService/apiConstants";
import GlobalLoader from "../utils/GlobalLoader";
import { MdCleaningServices } from "react-icons/md";
import moment from "moment";
import { FaUser } from "react-icons/fa";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import "./payment-checkout.css";
import { Modal } from "react-bootstrap";

const avatarSrc = "/mnt/data/WhatsApp Image 2025-11-25 at 4.53.03 PM.jpeg";

function PaymentCheckout() {
  const { bookingId, date, type } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isResLoading, setIsResLoading] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);

  const fetchBookingDetails = async () => {
    if (!bookingId) {
      setIsPageLoading(false);
      alert("Booking ID is missing in the URL.");
      return;
    }
    setIsPageLoading(true);
    try {
      const response = await getRequest(
        `${API_ENDPOINTS.GET_BOOKINGS_BY_BOOKING_ID}${bookingId}`
      );
      // console.log("response", response);
      if (response && response.booking) {
        setBookingData(response.booking);
      } else {
        // Handle case: booking not found or bad response
        setBookingData(null);
        // Optionally show error message to user
        // setError("Booking not found");
      }
    } catch (error) {
      console.error("GET error:", error || error);
      setBookingData(null);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  console.log("Booking Data:", bookingData?.bookingDetails);

  const approvePrice = async (approvedBy = "customer") => {
    // const confirmed = window.confirm(
    //   "Are you sure you want to approve this price change?"
    // );
    // if (!confirmed) return;

    try {
      setIsResLoading(true);

      const result = await postRequest(
        `${API_ENDPOINTS.APPROVE_PRICING}${bookingId}`,
        { approvedBy }
      );

      // Custom success alert (replace with your own toast/snackbar)
      alert("Price has been approved successfully.");
      window.location.reload();
      // await fetchBookingDetails();
    } catch (error) {
      console.error("Error approving price:", error);
      alert("Failed to approve price. Please try again.");
    } finally {
      setIsResLoading(false);
    }
  };

  const rejectPrice = async (approvedBy = "customer") => {
    try {
      setIsResLoading(true);

      const result = await postRequest(
        `${API_ENDPOINTS.REJECT_PRICING}${bookingId}`,
        { approvedBy }
      );
      alert("Price has been rejected.");
      window.location.reload();
      // await fetchBookingDetails();
    } catch (error) {
      console.error("Error rejecting price:", error);
      alert("Failed to rejecting price. Please try again.");
    } finally {
      setIsResLoading(false);
    }
  };

  const getPopupTitle = () => {
    if (popupType === "accept") return "Accept the Price";
    if (popupType === "reject") return "Reject the Price";
    if (popupType === "pay") return "Proceed to pay";
    return "";
  };

  const getPopupMessage = () => {
    if (popupType === "accept") return "Are you sure you want to accept?";
    if (popupType === "reject") return "Are you sure you want to reject?";
    if (popupType === "pay") return "Are you sure you want to pay?";
    return "";
  };

  const getPrimaryLabel = () => {
    if (popupType === "accept") return "Accept";
    if (popupType === "reject") return "Reject";
    if (popupType === "pay") return "Pay";
    return "";
  };

  const handlePrimaryAction = async () => {
    try {
      if (popupType === "accept") {
        await approvePrice("customer");
      } else if (popupType === "reject") {
        await rejectPrice("customer");
      } else if (popupType === "pay") {
        await handleProceedToPay();
      }
    } finally {
      setShowCustomPopup(false);
    }
  };

  const professional =
    bookingData?.assignedProfessional ||
    {
      // name: "Loading...",
      // rating: "...",
      // phone: "...",
    };
  const address = bookingData?.address || {};
  const isPaymentLinkActive =
    bookingData?.bookingDetails?.paymentLink?.isActive;

  // ..............--- 💰 Payment Calculation Logic ---..............................
  const bd = bookingData?.bookingDetails ?? {};
  const currency = (n) => `₹ ${Number(n ?? 0).toLocaleString("en-IN")}`;

  const firstPaid = bd?.firstPayment?.status === "paid";
  const secondPaid = bd?.secondPayment?.status === "paid";
  const finalPaid = bd?.finalPayment?.status === "paid";
  let currentInstallmentLabel = "";
  let currentInstallmentAmount = 0;

  // which installment is vendor asking to pay now?
  if (!firstPaid) {
    currentInstallmentLabel = "1st Installment";
    currentInstallmentAmount = bd?.firstPayment?.amount || 0;
  } else if (!secondPaid) {
    currentInstallmentLabel = "Second Partial Payment";
    currentInstallmentAmount = bd?.secondPayment?.amount || 0;
  } else if (!finalPaid) {
    currentInstallmentLabel = "Final Installment";
    currentInstallmentAmount = bd?.finalPayment?.amount || 0;
  }

  const canShowPayNow =
    bd &&
    bd?.paymentLink?.isActive &&
    currentInstallmentAmount > 0 &&
    (bd?.status === "Project Ongoing" ||
      bd.status === "Waiting for final payment");

  const anyPaymentDone = firstPaid || secondPaid || finalPaid;

  const canPay =
    bd &&
    bd?.amountYetToPay > 0 &&
    isPaymentLinkActive &&
    (bd?.status === "Project Ongoing" ||
      bd?.status === "Waiting for final payment") &&
    // either there is a pending installment
    (bd?.secondPayment?.status === "pending" ||
      bd?.finalPayment?.status === "pending" ||
      // or vendor has requested a price change that user must act on
      bd?.priceUpdateRequestedToUser === true);

  const priceChanges = bd?.priceChanges || [];
  const latestChange = priceChanges[priceChanges.length - 1] || null;
  const isPending = !!latestChange && latestChange.status === "pending";

  const approvedChanges = priceChanges.filter((c) => c.status === "approved");
  const hasApprovedChange = approvedChanges.length > 0;
  // Only count cumulative delta for APPROVED changes
  const originalTotal = bd?.bookingAmount || bd?.originalTotalAmount || 0;
  const totalApprovedDelta = approvedChanges.reduce(
    (sum, c) =>
      sum +
      (c.scopeType === "Reduced"
        ? -(c.adjustmentAmount || 0)
        : c.adjustmentAmount || 0),
    0
  );
  const approvedTotal = originalTotal + totalApprovedDelta;

  // PENDING change info (not used in committed state!)
  const pendingDelta = isPending
    ? latestChange.scopeType === "Reduced"
      ? -(latestChange.adjustmentAmount || 0)
      : latestChange.adjustmentAmount || 0
    : 0;
  const pendingTotal = approvedTotal + pendingDelta;

  const displayPaymentSummary = () => {
    if (bd?.priceUpdateRequestedToUser) {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">
              {currency(bookingData?.bookingDetails?.finalTotal || 0)}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.paidAmount || 0}
            </span>
          </div>
          {/* <hr /> */}
          <div className="d-flex justify-content-between small mb-2">
            <span>Final Amount to be Paid</span>
            <span className="fw-semibold">
              {currency(bookingData?.bookingDetails?.amountYetToPay)}
            </span>
          </div>
        </>
      );
    } else if (hasApprovedChange) {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Old Total Amount</span>
            <span className="fw-semibold">
              {currency(bookingData?.bookingDetails?.finalTotal || 0)}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Change</span>
            <span className="fw-semibold text-success">
              {pendingDelta < 0 ? "-" : "+"} {currency(Math.abs(pendingDelta))}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>New Total Amount</span>
            <span className="fw-semibold">{currency(pendingTotal)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.paidAmount || 0}
            </span>
          </div>
          {/* <hr /> */}
          <div className="d-flex justify-content-between small mb-2">
            <span>Final Amount to be Paid</span>
            <span className="fw-semibold">
              {currency(bookingData?.bookingDetails?.amountYetToPay)}
            </span>
          </div>
        </>
      );
    } else if (bd?.firstPayment?.status === "paid") {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.finalTotal || 0}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.paidAmount || 0}
            </span>
          </div>
          {/* <div className="d-flex justify-content-between small mb-2">
                        <span>Booking Amount to be Paid</span>
                        <span className="fw-semibold">₹ {bookingData?.bookingDetails?.amountYetToPay || 0} </span>
                    </div> */}
        </>
      );
    } else {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.finalTotal || 0}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.paidAmount || 0}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Booking Amount to be Paid</span>
            <span className="fw-semibold">
              ₹ {bookingData?.bookingDetails?.amountYetToPay || 0}{" "}
            </span>
          </div>
        </>
      );
    }
  };

  const handleProceedToPay = async () => {
    const data = {
      bookingId: bookingId,
      paymentMethod: "UPI",
      paidAmount: currentInstallmentAmount || 0,
    };
    try {
      setIsResLoading(true);
      const result = await postRequest(API_ENDPOINTS.PROCEED_TO_PAY, data);
      console.log("Booking Success", result);
      setShowSuccessModal(true);
      await fetchBookingDetails();
      // alert("Booking successful");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsResLoading(false);
    }
  };

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      {isPageLoading || (isResLoading && <GlobalLoader />)}
      <div className="container py-3" style={{ maxWidth: 560 }}>
        {/* Booking Details */}
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Booking Details</h6>

            <div className="mb-3 d-flex align-items-center gap-2 text-muted">
              <FiPhone />
              <span className="small fw-semibold">
                {bookingData?.customer?.name}
                <div>{bookingData?.customer?.phone} </div>
              </span>
              <span className="small text-secondary">• Customer</span>
            </div>

            <div className="mb-3 d-flex align-items-center gap-2 text-muted">
              <FiMapPin />
              <span className="small">
                {address.houseFlatNumber}, {address.streetArea}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <div>
                <div className="small text-secondary">Service</div>
                <div className="fw-semibold small d-flex align-items-center gap-1 flex-wrap">
                  {bookingData?.service?.length > 0 &&
                  bookingData?.service?.[0]?.serviceName ===
                    "House Painters & Waterproofing" ? (
                    <PiPaintBrushHousehold />
                  ) : (
                    <MdCleaningServices />
                  )}{" "}
                  {bookingData?.service?.[0]?.serviceName || "-"}
                </div>
                <div className="small text-secondary">Status</div>
                <div className="text-primary small fw-semibold">
                  {bookingData?.bookingDetails?.status || "-"}
                </div>
              </div>

              <div className="text-end">
                <div className="small text-secondary">Date</div>
                <div className="small fw-semibold">
                  {moment(bookingData?.selectedSlot?.slotDate).format(
                    "DD-MM-YYYY"
                  ) || "-"}
                </div>
                <div className="small">
                  {bookingData?.selectedSlot?.slotTime || "-"}
                </div>
              </div>

              {/* <div className="text-end">
                                <div className="small text-secondary">Payable</div>
                                <div className="fw-semibold small d-flex align-items-center justify-content-end">
                                    <BiRupee />
                                    {bookingData?.bookingDetails?.finalTotal}
                                </div>
                                <div className="small text-secondary">view &gt;</div>
                            </div> */}
            </div>

            {/* Green info box */}
            <div className="p-3 rounded bg-success bg-opacity-10 d-flex gap-2">
              <FiCheckCircle className="text-success mt-1" />
              <p className="small mb-0 text-muted">
                Charges may change based on final scope. Adjustments may update
                the total cost.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Payment Summary</h6>
            {displayPaymentSummary()}
            {/* <hr /> */}
            {bd?.priceUpdateRequestedToUser && (
              <div className="mb-3">
                <div
                  // className="fw-semibold"
                  style={{ fontSize: 14, color: "#3e4045" }}
                >
                  <span className="pulse-wrapper">
                    <span className="status-dot"></span>
                  </span>{" "}
                  Scope change required and additional +₹
                  {latestChange.adjustmentAmount} Please approve/reject this
                  addition.
                </div>

                <div className="d-flex gap-2 mt-4">
                  <div
                    onClick={() => {
                      setPopupType("reject");
                      setShowCustomPopup(true);
                    }}
                    style={{ backgroundColor: "transparent" }}
                    className=" d-flex align-items-center small gap-1"
                  >
                    <MdOutlineClose style={{ color: "red", fontSize: 17 }} />{" "}
                    Reject
                  </div>
                  <div
                    onClick={() => {
                      setPopupType("accept");
                      setShowCustomPopup(true);
                    }}
                    style={{ backgroundColor: "transparent" }}
                    className="d-flex align-items-center small gap-1 ms-2"
                  >
                    <FaCheck style={{ color: "green", fontSize: 16 }} /> Accept
                  </div>
                </div>
              </div>
            )}
            {canShowPayNow && (
              <div className="mt-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-primary">
                    {currentInstallmentLabel}
                  </div>
                  <div className="fw-semibold">
                    {" "}
                    {currency(currentInstallmentAmount)}{" "}
                  </div>
                </div>
                <button
                  className="btn btn-primary px-4"
                  onClick={() => {
                    setPopupType("pay");
                    setShowCustomPopup(true);
                  }}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
        {/* vendor price update */}

        {/* Professional Assigned */}
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Professional Assigned</h6>

            <div className="d-flex align-items-center gap-3">
              <FaUser style={{ width: 30, height: 30, objectFit: "cover" }} />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{professional.name}</div>
                    <div className="small text-warning">
                      ★ ({professional.rating || 0})
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      onClick={() => {
                        setPopupType("pay");
                        setShowCustomPopup(true);
                      }}
                      className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    >
                      <FiPhone /> Call
                    </button>
                    {/* <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                                            <AiOutlineMessage /> Chat
                                        </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tips Section */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Our professionals work hard</h6>

            <p className="small text-muted">
              Your small gestures make a difference:
            </p>

            <ul className="list-unstyled small text-muted">
              <li className="mb-2 d-flex gap-2">
                <span>🙂</span> Greet them with a friendly smile
              </li>
              <li className="mb-2 d-flex gap-2">
                <span>💧</span> Offer water
              </li>
              <li className="mb-2 d-flex gap-2">
                <span>🚻</span> Ensure washroom access
              </li>
            </ul>
          </div>
        </div>

        {/* Route params for debug */}
        {/* <div className="text-center text-muted small mt-3">
                    User ID: {userId} • Booking ID: {bookingId} • Date: {date}
                </div> */}
      </div>
      <PaymentSuccessModal
        show={showSuccessModal}
        bookingData={bookingData}
        onClose={() => setShowSuccessModal(false)}
      />
      <Modal
        show={showCustomPopup}
        onHide={() => setShowCustomPopup(false)}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="payment-modal"
      >
        <div className="modal-content position-relative p-3">
          <div
            style={{
              textAlign: "center",
              color: "#000000bf",
              fontSize: "19px",
              fontWeight: 600,
            }}
          >
            {getPopupTitle()}
          </div>

          <div
            className="my-2"
            style={{ color: "#000000bf", fontSize: "16px" }}
          >
            {getPopupMessage()}
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-secondary px-4"
              onClick={() => setShowCustomPopup(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary px-4"
              onClick={handlePrimaryAction}
              disabled={!popupType}
            >
              {getPrimaryLabel()}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PaymentCheckout;
