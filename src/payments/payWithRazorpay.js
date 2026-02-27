import axios from "axios";
import { loadRazorpay } from "../utils/loadRazorpay";
import { API_BASE_URL } from "../ApiService/apiConstants";

const purposeLabel = {
    site_visit: "Site Visit Charge",
    dc_first: "Deep Cleaning – First Installment",
    dc_final: "Deep Cleaning – Final Payment",
    hp_first: "House Painting – First Installment",
    hp_second: "House Painting – Second Installment",
    hp_final: "House Painting – Final Payment",
};

/**
 * Opens the Razorpay payment modal and handles verification.
 *
 * @param {object} params
 * @param {string}   params.bookingId
 * @param {object}   params.razorpayOrder   - { keyId, orderId, amount (₹), currency, purpose }
 * @param {object}   [params.customer]      - { name, phone, email }
 * @param {Function} [params.onVerify]      - async (razorpayResponse) => verifiedData
 *                                            Override to use a custom verify endpoint.
 *                                            Default: POST /payments/razorpay/verify
 * @param {Function} [params.onSuccess]     - called with verifiedData on success
 * @param {Function} [params.onFailure]     - called with error message on failure / dismiss
 */
export async function payWithRazorpay({
    bookingId,
    razorpayOrder,
    customer,
    onVerify,       // ← optional: pass a custom async verify function
    onSuccess,
    onFailure,
}) {
    try {
        const ok = await loadRazorpay();
        if (!ok) throw new Error("Razorpay SDK failed to load. Check internet/adblock.");

        // Default verify: used by Checkout.jsx (enquiry / first-payment flow)
        const defaultVerify = async (response) => {
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
            return verifyRes.data;
        };

        const verify = onVerify || defaultVerify;

        const options = {
            key: razorpayOrder.keyId,
            order_id: razorpayOrder.orderId,
            amount: String(Math.round(Number(razorpayOrder.amount) * 100)), // paise
            currency: razorpayOrder.currency || "INR",
            name: "Homjee",
            description: purposeLabel[razorpayOrder.purpose] || "Payment",

            prefill: {
                name: customer?.name || "",
                contact: customer?.phone || "",
                email: customer?.email || "",
            },

            handler: async function (response) {
                try {
                    const data = await verify(response);
                    onSuccess?.(data);
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
