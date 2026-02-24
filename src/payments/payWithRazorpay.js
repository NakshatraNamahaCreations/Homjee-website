// src/payments/payWithRazorpay.js
import axios from "axios";
import { loadRazorpay } from "../utils/loadRazorpay";
import { API_BASE_URL } from "../ApiService/apiConstants";

export async function payWithRazorpay({
    bookingId,
    razorpayOrder,
    customer,
    BASE_URL,
    onSuccess,
    onFailure,
}) {
    try {
        const ok = await loadRazorpay();
        if (!ok) throw new Error("Razorpay SDK failed to load. Check internet/adblock.");

        const options = {
            key: razorpayOrder.keyId,
            order_id: razorpayOrder.orderId,
            amount: String(Math.round(Number(razorpayOrder.amount) * 100)), // paise
            currency: razorpayOrder.currency || "INR",
            name: "Homjee",
            description:
                razorpayOrder.purpose === "site_visit"
                    ? "Site Visit Charge"
                    : "First Installment",

            prefill: {
                name: customer?.name || "",
                contact: customer?.phone || "",
                email: customer?.email || "",
            },

            handler: async function (response) {
                try {
                    console.log("BASE_URL", BASE_URL);

                    // response => { razorpay_payment_id, razorpay_order_id, razorpay_signature }
                    const verifyRes = await axios.post(
                        `${API_BASE_URL}/payments/razorpay/verify`,
                        {
                            bookingId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }
                    );

                    if (!verifyRes.data?.success) {
                        throw new Error(verifyRes.data?.message || "Payment verification failed");
                    }

                    onSuccess?.(verifyRes.data);
                } catch (err) {
                    onFailure?.(err?.message || "Payment verification failed");
                }
            },

            modal: {
                ondismiss: function () {
                    onFailure?.("Payment cancelled");
                },
            },

            theme: { color: "#23408B" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err) {
        onFailure?.(err?.message || "Payment failed");
    }
}