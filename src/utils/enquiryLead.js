import { postRequest, putRequest } from "../ApiService/apiHelper";
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

// Builds the address payload shape that the backend updateEnquiry expects.
// Accepts the same "selectedAddress" shape we already store in sessionStorage
// (the AddressPickerModal output, normalized).
const buildAddressPayload = (addr) => {
  if (!addr) return null;
  const lat = Number(addr.latitude ?? addr.lat);
  const lng = Number(addr.longitude ?? addr.lng);
  return {
    houseFlatNumber: addr.houseNumber ?? addr.houseFlatNumber ?? "",
    streetArea: addr.address ?? addr.streetArea ?? "",
    landMark: addr.landmark ?? addr.landMark ?? "",
    city: addr.city ?? "",
    location: {
      type: "Point",
      coordinates: [
        Number.isFinite(lng) ? lng : 0,
        Number.isFinite(lat) ? lat : 0,
      ],
    },
  };
};

// Finalize the in-flight enquiry: prefers updating the existing enquiry doc
// (created at OTP verify) so we don't end up with duplicate records. Falls
// back to creating a fresh booking only when no enquiry id is present in
// sessionStorage (stale tab, direct nav, etc.).
//
// `finalize: true` lets the backend create a Razorpay order when applicable
// (deep_cleaning first installment / house_painting site visit). For
// payment-free service types (home_interior, packers_&_movers) it's a no-op
// for payment but still enriches the doc with the full payload.
export const finalizeBookingRequest = async (payload) => {
  const bookingId = getEnquiryBookingId();

  if (bookingId) {
    try {
      return await putRequest(
        `${API_ENDPOINTS.UPDATE_ENQUIRY}${bookingId}`,
        { ...payload, finalize: true },
      );
    } catch (e) {
      // If the stored enquiry has already been finalized (e.g. a previous
      // payment session converted it), the backend rejects with
      // "Booking is not an enquiry". Drop the stale id and fall through
      // to a fresh createBooking so the customer isn't stuck.
      const msg = String(e?.message || "");
      if (/not an enquiry/i.test(msg)) {
        clearEnquiryBookingId();
      } else {
        throw e;
      }
    }
  }

  return postRequest(API_ENDPOINTS.CREATE_BOOKINGS, payload);
};

// Progressive partial update of the in-flight enquiry. Used to flush the
// customer's address and slot to the backend as soon as they're committed,
// so a drop-off mid-flow still leaves an enriched lead in the admin panel.
//
// Silently no-ops if there's no enquiryBookingId in sessionStorage (e.g.
// the user landed on checkout via a stale tab) — the legacy createBooking
// finalize path still works.
export const patchEnquiry = async ({ address, selectedSlot, customer } = {}) => {
  const bookingId = getEnquiryBookingId();
  if (!bookingId) return null;

  const body = {};
  if (customer) body.customer = customer;

  const addrPayload = buildAddressPayload(address);
  if (addrPayload) body.address = addrPayload;

  if (selectedSlot && (selectedSlot.date || selectedSlot.slotDate)) {
    body.selectedSlot = {
      slotDate: selectedSlot.slotDate ?? selectedSlot.date ?? "",
      slotTime: selectedSlot.slotTime ?? selectedSlot.time ?? "",
    };
  }

  if (Object.keys(body).length === 0) return null;

  try {
    const res = await putRequest(
      `${API_ENDPOINTS.UPDATE_ENQUIRY}${bookingId}`,
      body,
    );
    return res || null;
  } catch (e) {
    // Partial updates must not block the user flow.
    console.error("[enquiryLead] patch failed:", e);
    return null;
  }
};
