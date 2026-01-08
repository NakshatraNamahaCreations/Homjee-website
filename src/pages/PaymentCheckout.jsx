// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FiPhone, FiMapPin, FiCheckCircle, FiClock } from "react-icons/fi";
// import { AiOutlineMessage } from "react-icons/ai";
// import { PiPaintBrushHousehold } from "react-icons/pi";
// import { BiRupee } from "react-icons/bi";
// import { getRequest, postRequest } from "../ApiService/apiHelper";
// import { API_ENDPOINTS } from "../ApiService/apiConstants";
// import GlobalLoader from "../utils/GlobalLoader";
// import { MdCleaningServices } from "react-icons/md";
// import moment from "moment";
// import { FaUser } from "react-icons/fa";
// import PaymentSuccessModal from "./PaymentSuccessModal";
// import { FaCheck } from "react-icons/fa6";
// import { MdOutlineClose } from "react-icons/md";
// import { GoDotFill } from "react-icons/go";
// import "./payment-checkout.css";
// import { Modal } from "react-bootstrap";

// const avatarSrc = "/mnt/data/WhatsApp Image 2025-11-25 at 4.53.03 PM.jpeg";

// function PaymentCheckout() {
//   const { bookingId, date, type } = useParams();
//   const [isPageLoading, setIsPageLoading] = useState(false);
//   const [bookingData, setBookingData] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isResLoading, setIsResLoading] = useState(false);
//   const [showCustomPopup, setShowCustomPopup] = useState(false);
//   const [popupType, setPopupType] = useState(null);
//   const [payAmount, setPayAmount] = useState(0);

//   const fetchBookingDetails = async () => {
//     if (!bookingId) {
//       setIsPageLoading(false);
//       alert("Booking ID is missing in the URL.");
//       return;
//     }
//     setIsPageLoading(true);
//     try {
//       const response = await getRequest(
//         `${API_ENDPOINTS.GET_BOOKINGS_BY_BOOKING_ID}${bookingId}`
//       );
//       // console.log("response", response);
//       if (response && response.booking) {
//         setBookingData(response.booking);
//       } else {
//         // Handle case: booking not found or bad response
//         setBookingData(null);
//         // Optionally show error message to user
//         // setError("Booking not found");
//       }
//     } catch (error) {
//       console.error("GET error:", error || error);
//       setBookingData(null);
//     } finally {
//       setIsPageLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (bookingId) {
//       fetchBookingDetails();
//     }
//   }, [bookingId]);

//   console.log("Booking Data:", bookingData?.bookingDetails);

//   const approvePrice = async (approvedBy = "customer") => {
//     // const confirmed = window.confirm(
//     //   "Are you sure you want to approve this price change?"
//     // );
//     // if (!confirmed) return;

//     try {
//       setIsResLoading(true);

//       const result = await postRequest(
//         `${API_ENDPOINTS.APPROVE_PRICING}${bookingId}`,
//         { approvedBy }
//       );

//       // Custom success alert (replace with your own toast/snackbar)
//       // alert("Price has been approved successfully.");
//       window.location.reload();
//       // await fetchBookingDetails();
//     } catch (error) {
//       console.error("Error approving price:", error);
//       // alert("Failed to approve price. Please try again.");
//     } finally {
//       setIsResLoading(false);
//     }
//   };

//   const rejectPrice = async (approvedBy = "customer") => {
//     try {
//       setIsResLoading(true);

//       const result = await postRequest(
//         `${API_ENDPOINTS.REJECT_PRICING}${bookingId}`,
//         { approvedBy }
//       );
//       // alert("Price has been rejected.");
//       window.location.reload();
//       // await fetchBookingDetails();
//     } catch (error) {
//       console.error("Error rejecting price:", error);
//       // alert("Failed to rejecting price. Please try again.");
//     } finally {
//       setIsResLoading(false);
//     }
//   };

//   const CancelBooking = async () => {
//     setIsResLoading(true);
//     try {
//       const formData = {
//         bookingId: bookingData._id,
//         status: "Cancelled",
//       };
//       const result = await postRequest(API_ENDPOINTS.CANCEL_BOOKING, formData);
//       await fetchBookingDetails();
//       console.log("result", result);
//     } catch (error) {
//       console.log("Error while updating status:", error);
//     } finally {
//       setIsResLoading(false);
//     }
//   };

//   const getPopupTitle = () => {
//     if (popupType === "accept") return "Accept the Price";
//     if (popupType === "reject") return "Reject the Price";
//     if (popupType === "pay") return "Proceed to pay";
//     if (popupType === "cancel_booking") return "Cancel Booking";
//     return "";
//   };

//   const getPopupMessage = () => {
//     if (popupType === "accept") return "Are you sure you want to accept?";
//     if (popupType === "reject") return "Are you sure you want to reject?";
//     if (popupType === "pay") return "Are you sure you want to pay?";
//     if (popupType === "cancel_booking")
//       // return "Are you sure you want to Cancel Booking?";
//       return "Free cancellation up to 3 hours before your booking. If cancelled within 3 hours, no refund is provided. This amount goes directly to our service teams to cover their lost time, as we blocked this slot exclusively for you.";
//     return "";
//   };

//   const getPrimaryLabel = () => {
//     if (popupType === "accept") return "Accept";
//     if (popupType === "reject") return "Reject";
//     if (popupType === "pay") return "Pay";
//     if (popupType === "cancel_booking") return "Yes, Cancel";
//     return "";
//   };

//   const handlePrimaryAction = async () => {
//     try {
//       if (popupType === "accept") {
//         await approvePrice("customer");
//       } else if (popupType === "reject") {
//         await rejectPrice("customer");
//       } else if (popupType === "pay") {
//         if (bookingData?.isEnquiry) {
//           await payAndConvertEnquiryToLead();
//         } else {
//           await handleProceedToPay();
//         }
//       } else if (popupType === "cancel_booking") {
//         await CancelBooking();

//         // await handleProceedToPay();
//       }
//     } finally {
//       setShowCustomPopup(false);
//     }
//   };

//   const professional =
//     bookingData?.assignedProfessional ||
//     {
//       // name: "Loading...",
//       // rating: "...",
//       // phone: "...",
//     };
//   const address = bookingData?.address || {};

//   console.log("Bookd data Full Context>>", bookingData);

//   // ..............--- 💰 Payment Calculation Logic ---..............................
//   const bd = bookingData?.bookingDetails ?? {};
//   const installmentRequested = bd?.paymentLink?.installment; // "second" | "final" | undefined
//   const currency = (n) => `₹ ${Number(n ?? 0).toLocaleString("en-IN")}`;
//   const category = bookingData?.service?.[0]?.category;

//   let currentInstallmentLabel = "";
//   let currentInstallmentAmount = 0;

//   // Installment status
//   const firstPaid = bd?.firstPayment?.status === "paid";
//   const secondPaid = bd?.secondPayment?.status === "paid";
//   const finalPaid = bd?.finalPayment?.status === "paid";

//   // which installment is vendor asking to pay now?
//   // PRIORITY 1: Enquiry Payment Flow (always override)
//   if (bookingData?.isEnquiry && bd.paymentStatus === "Unpaid") {
//     if (category === "House Painting") {
//       currentInstallmentLabel = "Site Visit Charges";
//       currentInstallmentAmount = bd?.siteVisitCharges || 0;
//     } else if (category === "Deep Cleaning") {
//       currentInstallmentLabel = "First Partial Payment";
//       currentInstallmentAmount = bd?.bookingAmount || 0;
//     }
//   }
//   // PRIORITY 2: Deep Cleaning installments
//   // Deep Cleaning → only first + final
//   else if (category === "Deep Cleaning") {
//     if (!firstPaid) {
//       currentInstallmentLabel = "First Partial Payment";
//       currentInstallmentAmount = bd?.firstPayment?.amount || 0;
//     } else if (!finalPaid) {
//       currentInstallmentLabel = "Final Payment";
//       currentInstallmentAmount = bd?.finalPayment?.amount || 0;
//     }
//   }
//   // PRIORITY 3: House Painting installments
//   // House Painting → first + second + final
//   else if (category === "House Painting") {
//     if (!firstPaid) {
//       currentInstallmentLabel = "First Partial Payment";
//       currentInstallmentAmount = bd?.firstPayment?.amount || 0;
//     } else if (!secondPaid) {
//       currentInstallmentLabel = "Second Partial Payment";
//       currentInstallmentAmount = bd?.secondPayment?.amount || 0;
//     } else if (!finalPaid) {
//       currentInstallmentLabel = "Final Payment";
//       currentInstallmentAmount = bd?.finalPayment?.amount || 0;
//     }
//   }

//   const canShowPayNow =
//     bd &&
//     bd?.paymentLink?.isActive &&
//     currentInstallmentAmount > 0 &&
//     (bd.status === "Pending Hiring" ||
//       bd?.status === "Project Ongoing" ||
//       bd.status === "Waiting for final payment");

//   // 1. All price changes
//   const priceChanges = bd?.priceChanges || [];
//   const latestChange = priceChanges[priceChanges.length - 1] || null;
//   const isPendingChange = !!latestChange && latestChange.status === "pending";

//   // 2. Only APPROVED changes
//   const approvedChanges = priceChanges.filter((c) => c.status === "approved");
//   const hasApprovedChange = approvedChanges.length > 0;

//   // 3. Original committed total before any changes
//   // const originalTotal = bd?.finalTotal || bd?.bookingAmount || 0;
//   const originalTotal = bd?.originalTotalAmount || bd?.bookingAmount || 0;

//   // 4. Net approved delta (add = +, reduced = -)
//   // const totalApprovedDelta = approvedChanges.reduce(
//   //   (sum, c) =>
//   //     sum +
//   //     (c.scopeType === "Reduced"
//   //       ? -(c.adjustmentAmount || 0)
//   //       : c.adjustmentAmount || 0),
//   //   0
//   // );
//   const totalApprovedDelta = approvedChanges.reduce((sum, c) => {
//     const delta = c.adjustmentAmount || 0;
//     return sum + (c.scopeType === "Reduced" ? -delta : delta);
//   }, 0);

//   // 5. Current committed total (should equal bd.finalTotal)
//   const approvedTotal = originalTotal + totalApprovedDelta;

//   // ₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹ DISPLAYING THE PAYMENT SUMMARY ₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹
//   const displayPaymentSummary = () => {
//     // 1) Pending - price updated(added) that user must approve/reject
//     if (bd?.priceUpdateRequestedToUser && isPendingChange) {
//       const pendingDelta =
//         latestChange.scopeType === "Reduced"
//           ? -(latestChange.adjustmentAmount || 0)
//           : latestChange.adjustmentAmount || 0;
//       const pendingTotal = approvedTotal + pendingDelta;

//       return (
//         <>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Total Amount</span>
//             <span className="fw-semibold">
//               {" "}
//               {currency(approvedTotal || bd?.finalTotal || 0)}
//             </span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Paid1</span>
//             <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Yet to be Paid</span>
//             <span className="fw-semibold">
//               {currency(bd?.amountYetToPay || 0)}
//             </span>
//           </div>
//           {/* <div className="small mt-2">
//             Scope change required and additional{" "}
//             <span className="fw-semibold">
//               {pendingDelta < 0 ? "- " : "+ "}
//               {currency(Math.abs(pendingDelta))}
//             </span>
//             . Please approve/reject this addition.
//           </div> */}
//         </>
//       );
//     }

//     // 2) Price update already approved: show old vs change vs new
//     if (hasApprovedChange && !isPendingChange) {
//       // latest approved change
//       const latestApproved = approvedChanges[approvedChanges.length - 1];
//       // const changeDelta =
//       //   latestApproved.scopeType === "Reduced"
//       //     ? -(latestApproved.adjustmentAmount || 0)
//       //     : latestApproved.adjustmentAmount || 0;

//       // const oldTotal = approvedTotal - changeDelta; // previous total before last change
//       // const newTotal = approvedTotal;

//       const oldTotal = originalTotal;
//       const changeDelta = totalApprovedDelta;
//       const newTotal = approvedTotal; // should match bd.finalTotal

//       return (
//         <>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Old Total Amount</span>
//             <span className="fw-semibold">{currency(oldTotal)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Change</span>
//             <span
//               className={`fw-semibold ${
//                 changeDelta < 0 ? "text-danger" : "text-success"
//               }`}
//             >
//               {changeDelta < 0 ? "- " : "+ "}
//               {currency(Math.abs(changeDelta))}
//             </span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>New Total Amount</span>
//             <span className="fw-semibold">{currency(newTotal)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Paid2</span>
//             <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//           </div>
//           {bd?.amountYetToPay !== 0 && bd.status !== "Project Completed" && (
//             <div className="d-flex justify-content-between small mb-2">
//               <span>Amount yet to be Paid</span>
//               <span className="fw-semibold">
//                 {currency(bd?.amountYetToPay || 0)}
//               </span>
//             </div>
//           )}
//         </>
//       );
//     }

//     // 3) Normal installment flow (no active price update)
//     // Case A: first installment pending (Pending Hiring)
//     if (!firstPaid) {
//       return (
//         <>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Total Amount</span>
//             <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Paid</span>
//             <span className="fw-semibold">{currency(0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Booking Amount to be Paid</span>
//             <span className="fw-semibold">
//               {currency(bd?.firstPayment?.amount || 0)}
//             </span>
//           </div>
//         </>
//       );
//     }

//     // Case B: first paid, second pending (second payment request)
//     if (firstPaid && !secondPaid && installmentRequested === "second") {
//       return (
//         <>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Total Amount</span>
//             <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Paid4</span>
//             <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Second Partial Amount to be Paid</span>
//             <span className="fw-semibold">
//               {currency(bd?.secondPayment?.amount || 0)}
//             </span>
//           </div>
//         </>
//       );
//     }

//     // Case C: first + second paid, final pending (final payment request)
//     if (
//       firstPaid &&
//       secondPaid &&
//       !finalPaid &&
//       installmentRequested === "final"
//     ) {
//       return (
//         <>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Total Amount</span>
//             <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Paid5</span>
//             <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Final Amount to be Paid</span>
//             <span className="fw-semibold">
//               {currency(bd?.finalPayment?.amount || 0)}
//             </span>
//           </div>
//         </>
//       );
//     }
//     // Case D: For the pending reduction you
//     if (bd?.priceUpdateRequestedToAdmin && isPendingChange) {
//       const pendingDelta =
//         latestChange.scopeType === "Reduced"
//           ? -(latestChange.adjustmentAmount || 0)
//           : latestChange.adjustmentAmount || 0;

//       const oldTotal = originalTotal;
//       const changeDelta = totalApprovedDelta;
//       const newTotal = approvedTotal; // should match bd.finalTotal

//       return (
//         <>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Old Total Amount</span>
//             <span className="fw-semibold">{currency(oldTotal)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Change</span>
//             <span
//               className={`fw-semibold ${
//                 changeDelta < 0 ? "text-danger" : "text-success"
//               }`}
//             >
//               {changeDelta < 0 ? "- " : "+ "}
//               {currency(Math.abs(changeDelta))}
//             </span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>New Total Amount</span>
//             <span className="fw-semibold">{currency(newTotal)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount Paid</span>
//             <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//           </div>
//           <div className="d-flex justify-content-between small mb-2">
//             <span>Amount yet to be Paid</span>
//             <span className="fw-semibold">
//               {currency(bd?.amountYetToPay || 0)}
//             </span>
//           </div>
//           <div className="small mt-2">
//             Scope change requested with{" "}
//             <span
//               className={
//                 pendingDelta < 0
//                   ? "text-danger fw-semibold"
//                   : "text-success fw-semibold"
//               }
//             >
//               {pendingDelta < 0 ? "- " : "+ "}
//               {currency(Math.abs(pendingDelta))}
//             </span>
//             . Please approve/reject this change.
//           </div>
//         </>
//       );

//       // return (
//       //   <>
//       //     <div className="d-flex justify-content-between small mb-2">
//       //       <span>Total Amount</span>
//       //       <span className="fw-semibold">{currency(committedTotal)}</span>
//       //     </div>
//       //     <div className="d-flex justify-content-between small mb-2">
//       //       <span>Amount Paid</span>
//       //       <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//       //     </div>
//       //     <div className="d-flex justify-content-between small mb-2">
//       //       <span>Amount Yet to be Paid</span>
//       //       <span className="fw-semibold">
//       //         {currency(bd?.amountYetToPay || 0)}
//       //       </span>
//       //     </div>
//       // <div className="small mt-2">
//       //   Scope change requested with{" "}
//       //   <span
//       //     className={
//       //       pendingDelta < 0
//       //         ? "text-danger fw-semibold"
//       //         : "text-success fw-semibold"
//       //     }
//       //   >
//       //     {pendingDelta < 0 ? "- " : "+ "}
//       //     {currency(Math.abs(pendingDelta))}
//       //   </span>
//       //   . Please approve/reject this change.
//       // </div>
//       //   </>
//       // );
//     }

//     // Case E: all installments paid – simple summary
//     return (
//       <>
//         <div className="d-flex justify-content-between small mb-2">
//           <span>Total Amount</span>
//           <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
//         </div>
//         <div className="d-flex justify-content-between small mb-2">
//           <span>Amount Paid</span>
//           <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
//         </div>
//         {category === "Deep Cleaning" &&
//           // bd.status === "Cancelled" &&
//           bd.refundAmount > 0 &&
//           bd.paymentStatus === "Refunded" && (
//             <div className="d-flex justify-content-between small mb-2">
//               <span>Amount Refunded</span>
//               <span className="fw-semibold">
//                 {currency(bd?.refundAmount || 0)}
//               </span>
//             </div>
//           )}
//       </>
//     );
//   };

//   const handleOpenPayPopup = () => {
//     // snapshot the amount at click time
//     setPayAmount(currentInstallmentAmount);
//     setPopupType("pay");
//     setShowCustomPopup(true);
//   };

//   const handleProceedToPay = async () => {
//     const data = {
//       bookingId,
//       paymentMethod: "UPI",
//       paidAmount: payAmount || 0,
//     };
//     try {
//       setIsResLoading(true);
//       const result = await postRequest(API_ENDPOINTS.PROCEED_TO_PAY, data);
//       console.log("Booking Success", result);
//       setShowSuccessModal(true);
//       await fetchBookingDetails();
//       // alert("Booking successful");
//     } catch (error) {
//       console.error("Booking failed:", error);
//     } finally {
//       setIsResLoading(false);
//     }
//   };

//   const payAndConvertEnquiryToLead = async () => {
//     const data = {
//       bookingId,
//       paymentMethod: "UPI",
//       paidAmount: payAmount || 0,
//     };
//     try {
//       setIsResLoading(true);
//       const result = await postRequest(
//         API_ENDPOINTS.PAY_AND_CONVERT_ENQUIRY_TO_LEAD,
//         data
//       );
//       console.log("Booking Success", result);
//       setShowSuccessModal(true);
//       await fetchBookingDetails();
//       // alert("Booking successful");
//     } catch (error) {
//       console.error("Booking failed:", error);
//     } finally {
//       setIsResLoading(false);
//     }
//   };

//   return (
//     <div className="bg-light" style={{ minHeight: "100vh" }}>
//       {isPageLoading || (isResLoading && <GlobalLoader />)}
//       <div className="container py-3" style={{ maxWidth: 560 }}>
//         {/* Booking Details */}
//         <div className="card shadow-sm mb-3">
//           <div className="card-body">
//             <h6 className="fw-bold mb-3">Booking Details</h6>

//             <div className="mb-3 d-flex align-items-center gap-2 text-muted">
//               <FiPhone />
//               <span className="small fw-semibold">
//                 {bookingData?.customer?.name}
//                 {/* <div> </div> */}
//               </span>
//               <span className="small text-secondary">
//                 • {bookingData?.customer?.phone}
//               </span>
//             </div>

//             <div className="mb-3 d-flex align-items-center gap-2 text-muted">
//               <span>
//                 <FiMapPin style={{ fontSize: 15 }} />
//               </span>
//               <span className="small">
//                 {address.houseFlatNumber}, {address.streetArea}
//               </span>
//             </div>
//             <div className="small flex-shrink-0" style={{ minWidth: "90px" }}>
//               <div className="text-secondary">Date</div>

//               <div className="fw-semibold">
//                 {bookingData?.selectedSlot?.slotDate
//                   ? moment(bookingData.selectedSlot.slotDate).format(
//                       "DD-MM-YYYY"
//                     )
//                   : "-"}
//               </div>

//               <div>{bookingData?.selectedSlot?.slotTime || "-"}</div>
//             </div>
//             <div className="mb-3 d-flex gap-3 booking-header-row">
//               <div className="flex-grow-1 min-w-0">
//                 <div className="small text-secondary mt-3">Service</div>
//                 {bookingData?.service?.[0]?.category === "House Painting" ? (
//                   /** HOUSE PAINTING UI **/
//                   <div className="fw-semibold small d-flex align-items-center gap-2 flex-wrap">
//                     <PiPaintBrushHousehold size={16} />

//                     <span className="text-truncate">
//                       {bookingData?.service?.[0]?.serviceName || "-"}
//                     </span>
//                   </div>
//                 ) : (
//                   /** DEEP CLEANING (MULTIPLE SERVICES) **/
//                   <div className="small">
//                     <div className="d-flex align-items-center gap-2 mb-1">
//                       <MdCleaningServices size={16} />
//                       <span className="fw-semibold ">
//                         {bookingData?.service?.[0]?.category}
//                       </span>
//                     </div>
//                     {bookingData?.service?.map((ele, idx) => (
//                       <div key={idx}>
//                         <div className="d-flex align-items-center gap-2 mb-1">
//                           <GoDotFill
//                             style={{ color: "#6c757d", fontSize: 10 }}
//                           />{" "}
//                           <div>
//                             <span>{ele.serviceName}</span>
//                             <div style={{ fontWeight: 600 }}>
//                               {currency(ele.price)}{" "}
//                               <span style={{ color: "gray" }}>
//                                 {" "}
//                                 x {ele.quantity}{" "}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {/* STATUS */}
//                 <div className="small text-secondary mt-3">Status</div>
//                 <div className="text-primary small fw-semibold">
//                   {bookingData?.bookingDetails?.status === "Pending"
//                     ? "Booking confirmed"
//                     : bookingData?.bookingDetails?.status || "-"}
//                 </div>
//                 {/* ..............reschedule and cancel............ */}
//                 {(bd.status === "Pending" || bd.status === "Confirmed") && (
//                   <div className="row gap-2 mt-3">
//                     <span
//                       className="col-sm-6"
//                       onClick={() => {
//                         setPopupType("cancel_booking");
//                         setShowCustomPopup(true);
//                       }}
//                       style={{
//                         cursor: "pointer",
//                         fontSize: "12px",
//                         color: "#0d6efd",
//                       }}
//                     >
//                       Click here to Cancel
//                     </span>
//                     <span
//                       className="col-sm-6"
//                       // onClick={() => {
//                       //   setPopupType("accept");
//                       //   setShowCustomPopup(true);
//                       // }}
//                       style={{
//                         cursor: "pointer",
//                         fontSize: "12px",
//                         color: "#0d6efd",
//                       }}
//                     >
//                       Click here to Reschedule
//                     </span>
//                     {/* <span
//                       className="col-sm-6"
//                       onClick={() => {
//                         window.location.assign(
//                           `/vendor-ratings?vendorId=${professional?.professionalId}&bookingId=${bookingData._id}&vendorName=${professional.name}&vendorPhoto=https://cdn.com/pic.jpg`
//                         );
//                       }}
//                       style={{
//                         cursor: "pointer",
//                         fontSize: "12px",
//                         color: "#0d6efd",
//                       }}
//                     >
//                       Ratings
//                     </span> */}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Green info box */}
//             <div className="p-3 rounded bg-success bg-opacity-10 d-flex gap-2">
//               <FiCheckCircle className="text-success mt-1" />
//               <p className="small mb-0 text-muted">
//                 Charges may change based on final scope. Adjustments may update
//                 the total cost.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Payment Summary */}
//         <div className="card shadow-sm mb-3">
//           <div className="card-body">
//             <h6 className="fw-bold mb-3">Payment Summary</h6>
//             {category === "House Painting" &&
//             ["Pending", "Confirmed", "Cancelled"].includes(bd.status) ? (
//               <>
//                 <div className="d-flex justify-content-between small mb-2">
//                   <span>Site Visit Charges</span>
//                   <span className="fw-semibold">
//                     {currency(bd?.siteVisitCharges || 0)}
//                   </span>
//                 </div>
//                 {bd.paymentStatus !== "Unpaid" && (
//                   <div className="d-flex justify-content-between small mb-2">
//                     <span>Amount Paid</span>
//                     <span className="fw-semibold">
//                       {currency(bd?.siteVisitCharges || 0)}
//                     </span>
//                   </div>
//                 )}
//                 {bd.status === "Cancelled" &&
//                   bd.paymentStatus === "Refunded" && (
//                     <div className="d-flex justify-content-between small mb-2">
//                       <span>Amount Refunded</span>
//                       <span className="fw-semibold">
//                         {currency(bd?.refundAmount || 0)}
//                       </span>
//                     </div>
//                   )}
//               </>
//             ) : (
//               <>{displayPaymentSummary()} </>
//             )}
//             {/* ............... summary over................ */}
//             {/* <hr /> */}
//             {bd?.priceUpdateRequestedToUser && (
//               <div className="mb-3">
//                 <div
//                   // className="fw-semibold"
//                   style={{ fontSize: 14, color: "#3e4045" }}
//                 >
//                   <span className="pulse-wrapper">
//                     <span className="status-dot"></span>
//                   </span>{" "}
//                   Scope change required and additional +₹
//                   {latestChange.adjustmentAmount} Please approve/reject this
//                   addition.
//                 </div>
//                 {latestChange &&
//                   latestChange.reason !== null &&
//                   latestChange.reason.trim() !== "" && (
//                     <div
//                       className="mt-3"
//                       style={{ fontSize: 14, color: "#3e4045" }}
//                     >
//                       REASON: {latestChange.reason}
//                     </div>
//                   )}
//                 <div
//                   className="d-flex gap-2 mt-3"
//                   style={{ justifyContent: "space-between" }}
//                 >
//                   <div
//                     onClick={() => {
//                       setPopupType("reject");
//                       setShowCustomPopup(true);
//                     }}
//                     style={{
//                       backgroundColor: "transparent",
//                       cursor: "pointer",
//                       fontWeight: 600,
//                     }}
//                     className=" d-flex align-items-center small gap-1"
//                   >
//                     <MdOutlineClose style={{ color: "red", fontSize: 17 }} />{" "}
//                     Reject
//                   </div>
//                   <div
//                     onClick={() => {
//                       setPopupType("accept");
//                       setShowCustomPopup(true);
//                     }}
//                     style={{
//                       backgroundColor: "transparent",
//                       cursor: "pointer",
//                       fontWeight: 600,
//                     }}
//                     className="d-flex align-items-center small gap-1 ms-2"
//                   >
//                     <FaCheck style={{ color: "green", fontSize: 16 }} /> Accept
//                   </div>
//                 </div>
//               </div>
//             )}
//             {(canShowPayNow || bookingData?.isEnquiry) && (
//               <div className="mt-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
//                 <div>
//                   <div className="small text-primary">
//                     {currentInstallmentLabel}
//                   </div>
//                   <div className="fw-semibold">
//                     {" "}
//                     {/* {bookingData?.isEnquiry && bd.paymentStatus === "Unpaid"
//                       ? category === "House Painting"
//                         ? currency(bd?.siteVisitCharges)
//                         : currency(bd?.bookingAmount)
//                       : currency(currentInstallmentAmount)} */}
//                     {currency(currentInstallmentAmount)}
//                   </div>
//                 </div>
//                 <button
//                   className="btn btn-primary px-4"
//                   onClick={handleOpenPayPopup}
//                 >
//                   Pay Now
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* vendor price update */}

//         {/* Professional Assigned */}
//         {bd.status !== "Cancelled" && bookingData?.assignedProfessional && (
//           <div className="card shadow-sm mb-3">
//             <div className="card-body">
//               <h6 className="fw-bold mb-3">Professional Assigned</h6>

//               <div className="d-flex align-items-center gap-3">
//                 <img
//                   src={
//                     bookingData?.assignedProfessional?.profile ||
//                     "https://www.vlp.org.uk/wp-content/uploads/2024/12/c830d1dee245de3c851f0f88b6c57c83c69f3ace-300x300.png"
//                   }
//                   style={{ width: 50, height: 50, objectFit: "cover" }}
//                 />
//                 {/* <FaUser style={{ width: 30, height: 30, objectFit: "cover" }} /> */}
//                 <div className="flex-grow-1">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <div className="fw-semibold">
//                         {bookingData.assignedProfessional.name || "N/A"}
//                       </div>
//                       <div className="small text-warning">
//                         ★ {bookingData.assignedProfessional.rating || 0}
//                       </div>
//                     </div>

//                     <div className="d-flex gap-2">
//                       <button
//                         onClick={() => {
//                           setPopupType("pay");
//                           setShowSuccessModal(true);
//                         }}
//                         className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
//                       >
//                         <FiPhone /> Call
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Team Members Section */}
//               {bookingData?.assignedProfessional?.hiring?.teamMember?.length >
//                 0 && (
//                 <>
//                   <div className="mt-3">
//                     <div className="mb-2" style={{ fontSize: "14px" }}>
//                       Assigned Team Members
//                     </div>
//                     <div className="d-flex flex-wrap gap-2">
//                       {bookingData.assignedProfessional.hiring.teamMember.map(
//                         (teamMember, index) => (
//                           <div
//                             key={index}
//                             className="badge bg-light text-dark px-2 py-1"
//                           >
//                             {teamMember.memberName || "Unnamed Member"}
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Tips Section */}
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h6 className="fw-bold mb-3">Our professionals work hard</h6>

//             <p className="small text-muted">
//               Your small gestures make a difference:
//             </p>

//             <ul className="list-unstyled small text-muted">
//               <li className="mb-2 d-flex gap-2">
//                 <span>🙂</span> Greet them with a friendly smile
//               </li>
//               <li className="mb-2 d-flex gap-2">
//                 <span>💧</span> Offer water
//               </li>
//               <li className="mb-2 d-flex gap-2">
//                 <span>🚻</span> Ensure washroom access
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Route params for debug */}
//         {/* <div className="text-center text-muted small mt-3">
//                     User ID: {userId} • Booking ID: {bookingId} • Date: {date}
//                 </div> */}
//       </div>
//       <PaymentSuccessModal
//         show={showSuccessModal}
//         bookingData={bookingData}
//         paidAmount={payAmount}
//         onClose={() => setShowSuccessModal(false)}
//       />
//       <Modal
//         show={showCustomPopup}
//         onHide={() => setShowCustomPopup(false)}
//         centered
//         backdrop="static"
//         keyboard={false}
//         dialogClassName="payment-modal"
//       >
//         <div className="modal-content position-relative p-3">
//           <div
//             style={{
//               textAlign: "center",
//               color: "#000000bf",
//               fontSize: "19px",
//               fontWeight: 600,
//             }}
//           >
//             {getPopupTitle()}
//           </div>

//           <div
//             className="my-2"
//             style={{ color: "#000000bf", fontSize: "16px" }}
//           >
//             {getPopupMessage()}
//           </div>

//           <div className="d-flex gap-2 justify-content-center">
//             <button
//               className="btn btn-secondary px-4"
//               onClick={() => setShowCustomPopup(false)}
//             >
//               {popupType === "cancel_booking" ? "Close" : "Cancel"}
//             </button>

//             <button
//               className="btn btn-primary px-4"
//               onClick={handlePrimaryAction}
//               disabled={!popupType}
//             >
//               {getPrimaryLabel()}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default PaymentCheckout;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiPhone, FiMapPin, FiCheckCircle, FiClock } from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { PiPaintBrushHousehold } from "react-icons/pi";
import { BiRupee } from "react-icons/bi";
import { getRequest, postRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS, API_BASE_URL } from "../ApiService/apiConstants";
import GlobalLoader from "../utils/GlobalLoader";
import { MdCleaningServices } from "react-icons/md";
import moment from "moment";
import { FaUser } from "react-icons/fa";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import "./payment-checkout.css";
import { Modal } from "react-bootstrap";
import SlotSelectionModal from "./SlotSelectionModal";
import axios from "axios";

const avatarSrc = "/mnt/data/WhatsApp Image 2025-11-25 at 4.53.03 PM.jpeg";

function PaymentCheckout() {
  const { bookingId, date, type } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isResLoading, setIsResLoading] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
  };

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

 const getLatLngFromBooking = () => {
  try {
    const coords = bookingData?.address?.location?.coordinates;

    // GeoJSON => [lng, lat]
    if (!Array.isArray(coords) || coords.length !== 2) return null;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  } catch (e) {
    console.error("getLatLngFromBooking error:", e);
    return null;
  }
};


  const mapServicesForSlots = (services = []) => {
    try {
      return services.map((s) => ({
        name: s.serviceName,
        price: s.price,
        quantity: s.quantity,
        service: s.category,
        teamMembers: s.teamMembers || 0,
        duration: s.duration || 0,
      }));
    } catch (e) {
      console.error("mapServicesForSlots error:", e);
      return [];
    }
  };

  // const fetchAvailableSlots = async (date) => {
  //   try {
  //     const location = getLatLngFromSession();
  //     if (!location) return [];

  //     if (!bookingData?.serviceType) return [];

  //     const basePayload = {
  //       serviceType: bookingData.serviceType, // deep_cleaning | house_painting
  //       date,
  //       lat: location.lat,
  //       lng: location.lng,
  //     };

  //     let payload = basePayload;

  //     // ⭐ Deep Cleaning → attach services
  //     if (bookingData.serviceType === "deep_cleaning") {
  //       payload = {
  //         ...basePayload,
  //         services: mapServicesForSlots(bookingData?.service || []),
  //       };
  //     }

  //     const res = await fetch(
  //       `${API_BASE_URL}/slots/website/get-available-slots`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!data.success) return [];

  //     return data.slots || [];
  //   } catch (err) {
  //     console.error("fetchAvailableSlots error:", err);
  //     return [];
  //   }
  // };

  const fetchAvailableSlots = async (date) => {
  try {
    const location = getLatLngFromBooking();
    if (!location) {
      console.warn("Lat/Lng missing from bookingData.address.location.coordinates");
      return [];
    }

    if (!bookingData?.serviceType) return [];

    const basePayload = {
      serviceType: bookingData.serviceType, // deep_cleaning | house_painting
      date,
      lat: location.lat,
      lng: location.lng,
    };

    const payload =
      bookingData.serviceType === "deep_cleaning"
        ? {
            ...basePayload,
            services: mapServicesForSlots(bookingData?.service || []),
          }
        : basePayload;

    console.log("Slots payload =>", payload);

    const res = await fetch(`${API_BASE_URL}/slots/website/get-available-slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Slots response =>", data);

    if (!data?.success) return [];
    return data.slots || [];
  } catch (err) {
    console.error("fetchAvailableSlots error:", err);
    return [];
  }
};

  const handleProceedToSlotSelection = async () => {
    // if (minimumAmount > TotalPrice) return;

    const today = new Date().toISOString().split("T")[0];
    const slots = await fetchAvailableSlots(today);

    sessionStorage.setItem("availableSlots", JSON.stringify(slots));
    setShowSlotModal(true);
  };

  // Function to handle selecting a slot
  const handleSelectSlot = async (slot) => {
    // setSelectedSlot(slot);
    sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
    setShowSlotModal(false);

    // ⭐ IF RESCHEDULE MODE

    try {
      const res = await axios.put(
        `${API_BASE_URL}/slot/admin/reschedule-booking/${bookingData._id}`,
        null,
        {
          params: {
            slotDate: slot.date,
            slotTime: slot.time,
          },
        }
      );

      const data = res.data;

      if (!data.success) {
        alert(data.message || "Reschedule failed");
        return;
      }

      alert("Booking rescheduled successfully");
      fetchBookingDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule booking");
    }
  };

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
      // alert("Price has been approved successfully.");
      window.location.reload();
      // await fetchBookingDetails();
    } catch (error) {
      console.error("Error approving price:", error);
      // alert("Failed to approve price. Please try again.");
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
      // alert("Price has been rejected.");
      window.location.reload();
      // await fetchBookingDetails();
    } catch (error) {
      console.error("Error rejecting price:", error);
      // alert("Failed to rejecting price. Please try again.");
    } finally {
      setIsResLoading(false);
    }
  };

  const CancelBooking = async () => {
    setIsResLoading(true);
    try {
      const formData = {
        bookingId: bookingData._id,
        status: "Cancelled",
      };
      const result = await postRequest(API_ENDPOINTS.CANCEL_BOOKING, formData);
      await fetchBookingDetails();
      console.log("result", result);
    } catch (error) {
      console.log("Error while updating status:", error);
    } finally {
      setIsResLoading(false);
    }
  };

  const getPopupTitle = () => {
    if (popupType === "accept") return "Accept the Price";
    if (popupType === "reject") return "Reject the Price";
    if (popupType === "pay") return "Proceed to pay";
    if (popupType === "cancel_booking") return "Cancel Booking";
    return "";
  };

  const getPopupMessage = () => {
    if (popupType === "accept") return "Are you sure you want to accept?";
    if (popupType === "reject") return "Are you sure you want to reject?";
    if (popupType === "pay") return "Are you sure you want to pay?";
    if (popupType === "cancel_booking")
      // return "Are you sure you want to Cancel Booking?";
      return "Free cancellation up to 3 hours before your booking. If cancelled within 3 hours, no refund is provided. This amount goes directly to our service teams to cover their lost time, as we blocked this slot exclusively for you.";
    return "";
  };

  const getPrimaryLabel = () => {
    if (popupType === "accept") return "Accept";
    if (popupType === "reject") return "Reject";
    if (popupType === "pay") return "Pay";
    if (popupType === "cancel_booking") return "Yes, Cancel";
    return "";
  };

  const handlePrimaryAction = async () => {
    try {
      if (popupType === "accept") {
        await approvePrice("customer");
      } else if (popupType === "reject") {
        await rejectPrice("customer");
      } else if (popupType === "pay") {
        if (bookingData?.isEnquiry) {
          await payAndConvertEnquiryToLead();
        } else {
          await handleProceedToPay();
        }
      } else if (popupType === "cancel_booking") {
        await CancelBooking();

        // await handleProceedToPay();
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

  console.log("Bookd data Full Context>>", bookingData);

  // ..............--- 💰 Payment Calculation Logic ---..............................
  const bd = bookingData?.bookingDetails ?? {};
  const installmentRequested = bd?.paymentLink?.installment; // "second" | "final" | undefined
  const currency = (n) => `₹ ${Number(n ?? 0).toLocaleString("en-IN")}`;
  const category = bookingData?.service?.[0]?.category;

  let currentInstallmentLabel = "";
  let currentInstallmentAmount = 0;

  // Installment status
  const firstPaid = bd?.firstPayment?.status === "paid";
  const secondPaid = bd?.secondPayment?.status === "paid";
  const finalPaid = bd?.finalPayment?.status === "paid";

  // which installment is vendor asking to pay now?
  // PRIORITY 1: Enquiry Payment Flow (always override)
  if (bookingData?.isEnquiry && bd.paymentStatus === "Unpaid") {
    if (category === "House Painting") {
      currentInstallmentLabel = "Site Visit Charges";
      currentInstallmentAmount = bd?.siteVisitCharges || 0;
    } else if (category === "Deep Cleaning") {
      currentInstallmentLabel = "First Partial Payment";
      currentInstallmentAmount = bd?.bookingAmount || 0;
    }
  }
  // PRIORITY 2: Deep Cleaning installments
  // Deep Cleaning → only first + final
  else if (category === "Deep Cleaning") {
    if (!firstPaid) {
      currentInstallmentLabel = "First Partial Payment";
      currentInstallmentAmount = bd?.firstPayment?.amount || 0;
    } else if (!finalPaid) {
      currentInstallmentLabel = "Final Payment";
      currentInstallmentAmount = bd?.finalPayment?.amount || 0;
    }
  }
  // PRIORITY 3: House Painting installments
  // House Painting → first + second + final
  else if (category === "House Painting") {
    if (!firstPaid) {
      currentInstallmentLabel = "First Partial Payment";
      currentInstallmentAmount = bd?.firstPayment?.amount || 0;
    } else if (!secondPaid) {
      currentInstallmentLabel = "Second Partial Payment";
      currentInstallmentAmount = bd?.secondPayment?.amount || 0;
    } else if (!finalPaid) {
      currentInstallmentLabel = "Final Payment";
      currentInstallmentAmount = bd?.finalPayment?.amount || 0;
    }
  }

  const canShowPayNow =
    bd &&
    bd?.paymentLink?.isActive &&
    currentInstallmentAmount > 0 &&
    (bd.status === "Pending Hiring" ||
      bd?.status === "Project Ongoing" ||
      bd.status === "Waiting for final payment");

  // 1. All price changes
  const priceChanges = bd?.priceChanges || [];
  const latestChange = priceChanges[priceChanges.length - 1] || null;
  const isPendingChange = !!latestChange && latestChange.status === "pending";

  // 2. Only APPROVED changes
  const approvedChanges = priceChanges.filter((c) => c.status === "approved");
  const hasApprovedChange = approvedChanges.length > 0;

  // 3. Original committed total before any changes
  // const originalTotal = bd?.finalTotal || bd?.bookingAmount || 0;
  const originalTotal = bd?.originalTotalAmount || bd?.bookingAmount || 0;

  // 4. Net approved delta (add = +, reduced = -)
  // const totalApprovedDelta = approvedChanges.reduce(
  //   (sum, c) =>
  //     sum +
  //     (c.scopeType === "Reduced"
  //       ? -(c.adjustmentAmount || 0)
  //       : c.adjustmentAmount || 0),
  //   0
  // );
  const totalApprovedDelta = approvedChanges.reduce((sum, c) => {
    const delta = c.adjustmentAmount || 0;
    return sum + (c.scopeType === "Reduced" ? -delta : delta);
  }, 0);

  // 5. Current committed total (should equal bd.finalTotal)
  const approvedTotal = originalTotal + totalApprovedDelta;

  // ₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹ DISPLAYING THE PAYMENT SUMMARY ₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹₹
  const displayPaymentSummary = () => {
    // 1) Pending - price updated(added) that user must approve/reject
    if (bd?.priceUpdateRequestedToUser && isPendingChange) {
      const pendingDelta =
        latestChange.scopeType === "Reduced"
          ? -(latestChange.adjustmentAmount || 0)
          : latestChange.adjustmentAmount || 0;
      const pendingTotal = approvedTotal + pendingDelta;

      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">
              {" "}
              {currency(approvedTotal || bd?.finalTotal || 0)}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid1</span>
            <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Yet to be Paid</span>
            <span className="fw-semibold">
              {currency(bd?.amountYetToPay || 0)}
            </span>
          </div>
          {/* <div className="small mt-2">
            Scope change required and additional{" "}
            <span className="fw-semibold">
              {pendingDelta < 0 ? "- " : "+ "}
              {currency(Math.abs(pendingDelta))}
            </span>
            . Please approve/reject this addition.
          </div> */}
        </>
      );
    }

    // 2) Price update already approved: show old vs change vs new
    if (hasApprovedChange && !isPendingChange) {
      // latest approved change
      const latestApproved = approvedChanges[approvedChanges.length - 1];
      // const changeDelta =
      //   latestApproved.scopeType === "Reduced"
      //     ? -(latestApproved.adjustmentAmount || 0)
      //     : latestApproved.adjustmentAmount || 0;

      // const oldTotal = approvedTotal - changeDelta; // previous total before last change
      // const newTotal = approvedTotal;

      const oldTotal = originalTotal;
      const changeDelta = totalApprovedDelta;
      const newTotal = approvedTotal; // should match bd.finalTotal

      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Old Total Amount</span>
            <span className="fw-semibold">{currency(oldTotal)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Change</span>
            <span
              className={`fw-semibold ${
                changeDelta < 0 ? "text-danger" : "text-success"
              }`}
            >
              {changeDelta < 0 ? "- " : "+ "}
              {currency(Math.abs(changeDelta))}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>New Total Amount</span>
            <span className="fw-semibold">{currency(newTotal)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid2</span>
            <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
          </div>
          {bd?.amountYetToPay !== 0 && bd.status !== "Project Completed" && (
            <div className="d-flex justify-content-between small mb-2">
              <span>Amount yet to be Paid</span>
              <span className="fw-semibold">
                {currency(bd?.amountYetToPay || 0)}
              </span>
            </div>
          )}
        </>
      );
    }

    // 3) Normal installment flow (no active price update)
    // Case A: first installment pending (Pending Hiring)
    if (!firstPaid) {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid</span>
            <span className="fw-semibold">{currency(0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Booking Amount to be Paid</span>
            <span className="fw-semibold">
              {currency(bd?.firstPayment?.amount || 0)}
            </span>
          </div>
        </>
      );
    }

    // Case B: first paid, second pending (second payment request)
    if (firstPaid && !secondPaid && installmentRequested === "second") {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid4</span>
            <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Second Partial Amount to be Paid</span>
            <span className="fw-semibold">
              {currency(bd?.secondPayment?.amount || 0)}
            </span>
          </div>
        </>
      );
    }

    // Case C: first + second paid, final pending (final payment request)
    if (
      firstPaid &&
      secondPaid &&
      !finalPaid &&
      installmentRequested === "final"
    ) {
      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Total Amount</span>
            <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid5</span>
            <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Final Amount to be Paid</span>
            <span className="fw-semibold">
              {currency(bd?.finalPayment?.amount || 0)}
            </span>
          </div>
        </>
      );
    }
    // Case D: For the pending reduction you
    if (bd?.priceUpdateRequestedToAdmin && isPendingChange) {
      const pendingDelta =
        latestChange.scopeType === "Reduced"
          ? -(latestChange.adjustmentAmount || 0)
          : latestChange.adjustmentAmount || 0;

      const oldTotal = originalTotal;
      const changeDelta = totalApprovedDelta;
      const newTotal = approvedTotal; // should match bd.finalTotal

      return (
        <>
          <div className="d-flex justify-content-between small mb-2">
            <span>Old Total Amount</span>
            <span className="fw-semibold">{currency(oldTotal)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Change</span>
            <span
              className={`fw-semibold ${
                changeDelta < 0 ? "text-danger" : "text-success"
              }`}
            >
              {changeDelta < 0 ? "- " : "+ "}
              {currency(Math.abs(changeDelta))}
            </span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>New Total Amount</span>
            <span className="fw-semibold">{currency(newTotal)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount Paid</span>
            <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span>Amount yet to be Paid</span>
            <span className="fw-semibold">
              {currency(bd?.amountYetToPay || 0)}
            </span>
          </div>
          <div className="small mt-2">
            Scope change requested with{" "}
            <span
              className={
                pendingDelta < 0
                  ? "text-danger fw-semibold"
                  : "text-success fw-semibold"
              }
            >
              {pendingDelta < 0 ? "- " : "+ "}
              {currency(Math.abs(pendingDelta))}
            </span>
            . Please approve/reject this change.
          </div>
        </>
      );

      // return (
      //   <>
      //     <div className="d-flex justify-content-between small mb-2">
      //       <span>Total Amount</span>
      //       <span className="fw-semibold">{currency(committedTotal)}</span>
      //     </div>
      //     <div className="d-flex justify-content-between small mb-2">
      //       <span>Amount Paid</span>
      //       <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
      //     </div>
      //     <div className="d-flex justify-content-between small mb-2">
      //       <span>Amount Yet to be Paid</span>
      //       <span className="fw-semibold">
      //         {currency(bd?.amountYetToPay || 0)}
      //       </span>
      //     </div>
      // <div className="small mt-2">
      //   Scope change requested with{" "}
      //   <span
      //     className={
      //       pendingDelta < 0
      //         ? "text-danger fw-semibold"
      //         : "text-success fw-semibold"
      //     }
      //   >
      //     {pendingDelta < 0 ? "- " : "+ "}
      //     {currency(Math.abs(pendingDelta))}
      //   </span>
      //   . Please approve/reject this change.
      // </div>
      //   </>
      // );
    }

    // Case E: all installments paid – simple summary
    return (
      <>
        <div className="d-flex justify-content-between small mb-2">
          <span>Total Amount</span>
          <span className="fw-semibold">{currency(bd?.finalTotal || 0)}</span>
        </div>
        <div className="d-flex justify-content-between small mb-2">
          <span>Amount Paid</span>
          <span className="fw-semibold">{currency(bd?.paidAmount || 0)}</span>
        </div>
        {category === "Deep Cleaning" &&
          // bd.status === "Cancelled" &&
          bd.refundAmount > 0 &&
          bd.paymentStatus === "Refunded" && (
            <div className="d-flex justify-content-between small mb-2">
              <span>Amount Refunded</span>
              <span className="fw-semibold">
                {currency(bd?.refundAmount || 0)}
              </span>
            </div>
          )}
      </>
    );
  };

  const handleOpenPayPopup = () => {
    // snapshot the amount at click time
    setPayAmount(currentInstallmentAmount);
    setPopupType("pay");
    setShowCustomPopup(true);
  };

  const handleProceedToPay = async () => {
    const data = {
      bookingId,
      paymentMethod: "UPI",
      paidAmount: payAmount || 0,
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

  const payAndConvertEnquiryToLead = async () => {
    const data = {
      bookingId,
      paymentMethod: "UPI",
      paidAmount: payAmount || 0,
    };
    try {
      setIsResLoading(true);
      const result = await postRequest(
        API_ENDPOINTS.PAY_AND_CONVERT_ENQUIRY_TO_LEAD,
        data
      );
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
                {/* <div> </div> */}
              </span>
              <span className="small text-secondary">
                • {bookingData?.customer?.phone}
              </span>
            </div>

            <div className="mb-3 d-flex align-items-center gap-2 text-muted">
              <span>
                <FiMapPin style={{ fontSize: 15 }} />
              </span>
              <span className="small">
                {address.houseFlatNumber}, {address.streetArea}
              </span>
            </div>
            <div className="small flex-shrink-0" style={{ minWidth: "90px" }}>
              <div className="text-secondary">Date</div>

              <div className="fw-semibold">
                {bookingData?.selectedSlot?.slotDate
                  ? moment(bookingData.selectedSlot.slotDate).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
              </div>

              <div>{bookingData?.selectedSlot?.slotTime || "-"}</div>
            </div>
            <div className="mb-3 d-flex gap-3 booking-header-row">
              <div className="flex-grow-1 min-w-0">
                <div className="small text-secondary mt-3">Service</div>
                {bookingData?.service?.[0]?.category === "House Painting" ? (
                  /** HOUSE PAINTING UI **/
                  <div className="fw-semibold small d-flex align-items-center gap-2 flex-wrap">
                    <PiPaintBrushHousehold size={16} />

                    <span className="text-truncate">
                      {bookingData?.service?.[0]?.serviceName || "-"}
                    </span>
                  </div>
                ) : (
                  /** DEEP CLEANING (MULTIPLE SERVICES) **/
                  <div className="small">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <MdCleaningServices size={16} />
                      <span className="fw-semibold ">
                        {bookingData?.service?.[0]?.category}
                      </span>
                    </div>
                    {bookingData?.service?.map((ele, idx) => (
                      <div key={idx}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <GoDotFill
                            style={{ color: "#6c757d", fontSize: 10 }}
                          />{" "}
                          <div>
                            <span>{ele.serviceName}</span>
                            <div style={{ fontWeight: 600 }}>
                              {currency(ele.price)}{" "}
                              <span style={{ color: "gray" }}>
                                {" "}
                                x {ele.quantity}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* STATUS */}
                <div className="small text-secondary mt-3">Status</div>
                <div className="text-primary small fw-semibold">
                  {bookingData?.bookingDetails?.status === "Pending"
                    ? "Booking confirmed"
                    : bookingData?.bookingDetails?.status || "-"}
                </div>
                {/* ..............reschedule and cancel............ */}
                {(bd.status === "Pending" || bd.status === "Confirmed") && (
                  <div className="row gap-2 mt-3">
                    <span
                      className="col-sm-6"
                      onClick={() => {
                        setPopupType("cancel_booking");
                        setShowCustomPopup(true);
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#0d6efd",
                      }}
                    >
                      Click here to Cancel
                    </span>
                    <span
                      className="col-sm-6"
                      onClick={handleProceedToSlotSelection}
                      style={{
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#0d6efd",
                      }}
                    >
                      Click here to Reschedule
                    </span>
                    {/* <span
                      className="col-sm-6"
                      onClick={() => {
                        window.location.assign(
                          `/vendor-ratings?vendorId=${professional?.professionalId}&bookingId=${bookingData._id}&vendorName=${professional.name}&vendorPhoto=https://cdn.com/pic.jpg`
                        );
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#0d6efd",
                      }}
                    >
                      Ratings
                    </span> */}
                  </div>
                )}
              </div>
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
            {category === "House Painting" &&
            ["Pending", "Confirmed", "Cancelled"].includes(bd.status) ? (
              <>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Site Visit Charges</span>
                  <span className="fw-semibold">
                    {currency(bd?.siteVisitCharges || 0)}
                  </span>
                </div>
                {bd.paymentStatus !== "Unpaid" && (
                  <div className="d-flex justify-content-between small mb-2">
                    <span>Amount Paid</span>
                    <span className="fw-semibold">
                      {currency(bd?.siteVisitCharges || 0)}
                    </span>
                  </div>
                )}
                {bd.status === "Cancelled" &&
                  bd.paymentStatus === "Refunded" && (
                    <div className="d-flex justify-content-between small mb-2">
                      <span>Amount Refunded</span>
                      <span className="fw-semibold">
                        {currency(bd?.refundAmount || 0)}
                      </span>
                    </div>
                  )}
              </>
            ) : (
              <>{displayPaymentSummary()} </>
            )}
            {/* ............... summary over................ */}
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
                {latestChange &&
                  latestChange.reason !== null &&
                  latestChange.reason.trim() !== "" && (
                    <div
                      className="mt-3"
                      style={{ fontSize: 14, color: "#3e4045" }}
                    >
                      REASON: {latestChange.reason}
                    </div>
                  )}
                <div
                  className="d-flex gap-2 mt-3"
                  style={{ justifyContent: "space-between" }}
                >
                  <div
                    onClick={() => {
                      setPopupType("reject");
                      setShowCustomPopup(true);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
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
                    style={{
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                    className="d-flex align-items-center small gap-1 ms-2"
                  >
                    <FaCheck style={{ color: "green", fontSize: 16 }} /> Accept
                  </div>
                </div>
              </div>
            )}
            {(canShowPayNow || bookingData?.isEnquiry) && (
              <div className="mt-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-primary">
                    {currentInstallmentLabel}
                  </div>
                  <div className="fw-semibold">
                    {" "}
                    {/* {bookingData?.isEnquiry && bd.paymentStatus === "Unpaid"
                      ? category === "House Painting"
                        ? currency(bd?.siteVisitCharges)
                        : currency(bd?.bookingAmount)
                      : currency(currentInstallmentAmount)} */}
                    {currency(currentInstallmentAmount)}
                  </div>
                </div>
                <button
                  className="btn btn-primary px-4"
                  onClick={handleOpenPayPopup}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
        {/* vendor price update */}

        {/* Professional Assigned */}
        {bd.status !== "Cancelled" && bookingData?.assignedProfessional && (
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Professional Assigned</h6>

              <div className="d-flex align-items-center gap-3">
                <img
                  src={
                    bookingData?.assignedProfessional?.profile ||
                    "https://www.vlp.org.uk/wp-content/uploads/2024/12/c830d1dee245de3c851f0f88b6c57c83c69f3ace-300x300.png"
                  }
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
                {/* <FaUser style={{ width: 30, height: 30, objectFit: "cover" }} /> */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">
                        {bookingData.assignedProfessional.name || "N/A"}
                      </div>
                      <div className="small text-warning">
                        ★ {bookingData.assignedProfessional.rating || 0}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        onClick={() => {
                          setPopupType("pay");
                          setShowSuccessModal(true);
                        }}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                      >
                        <FiPhone /> Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
              {bookingData?.assignedProfessional?.hiring?.teamMember?.length >
                0 && (
                <>
                  <div className="mt-3">
                    <div className="mb-2" style={{ fontSize: "14px" }}>
                      Assigned Team Members
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {bookingData.assignedProfessional.hiring.teamMember.map(
                        (teamMember, index) => (
                          <div
                            key={index}
                            className="badge bg-light text-dark px-2 py-1"
                          >
                            {teamMember.memberName || "Unnamed Member"}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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

      <SlotSelectionModal
        show={showSlotModal}
        onClose={handleCloseSlotModal}
        handleSelectSlot={handleSelectSlot}
        fetchAvailableSlots={fetchAvailableSlots}
        type="reschedule"
      />

      <PaymentSuccessModal
        show={showSuccessModal}
        bookingData={bookingData}
        paidAmount={payAmount}
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
              {popupType === "cancel_booking" ? "Close" : "Cancel"}
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
