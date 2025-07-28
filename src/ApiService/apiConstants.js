export const API_BASE_URL = "http://localhost:9000/api"; // development
// export const API_BASE_URL = "https://homjee-backend.onrender.com/api"; // production

export const API_ENDPOINTS = {
  // USER AUTH
  LOGIN_WITH_MOBILE: "/user/save-user",
  VERIFY_OTP: "/user/verify-otp",
  RESEND_OTP: "/user/resent-otp",

  // ADDRESS
  SAVE_ADDRESS: "/user/save-address/",
  GET_ADDRESS: "/user/get-user-address/",

  // BOOKINGS
  CREATE_BOOKINGS: "/bookings/create-user-booking",
  GET_BOOKINGS_BY_BOOKING_ID: "/bookings/get-bookings-by-bookingid/",
  GET_BOOKINGS_BY_CUSTOMER_ID: "/bookings/get-bookings-by-customerid",

  // SERVICE CONFIG
  GET_SERVICE_PRICE_CONFIG: "/service/latest",
};
