import { postRequest } from "../ApiService/apiHelper";
import { API_ENDPOINTS } from "../ApiService/apiConstants";

const STORAGE_KEY = "enquiryBookingId";

export const getEnquiryBookingId = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

export const clearEnquiryBookingId = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
};

// Creates a lightweight enquiry/lead right after OTP verification.
// Captures the customer as a lead even if they drop off before reaching checkout.
// The returned bookingId is stored in sessionStorage and re-used by Checkout
// to finalize the booking instead of creating a new one.
export const createEnquiryLead = async ({ user, serviceType, formName }) => {
  if (!user?.mobileNumber) {
    console.warn("[enquiryLead] skipped — no mobileNumber on user", user);
    return null;
  }
  if (!serviceType) {
    console.warn("[enquiryLead] skipped — no serviceType");
    return null;
  }

  const payload = {
    customer: {
      customerId: user?._id,
      name: user?.userName || "",
      phone: String(user.mobileNumber),
    },
    serviceType,
    formName: formName || "Website OTP Lead",
  };

  console.log("[enquiryLead] POST", API_ENDPOINTS.CREATE_ENQUIRY_LEAD, payload);

  try {
    const res = await postRequest(API_ENDPOINTS.CREATE_ENQUIRY_LEAD, payload);
    const bookingId = res?.bookingId;

    if (bookingId) {
      sessionStorage.setItem(STORAGE_KEY, String(bookingId));
      console.log("[enquiryLead] stored bookingId:", bookingId);
    } else {
      console.warn("[enquiryLead] response missing bookingId:", res);
    }
    return bookingId || null;
  } catch (e) {
    // Lead capture should never block the user flow, but make the failure visible.
    console.error("[enquiryLead] request failed:", e);
    return null;
  }
};
