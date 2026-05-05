import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Carousel, Form, Modal } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";
import serviceBg from "../assets/service-bg.svg";
import exterior from "../assets/exterior.png";
import map from "../assets/map.png";
import searchLocation from "../assets/search-location.png";
import woodpolish from "../assets/woodpolish.png";
import texture from "../assets/texture.png";
import waterproofing from "../assets/waterproofing.png";
import bgImage from "../assets/quality-bg.png";
import paintIcon from "../assets/paint-icon.svg";
import ontime from "../assets/ontime.png";
import warrantyIcon from "../assets/warranty-icon.png";
import postservice from "../assets/postservice.png";
import quoteIcon from "../assets/quote-icon.png";
import freeinsurance from "../assets/freeinsurance.png";
import wallpaperBanner from "../assets/wallpaper-banner.png";
import checkIcon from "../assets/check-green.png";
import crossIcon from "../assets/cross-red.png";
import homjeeLogo from "../assets/logohomjee.png";
import bgBrands from "../assets/brands-bg.png";
import logoBerger from "../assets/brand-berger.png";
import logoDulux from "../assets/brand-dulux.png";
import logoAsian from "../assets/brand-asianpaints.png";
import logoOpus from "../assets/brand-opus.png";
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import arrowicon from "../assets/arrowicon.png";
import testimonialVideo from "../assets/testimonial.mp4";
import bgProfessional from "../assets/pro-bg.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import vectoricon from "../assets/vectoricon.png";
import paintingservice from "../assets/paintingservice.png";
import transperancy from "../assets/transperancy.png";
import wallpaperBannerimage from "../assets/wallpaperBannerimage.png";
import bgBrandsimage from "../assets/bgBrandsimage.png";
import bgProfessionalimage from "../assets/bgProfessionalimage.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { getRequest, postRequest, putRequest } from "../ApiService/apiHelper";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
import { createEnquiryLead, patchEnquiry } from "../utils/enquiryLead";
import { useAddressContext } from "../utils/AddressContext";
import Autocomplete from "react-google-autocomplete";
import SlotSelectionModal from "./SlotSelectionModal";
import { useSelectedSlotContext } from "../utils/SlotContext";
import GlobalLoader from "../utils/GlobalLoader";
import AddressPickerModal from "../components/AddressPickerModal";

const getStoredUser = () => {
  try {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("getStoredUser parse error", e);
    return null;
  }
};

const setStoredUser = (user) => {
  try {
    if (!user) sessionStorage.removeItem("user");
    else sessionStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("setStoredUser error", e);
  }
};

const Services = () => {
  const navigate = useNavigate();
  // const activeIndex = 0;
  const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";
  const [activeIndex, setActiveIndex] = useState(0);
  const [responseLoader, setResponseLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [joinedOtp, setJoinedOTP] = useState(null);
  const [otpValue, setOtpValue] = useState(null);

  const videos = [testimonialVideo, testimonialVideo, testimonialVideo];
  // const [houseNumber, setHouseNumber] = useState("");
  // const [landmark, setLandmark] = useState("");
  // const [locationRequested, setLocationRequested] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [mapAddress, setMapAddress] = useState("");
  // const [userAddress, setUserAddress] = useState(null);
  const { addressDataContext, setAddressDataContext } = useAddressContext();
  // const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const userId = currentUser?._id; // ✅ use this everywhere

  const SERVICE_TYPE = "house_painting"; // <-- change dynamically if reused

  // const isNewUser = sessionStorage.getItem("isNewUser") === "true";
  const [showSlotModal, setShowSlotModal] = useState(false);
  const { setSelectedSlot } = useSelectedSlotContext();

  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);
  const [cityName, setCityName] = useState(null);

  // const [showSearchBarOptions, setShowSearchBarOptions] = useState(false);
  const [showOptionOpoup, setShowOptionOpoup] = useState(false);

  const [showAddress, setShowAddress] = useState(false);
  const [addressPickerCfg, setAddressPickerCfg] = useState({
    address: "",
    houseNumber: "",
    landmark: "",
    lat: null,
    lng: null,
    city: "",
  });

  console.log("isNewUser", isNewUser);
  const inputRefs = useRef([]);
  const openAddressAfterOptionCloseRef = useRef(false);


useEffect(() => {
  try {
    if (!showModal) return;

    const timer = setTimeout(() => {
      const firstInput = inputRefs.current?.[0];
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }, 200);

    return () => clearTimeout(timer);
  } catch (e) {
    console.error("OTP autofocus error", e);
  }
}, [showModal]);
  // const formattedAddress = "Channasandra, Srinivaspura, Bengaluru, Karnataka 560060, India";

  useEffect(() => {
    if (mapAddress) {
      const addressParts = mapAddress.split(",");
      const city =
        addressParts.length >= 3
          ? addressParts[addressParts.length - 3].trim()
          : "";
      console.log("extracted city name:", city);
      setCityName(city);
    }
  }, [mapAddress]); // <-- Reacts to changes in mapAddress

  // console.log("cityName", cityName);

  // useEffect(() => {
  //   if (inputRefs.current[0]) {
  //     inputRefs.current[0].focus();
  //   }
  // }, []);

  //   const handleProceedClick = () => {
  //   setShowModal(true);
  // };
  const handleCloseModal = () => {
    setShowModal(false);

    setOtp(["", "", "", ""]);
  };

  //  const handleSubmitOTP = () => {
  //   setShowModal(false);
  //  navigate('/checkout', { state: { phoneNumber, openAddressModal: true } });
  //   window.location.reload();
  // };

  const formData = {
    mobileNumber: phoneNumber,
    userName: userName,
  };

  const handleProceedClick = async (e) => {
    setResponseLoader(true);
    e.preventDefault();
    if (!phoneNumber || !userName) {
      alert("Please enter your Name and Phone number");
      setResponseLoader(false);
      return;
    }
    try {
      const result = await postRequest(
        API_ENDPOINTS.LOGIN_WITH_MOBILE,
        formData,
      );
      setResponseLoader(false);
      console.log("Login Success", result);

      setOtpValue(result.otp);
      setShowModal(true);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setResponseLoader(false);
    }
  };

  const verifyOTP = async () => {
    try {
      console.log("=== OTP VERIFICATION START ===");

      if (!joinedOtp || joinedOtp.length !== 4) {
        alert("Please enter valid OTP");
        return;
      }

      const data = { otp: joinedOtp, mobileNumber: phoneNumber, userName };
      const result = await postRequest(API_ENDPOINTS.VERIFY_OTP, data);

      console.log("OTP Verification Result:", result);

      if (result?.data) {
        setStoredUser(result.data);
        setCurrentUser(result.data);
      }

      // ✅ Store user in session
      sessionStorage.setItem("user", JSON.stringify(result.data));

      // Capture lead immediately — survives drop-off before checkout
      createEnquiryLead({
        user: result.data,
        serviceType: SERVICE_TYPE,
        formName: "Website House Painting Lead",
      });

      // ✅ Get isNewUser correctly
      const isNewUserFlag = Boolean(result.isNewUser);
      console.log("isNewUser from backend:", isNewUserFlag);

      sessionStorage.setItem("isNewUser", String(isNewUserFlag));
      setIsNewUser(isNewUserFlag);

      setOtp(["", "", "", ""]);
      setShowModal(false);

      // ✅ Get user ID
      const userId = result?.data?._id;
      if (!userId) {
        console.error("No user ID found");
        alert("User information not found");
        return;
      }

      // ✅ Try to fetch saved address
      const savedAddress = await fetchUserAddress(userId);
      console.log("Fetched saved address:", savedAddress);

      // ✅ For new users: get current location if no saved address
      let initialAddress = savedAddress;
      if (isNewUserFlag && !savedAddress) {
        try {
          const loc = await getCurrentLocationDraft();
          initialAddress = {
            address: loc.address || "",
            houseNumber: "",
            landmark: "",
            latitude: Number(loc.latitude) || 12.9716,
            longitude: Number(loc.longitude) || 77.5946,
            city: loc.city || "",
          };
          console.log("📍 Current location for new user:", initialAddress);
        } catch (e) {
          console.error("Failed to get current location:", e);
          // Continue with empty address
        }
      }

      // ✅ Always open address picker with the address (saved or current location)
      // Search is always enabled for both new and existing users
      setAddressPickerCfg({
        address: initialAddress?.address || "",
        houseNumber: initialAddress?.houseNumber || "",
        landmark: initialAddress?.landmark || "",
        lat: initialAddress?.latitude
          ? Number(initialAddress.latitude)
          : initialAddress?.lat || 12.9716,
        lng: initialAddress?.longitude
          ? Number(initialAddress.longitude)
          : initialAddress?.lng || 77.5946,
        city: initialAddress?.city || "",
      });

      // If we have a saved address, store it in context
      if (savedAddress) {
        setAddressDataContext(savedAddress);
        sessionStorage.setItem("selectedAddress", JSON.stringify(savedAddress));
      }

      setShowAddress(true);
    } catch (error) {
      console.error("verifyOTP error:", error);
      alert(error?.message || "Invalid OTP");
    }
  };

  const ResendOTP = async () => {
    setOtp(["", "", "", ""]);
    try {
      const result = await postRequest(API_ENDPOINTS.RESEND_OTP, formData);
      console.log("OTP Re-sent", result);

      setOtpValue(result.otp);
    } catch (error) {
      console.error("OTP Re-sent Error:", error);
      // NotificationManager.error(error.message || "Login failed");
    }
  };

  const getCurrentLocationDraft = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

          try {
            const response = await fetch(geocodingUrl);
            const data = await response.json();

            if (data.status === "OK" && data.results.length > 0) {
              const first = data.results[0];
              const formatted = first.formatted_address;

              // ✅ city extract (better than split)
              const comps = first.address_components || [];
              const cityComp =
                comps.find((c) => c.types?.includes("locality")) ||
                comps.find((c) =>
                  c.types?.includes("administrative_area_level_2"),
                );

              resolve({
                address: formatted,
                latitude,
                longitude,
                city: cityComp?.long_name || "",
              });
              return;
            }

            reject(new Error("Unable to resolve address"));
          } catch (e) {
            reject(e);
          }
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    });

  const fetchUserAddress = async (userId) => {
    try {
      if (!userId) return null;

      const response = await getRequest(
        `${API_ENDPOINTS.GET_ADDRESS}${userId}`,
      );

      // Check if the address is in `savedAddress` or `address` field
      const addressData = response?.address || response?.savedAddress;

      if (addressData) {
        const addrObj = {
          uniqueCode:
            addressData.uniqueCode ||
            `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          address: addressData.address,
          houseNumber: addressData.houseNumber || "",
          landmark: addressData.landmark || "",
          latitude: Number(addressData.latitude),
          longitude: Number(addressData.longitude),
          city: addressData.city || "",
        };

        setAddressDataContext(addrObj);
        sessionStorage.setItem("selectedAddress", JSON.stringify(addrObj));
        return addrObj;
      }

      return null;
    } catch (error) {
      console.error("fetchUserAddress error:", error?.response || error);
      return null;
    }
  };
  useEffect(() => {
    if (!userId) return;
    fetchUserAddress(userId);
  }, [userId]);

  console.log("mapAddress", mapAddress);

  const handleSaveAddressFromModal = async (picked) => {
    try {
      console.log("💾 Saving address from modal:", picked);

      if (!picked?.houseNumber?.trim()) {
        alert("House/Flat Number is required");
        return;
      }

      const uniqueCode = `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const addressObj = {
        uniqueCode,
        address: picked.address || addressPickerCfg.address || "",
        houseNumber:
          picked.houseNumber?.trim() || addressPickerCfg.houseNumber || "",
        landmark: picked.landmark?.trim() || addressPickerCfg.landmark || "",
        latitude: Number(picked.lat || addressPickerCfg.lat),
        longitude: Number(picked.lng || addressPickerCfg.lng),
        city: picked.city || addressPickerCfg.city || "",
      };

      console.log("📝 Address to save:", addressObj);

      if (currentUser?._id) {
        const payload = { savedAddress: addressObj };
        console.log("📤 Saving to backend:", payload);

        const result = await putRequest(
          `${API_ENDPOINTS.SAVE_ADDRESS}${currentUser._id}`,
          payload,
        );
        console.log("✅ Save result:", result);
      }

      setAddressDataContext(addressObj);
      sessionStorage.setItem("selectedAddress", JSON.stringify(addressObj));
      setShowAddress(false);

      // Push address to the in-flight enquiry so a drop-off here still
      // leaves an enriched lead for the admin.
      patchEnquiry({ address: addressObj });

      await handleProceedToSlotSelection();
    } catch (error) {
      console.error("💥 handleSaveAddressFromModal error:", error);
      alert(error?.message || "Failed to save address");
    }
  };

  useEffect(() => {
    try {
      const onStorage = (e) => {
        if (e.key === "user") setCurrentUser(getStoredUser());
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    } catch (e) {
      console.error("storage sync error", e);
    }
  }, []);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    try {
      const value = e.target.value.replace(/\D/g, ""); // only digit
      const newOtp = [...otp];
      newOtp[index] = value;

      const joinString = newOtp.join("");
      setJoinedOTP(joinString);
      setOtp(newOtp);

      if (value && index < newOtp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } catch (err) {
      console.error("handleOtpChange error:", err);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        setJoinedOTP(newOtp.join(""));
      } else if (index > 0) {
        // go to prev box
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const features = [
    "Final Pay after 100% quality satisfaction",
    "Full material procurement",
    "100% packaging & masking",
    "Trained experts & advanced tools",
    "Daily quality checks & dedicated manager",
    "Free Insurance for damages of up to ₹10,000",
    "1 Yr service warranty against chipping , bubbling",
    "Timely completion & clean up",
  ];

  const randomAvatars = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://randomuser.me/api/portraits/men/54.jpg",
    "https://randomuser.me/api/portraits/women/51.jpg",
  ];

  const reviewers = [
    {
      name: "Manoj Tiwari",
      img: "https://plus.unsplash.com/premium_photo-1682092603230-1ce7cf8ca451?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwbWFufGVufDB8fDB8fHww", // :contentReference[oaicite:0]{index=0}
      review:
        "Excellent work by the Homjee team. They finished the painting much faster than I expected. The finish on the walls is very smooth and they used high-quality paints. Very professional behavior.",
    },
    {
      name: "Anjali Gupta",
      img: "https://images.pexels.com/photos/26617600/pexels-photo-26617600.jpeg", // :contentReference[oaicite:1]{index=1}
      review:
        "I recently got my 2BHK painted through Homjee. I really liked how they covered all my furniture with plastic sheets before starting. No paint stains were left on the floor. Very neat and clean work!",
    },
    {
      name: "Sandeep Reddy",
      img: "https://images.unsplash.com/photo-1534339480783-6816b68be29c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // :contentReference[oaicite:2]{index=2}
      review:
        "The painters are very skilled and polite. They helped me choose the right color shades for my living room. The price was also very transparent with no hidden costs. Truly a hassle-free experience.",
    },
    {
      name: "Kavita Deshmukh",
      img: "https://images.pexels.com/photos/15602468/pexels-photo-15602468.jpeg", // :contentReference[oaicite:3]{index=3}
      review:
        "Homjee provides great service. Their team arrived on time every day and worked very hard. They even fixed the small cracks in the walls before painting. My home looks beautiful now!",
    },
    {
      name: "Rahul Verma",
      img: "https://images.unsplash.com/photo-1607081692251-d689f1b9af84?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // :contentReference[oaicite:4]{index=4}
      review:
        "Top-class painting service in the city. The staff is professional and they use genuine branded paints. They did a final inspection after finishing to make sure I was satisfied. Will definitely use them again.",
    },
  ];

  const faqData = [
    "Are your painters trained and experienced professionals?",
    "What if Paint/Primer/Tools are required in the middle of  the service?",
    "Who will clean up the house after the service?",
    "What if I have an issue or doubt which I need to resolve during painting?",
    "Can I choose my preferred paint brand and colour for the project?",
    "Will the painting process cause disruptions to my daily routine?",
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
  };

  // const availableSlots = [
  //   { date: "2025-06-06", time: "10:00 AM - 12:00 PM" },
  //   { date: "2025-06-06", time: "02:00 PM - 04:00 PM" },
  //   { date: "2025-06-07", time: "09:00 AM - 11:00 AM" },
  // ];

  const getLatLngFromSession = () => {
    const addr = sessionStorage.getItem("selectedAddress");
    if (!addr) return null;

    const parsed = JSON.parse(addr);
    return {
      lat: Number(parsed.latitude),
      lng: Number(parsed.longitude),
      city: parsed.city || "",
    };
  };

  // Returns { slots, reason } — reason is the backend's failure-cause
  // message when no slots are available (e.g. "No vendors available within
  // service radius", "All available vendors are already booked for this
  // date"). The modal surfaces it so we don't show a generic "no slots"
  // when something more diagnostic is available.
  const fetchAvailableSlots = async (date) => {
    const location = getLatLngFromSession();
    if (!location) return { slots: [], reason: null };

    const payload = {
      serviceType: SERVICE_TYPE, // 🔥 dynamic
      date,
      lat: location.lat,
      lng: location.lng,
      // Pre-filter the vendor pool by city at the DB layer so we don't
      // haversine-check vendors from other cities (cuts log noise + work).
      // Backend tolerates this being missing.
      city: location.city || undefined,
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}/slots/website/get-available-slots`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (!data.success) return { slots: [], reason: data?.message || null };

      return {
        slots: data.slots || [],
        reason: data?.reason?.message || null,
      };
    } catch (err) {
      console.error("Slot fetch failed", err);
      return { slots: [], reason: null };
    }
  };

  const handleProceedToSlotSelection = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { slots } = await fetchAvailableSlots(today);
    sessionStorage.setItem("availableSlots", JSON.stringify(slots));
    setShowSlotModal(true);
  };

  // Function to handle selecting a slot
  const handleSelectSlot = (slot) => {
    // console.log("slot", slot);
    setSelectedSlot(slot);
    sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
    setShowSlotModal(false);

    // Flush the chosen slot to the enquiry so dropping off before checkout
    // still leaves date+time on the lead.
    patchEnquiry({ selectedSlot: slot });

    navigate("/checkout", {
      state: {
        serviceType: "house_painting",
      },
    });
  };

  return (
    <>
      {responseLoader && <GlobalLoader />}
      {/* Hero Section */}
      <div className="d-none d-lg-block">
        <div
          style={{
            width: "1200px",
            // height: '622px',
            margin: "0 auto",
            borderRadius: "30px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Carousel interval={3000} controls={true} indicators={false}>
            <Carousel.Item>
              <div className="carousel-wrapper">
                <img
                  className="d-block w-100"
                  src={serviceBg}
                  alt="Slide 1"
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <div className="custom-bar-indicators">
                  <div className="bar active" />
                  <div className="bar" />
                </div>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <div className="carousel-wrapper">
                <img
                  className="d-block w-100"
                  src={serviceBg}
                  alt="Slide 2"
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <div className="custom-bar-indicators">
                  <div className="bar" />
                  <div className="bar active" />
                </div>
              </div>
            </Carousel.Item>
          </Carousel>

          <style>{`
        .carousel-wrapper {
          position: relative;
        }

        .custom-bar-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .bar {
          width: 30px;
          height: 6px;
          border-radius: 4px;
          background-color: black;
          transition: all 0.3s;
        }

        .bar.active {
          width: 40px;
          background-color: red;
        }
      `}</style>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "#fff",
              color: "#e60000",
              fontWeight: "bold",
              border: "none",
              padding: "10px 18px",
              borderRadius: "999px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
              zIndex: 2,
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "20px" }}>{"<"}</span>
            <span style={{ color: "#000" }}>Back</span>
          </button>
        </div>
      </div>

      <div className="d-block d-lg-none">
        <div
          style={{
            width: "353px",
            // height: '622px',
            margin: "0 auto",
            borderRadius: "30px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Carousel interval={3000} controls={true} indicators={false}>
            <Carousel.Item>
              <div className="carousel-wrapper">
                <img
                  className="d-block w-100"
                  src={paintingservice}
                  alt="Slide 1"
                  style={{ height: "", objectFit: "cover" }}
                />
                <div className="custom-bar-indicators">
                  <div className="bar active" />
                  <div className="bar" />
                </div>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <div className="carousel-wrapper">
                <img
                  className="d-block w-100"
                  src={paintingservice}
                  alt="Slide 2"
                  style={{ height: "", objectFit: "cover" }}
                />
                <div className="custom-bar-indicators">
                  <div className="bar" />
                  <div className="bar active" />
                </div>
              </div>
            </Carousel.Item>
          </Carousel>

          <style>{`
        .carousel-wrapper {
          position: relative;
        }

        .custom-bar-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .bar {
          width: 30px;
          height: 6px;
          border-radius: 4px;
          background-color: black;
          transition: all 0.3s;
        }

        .bar.active {
          width: 40px;
          background-color: red;
        }
      `}</style>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: "12px",
              left: "20px",
              backgroundColor: "#fff",
              color: "#e60000",
              fontWeight: "bold",
              border: "none",
              padding: "10px 18px",
              borderRadius: "999px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
              zIndex: 2,
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "16px" }}>{"<"}</span>
            {/* <span style={{ color: '#000' }}></span> */}
          </button>
        </div>
      </div>

      {/* Booking Section */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundColor: "#fff5f1",
            borderRadius: "30px",
            padding: "40px 20px",
            width: "1200px",
            margin: "40px auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontSize: "35px",
              fontWeight: "600",
              marginBottom: "20px",
              position: "relative",
              display: "inline-block",
            }}
          >
            Book A Site Visit For At Home Consultation
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "320px",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <input
              type="text"
              placeholder="Enter Name"
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                minWidth: "500px",
                fontSize: "14px",
                backgroundColor: "#fff5f1",
                outline: "none",
                color: "#000",
              }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter WhatsApp Phone Number"
              value={phoneNumber}
              maxLength={10}
              onChange={handlePhoneNumberChange}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                backgroundColor: "#fff5f1",
                border: "1px solid #ccc",
                minWidth: "500px",
                fontSize: "14px",
                outline: "none",
                color: "#000",
              }}
            />
          </div>

          <button
            onClick={responseLoader ? null : handleProceedClick}
            style={{
              marginTop: "30px",
              padding: "12px 40px",
              border: "1px solid #e60000",
              color: "#e60000",
              fontWeight: "700",
              backgroundColor: "transparent",
              borderRadius: "999px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            PROCEED
          </button>

          {/* OTP Modal */}
          {showModal && (
            <>
              {/* Backdrop */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                }}
                onClick={handleCloseModal}
              />
              {/* Modal Content */}
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "20px",
                  width: "400px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  zIndex: 1001,
                  textAlign: "center",
                  border: "1px solid #e60000",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}
                  >
                    OTP
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
                <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                  Enter OTP sent to number {phoneNumber}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    marginBottom: "20px",
                    color: "red",
                  }}
                >
                  development: {otpValue}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {otp.map((digit, index) => (
                   <input
  key={index}
  type="tel"
  inputMode="numeric"
  autoComplete={index === 0 ? "one-time-code" : "off"}
  maxLength={1}
  value={digit}
  onChange={(e) => handleOtpChange(e, index)}
  onKeyDown={(e) => handleKeyDown(e, index)}
  ref={(el) => (inputRefs.current[index] = el)}
  autoFocus={index === 0}
  style={{
    width: "40px",
    height: "40px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    color: "black",
    fontSize: "18px",
    outline: "none",
    backgroundColor: "#fff",
    caretColor: "#000",
  }}
/>
                  ))}
                </div>
                <p style={{ marginBottom: "20px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#e60000",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      ResendOTP();
                    }}
                  >
                    Resend OTP
                  </a>
                </p>
                <button
                  onClick={verifyOTP}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#e60000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundColor: "#fff5f1",
            borderRadius: "30px",
            padding: "40px 20px",
            width: "90%",
            maxWidth: "1450px",
            margin: "40px auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "600",
              marginBottom: "20px",
              position: "relative",
              display: "inline-block",
            }}
          >
            Book A Site Visit For At <br />
            Home Consultation
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "28px",
                left: "85px",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <input
              type="text"
              placeholder="Enter Name"
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                minWidth: "300px",
                fontSize: "14px",
                backgroundColor: "#fff5f1",
                outline: "none",
              }}
            />
            <input
              type="text"
              placeholder="Enter WhatsApp Phone Number"
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                backgroundColor: "#fff5f1",
                border: "1px solid #ccc",
                minWidth: "300px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <button
            style={{
              marginTop: "30px",
              padding: "12px 40px",
              border: "1px solid #e60000",
              color: "#e60000",
              fontWeight: "700",
              backgroundColor: "transparent",
              borderRadius: "999px",
              fontSize: "16px",
              width: "100%",
              cursor: "pointer",
            }}
          >
            PROCEED
          </button>
        </div>
      </div>

      {/* Heading */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "40px",
          textAlign: "center",
          marginLeft: "",
        }}
        className="d-none d-lg-block"
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "600",
            margin: 0,
            textAlign: "center",
          }}
        >
          For All Your Home Painting Needs
        </h2>
        <img
          src={vectoricon}
          alt=""
          style={{
            position: "absolute",
            bottom: "-14px",
            left: "46%",
            width: "130px",
            height: "auto",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "40px",
          textAlign: "center",
        }}
        className="d-block d-lg-none"
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "600",
            margin: 0,
            textAlign: "center",
          }}
        >
          For All Your Home Painting Needs
        </h2>
        <img
          src={vectoricon}
          alt=""
          style={{
            position: "absolute",
            bottom: "30px",
            left: "90px",
            width: "130px",
            height: "auto",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />
      </div>
      {/* painting needs */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundColor: "#f4e6ff",
            borderRadius: "30px",
            padding: "50px 30px",
            width: "1200px",
            // maxWidth: '1450px',
            margin: " auto",

            textAlign: "center",
          }}
        >
          {/* Grid of 2x2 cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {[
              {
                title: "Interiors & Exteriors",
                subtitle: "Color Your Home Inside Out",
                img: exterior,
              },
              {
                title: "Wood Polish",
                subtitle: "Shine Your Home Like Never Before",
                img: woodpolish,
              },
              {
                title: "Texture",
                subtitle: "Elevate Your Space With Wall Beautification",
                img: texture,
              },
              {
                title: "Waterproofing",
                subtitle: "Seal, Shield, & Sustain Your Home",
                img: waterproofing,
              },
            ].map((service, index) => (
              <div
                key={index}
                style={{
                  //   backgroundColor: '#fff',
                  borderRadius: "20px",
                  overflow: "hidden",
                  textAlign: "left",
                  //   boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "16px" }}>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {service.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundColor: "#f4e6ff",
            borderRadius: "30px",
            padding: "40px 20px",
            width: "90%",
            maxWidth: "1450px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {[
              {
                title: "Interiors & exteriors",
                img: exterior,
              },
              {
                title: "Wood polish",
                img: woodpolish,
              },
              {
                title: "Texture",
                img: texture,
              },
              {
                title: "Waterproofing",
                img: waterproofing,
              },
            ].map((service, index) => (
              <div
                key={index}
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "118px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <div style={{ padding: "8px 2px 0 2px" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* transperancy */}
      <div className="d-none d-lg-block">
        <div
          style={{
            position: "relative",
            height: "400px",
            width: "1200px",
            // maxWidth: '1450px',
            margin: "40px auto",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Overlay content */}
          <div
            style={{
              textAlign: "left",
              color: "#fff",
              padding: "30px",
              //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: "20px",
              maxWidth: "500px",
              marginLeft: "-57%",
            }}
          >
            {/* Paint Icon */}
            <img
              src={paintIcon}
              alt="Paint Icon"
              style={{ width: "108px", marginBottom: "20px" }}
            />
            <br />
            {/* Heading */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <h2
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                100 % Quality with Transparency
              </h2>
              <img
                src={vectoricon}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "135px",
                  width: "130px",
                  height: "auto",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Subtext */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "28px",
                color: "#fff",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              A fresh coat for a fresh start
            </p>
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            position: "relative",
            height: "400px",
            width: "90%",
            maxWidth: "1450px",
            margin: "40px auto",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundImage: `url(${transperancy})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay content centered absolutely */}
          <div
            style={{
              position: "absolute",
              top: "43%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "left",
              color: "#fff",
              padding: "30px",
              borderRadius: "20px",
              maxWidth: "90%",
              width: "500px",
            }}
          >
            {/* Paint Icon */}
            <img
              src={paintIcon}
              alt="Paint Icon"
              style={{ width: "108px", marginBottom: "20px" }}
            />
            <br />

            {/* Heading with underline icon */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                100% Quality with <br /> Transparency
              </h2>
              <img
                src={vectoricon}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "130px",
                  width: "120px",
                  height: "auto",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Subtext */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "20px",
                color: "#fff",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              A fresh coat for a fresh start
            </p>
          </div>
        </div>
      </div>

      {/* our promises */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "30px",
            padding: "60px 30px",
            width: "1200px",
            // maxWidth: '1300px',
            margin: "40px auto",
            textAlign: "center",
          }}
        >
          {/* Heading */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Our Promises
            </h2>
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "50px",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",

              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {[
              {
                bg: "#e8d7ff",
                icon: ontime,
                title: "On-time Completion\nGuarantee",
              },
              {
                bg: "#d9ecff",
                icon: warrantyIcon,
                title: "1-Year\nWarranty",
              },
              {
                bg: "#ccf0f7",
                icon: postservice,
                title: "Post Service\nCleaning",
              },
              {
                bg: "#e6dbff",
                icon: quoteIcon,
                title: "Accurate Quotations,\nNo Hidden Charges",
              },
              {
                bg: "#ccf7ec",
                icon: freeinsurance,
                title: "Free Insurance",
                subtitle: "for damages of up to ₹10,000",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: item.bg,
                  borderRadius: "20px",
                  padding: "30px 20px",
                  width: "210px",
                  height: "200px",
                  flexShrink: 0, // prevents shrinking on small screens
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: "80px", marginBottom: "20px" }}
                />
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: "1px",
                      color: "#333",
                      fontWeight: 600,
                    }}
                  >
                    {item.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "30px",
            padding: "60px 30px",
            width: "90%",
            maxWidth: "1300px",
            margin: "40px auto",
            textAlign: "center",
          }}
        >
          {/* Heading */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Our Promises
            </h2>
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Cards Vertical Stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {[
              {
                bg: "#e8d7ff",
                icon: ontime,
                title: "On-time Completion\nGuarantee",
              },
              {
                bg: "#d9ecff",
                icon: warrantyIcon,
                title: "1-Year\nWarranty",
              },
              {
                bg: "#ccf0f7",
                icon: postservice,
                title: "Post Service\nCleaning",
              },
              {
                bg: "#e6dbff",
                icon: quoteIcon,
                title: "Accurate Quotations,\nNo Hidden Charges",
              },
              {
                bg: "#ccf7ec",
                icon: freeinsurance,
                title: "Free Insurance",
                subtitle: "for damages of up to ₹10,000",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: item.bg,
                  borderRadius: "20px",
                  padding: "24px 20px",
                  width: "100%",
                  maxWidth: "400px",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "left",
                  gap: "20px",
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: "60px", height: "60px", flexShrink: 0 }}
                />
                <div>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      whiteSpace: "pre-line",
                      margin: 0,
                      lineHeight: "1.3",
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p
                      style={{
                        fontSize: "13px",
                        marginTop: "4px",
                        color: "#333",
                        fontWeight: 500,
                      }}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* newly launched */}
      <div className="d-none d-lg-block">
        <div
          style={{
            position: "relative",
            height: "400px",
            width: "1200px",
            // maxWidth: '1300px',
            margin: "40px auto",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundImage: `url(${wallpaperBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            padding: "0 50px",
          }}
        >
          {/* Text Overlay */}
          <div style={{ color: "#fff", maxWidth: "500px" }}>
            {/* Badge */}
            <div
              style={{
                backgroundColor: "#fff",
                color: "#e60000",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "6px 16px",
                borderRadius: "999px",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              Newly Launched
            </div>
            <br />
            {/* Heading with underline */}
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* <h2
            style={{
              fontSize: '50px',
              fontWeight: 'bold',
              margin: 0,
              lineHeight: '1.2',
            }}
          >
            Wallpaper And <br /> Wall Panels
          </h2> */}
              <h2
                style={{
                  fontSize: "50px",
                  fontWeight: "500",
                  margin: 0,
                  lineHeight: "1.2",
                  fontFamily: "Poppins, sans-serif",
                  color: "#fff",
                }}
              >
                <span style={{ position: "relative", display: "inline-block" }}>
                  Wallpaper
                  <img
                    src={vectoricon}
                    alt="underline"
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "130px",
                      height: "auto",
                      pointerEvents: "none",
                    }}
                  />
                </span>{" "}
                And
                <br />
                <span style={{ marginTop: "1%" }}>Wall Panels</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p
              style={{
                marginTop: "24px",
                fontSize: "35px",
                fontFamily: "Fasthand",
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}
            >
              Bringing Life To Your Surrounding
            </p>
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            position: "relative",
            height: "400px",
            width: "90%",
            maxWidth: "1300px",
            margin: "40px auto",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundImage: `url(${wallpaperBannerimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            padding: "0 50px",
          }}
        >
          {/* Text Overlay */}
          <div style={{ color: "#fff", maxWidth: "500px", marginLeft: "-12%" }}>
            {/* Badge */}
            <div
              style={{
                backgroundColor: "#fff",
                color: "#e60000",
                fontWeight: "600",
                fontSize: "14px",
                padding: "6px 16px",
                borderRadius: "999px",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              Newly Launched
            </div>
            <br />
            {/* Heading with underline */}
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* <h2
            style={{
              fontSize: '50px',
              fontWeight: 'bold',
              margin: 0,
              lineHeight: '1.2',
            }}
          >
            Wallpaper And <br /> Wall Panels
          </h2> */}
              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: "500",
                  margin: 0,
                  lineHeight: "1.4",
                  fontFamily: "Poppins, sans-serif",
                  color: "#fff",
                }}
              >
                <span style={{ position: "relative", display: "inline-block" }}>
                  Wallpaper
                  <img
                    src={vectoricon}
                    alt="underline"
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "130px",
                      height: "auto",
                      pointerEvents: "none",
                    }}
                  />
                </span>{" "}
                And
                <br />
                <span style={{ marginTop: "1%" }}>Wall Panels</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p
              style={{
                marginTop: "24px",
                fontSize: "20px",
                fontFamily: "Fasthand",
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}
            >
              Bringing Life To Your Surrounding
            </p>
          </div>
        </div>
      </div>

      {/* why choose homjee */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "30px",
            padding: "60px 20px",
            width: "1200px",
            // maxWidth: '1200px',
            margin: "40px auto",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "600",
                marginBottom: "10px",
                position: "relative",
              }}
            >
              Why Choose Homjee?
              <img
                src={vectoricon}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "480px",
                  width: "130px",
                  height: "auto",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </h2>
          </div>

          {/* Table Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1fr",
              gap: "0px",
              alignItems: "center",
            }}
          >
            {/* Column Headers */}
            <div></div>
            <div
              style={{
                textAlign: "center",
                padding: "8px 0",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <img
                src={homjeeLogo}
                alt="Homjee"
                style={{ height: "32px", marginLeft: "-34%" }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "8px 0",
                fontWeight: "bold",
                fontSize: "16px",
                marginLeft: "-30%",
              }}
            >
              Local Market
            </div>

            {/* Rows */}
            {features.map((text, index) => (
              <React.Fragment key={index}>
                <div
                  key={`feature-${index}`}
                  style={{
                    fontSize: "16px",
                    padding: "14px 0",
                    fontWeight: "500",
                  }}
                >
                  {text}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "14px 0",
                    width: "70%",
                    backgroundColor: "#e8f5e9",
                  }}
                >
                  <img src={checkIcon} alt="yes" style={{ width: "30px" }} />
                </div>

                <div
                  style={{
                    textAlign: "center",
                    padding: "14px 0",
                    backgroundColor: "#ffebee",
                    width: "70%",
                  }}
                >
                  <img src={crossIcon} alt="no" style={{ width: "30px" }} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "30px",
            padding: "60px 20px",
            width: "90%",
            maxWidth: "1200px",
            margin: "40px auto",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "600",
                marginBottom: "10px",
                position: "relative",
              }}
            >
              Why Choose Homjee?
              <img
                src={vectoricon}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "24%",
                  width: "130px",
                  height: "auto",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </h2>
          </div>

          {/* Table Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1fr",
              gap: "0px",
              alignItems: "center",
            }}
          >
            {/* Column Headers */}
            <div></div>
            <div
              style={{
                textAlign: "center",
                padding: "8px 0",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <img
                src={homjeeLogo}
                alt="Homjee"
                style={{ height: "32px", marginLeft: "-34%" }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "8px 0",
                fontWeight: "bold",
                fontSize: "16px",
                marginLeft: "-30%",
              }}
            >
              Local Market
            </div>

            {/* Rows */}
            {features.map((text, index) => (
              <React.Fragment key={index}>
                <div
                  key={`feature-${index}`}
                  style={{
                    fontSize: "14px",
                    padding: "14px 0",
                    fontWeight: "500",
                  }}
                >
                  {text}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "14px 0",
                    width: "70%",
                    // backgroundColor: '#e8f5e9',
                  }}
                >
                  <img src={checkIcon} alt="yes" style={{ width: "30px" }} />
                </div>

                <div
                  style={{
                    textAlign: "center",
                    padding: "14px 0",
                    // backgroundColor: '#ffebee',
                    width: "70%",
                  }}
                >
                  <img src={crossIcon} alt="no" style={{ width: "30px" }} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* premium brands */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundImage: `url(${bgBrands})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "30px",
            padding: "60px 30px",
            width: "1200px",
            height: "400px",
            margin: "40px auto",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {/* Heading */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginTop: "15%",
              }}
            >
              Premium brands, <span style={{ color: "" }}>for you</span>
              <img
                src={vectoricon}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "150px",
                  width: "130px",
                  height: "auto",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </h2>
          </div>

          {/* Logos */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              padding: "20px 0",
            }}
          >
            {[logoBerger, logoDulux, logoAsian, logoOpus].map((img, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "12px 20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  width: "160px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={img}
                  alt={`brand-${index}`}
                  style={{
                    width: "160px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundImage: `url(${bgBrandsimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "30px",
            padding: "60px 30px",
            height: "400px",
            margin: "40px auto",
            width: "361px",
            textAlign: "center",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Heading */}
          <div
            style={{
              position: "relative",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Premium Brands,
              <br />
              For You
            </h2>
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "auto",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Logos */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              padding: "10px 0",
              maxWidth: "360px",
            }}
          >
            {[logoBerger, logoDulux, logoAsian, logoOpus].map((img, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "12px 20px",
                  width: "140px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={img}
                  alt={`brand-${index}`}
                  style={{
                    maxWidth: "140px",
                    maxHeight: "80px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* our process */}
      <div className="d-none d-lg-block">
        <div
          style={{
            background: "#fff",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          {/* Main Heading */}
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "600",
              fontFamily: "Poppins, sans-serif",
              color: "#111",
              marginBottom: "10px",
              position: "relative",
              display: "inline-block",
            }}
          >
            Our Process
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "50px",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          <div
            style={{
              background: "#fff",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            {/* Carousel */}
            <Carousel
              indicators={true}
              controls={true}
              interval={4000}
              className="how-carousel"
              nextIcon={
                <span className="carousel-control-next-icon custom-icon" />
              }
              prevIcon={
                <span className="carousel-control-prev-icon custom-icon" />
              }
            >
              <Carousel.Item>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  style={{ padding: "0 5%" }}
                >
                  {/* Step 1 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    <img
                      src={step1}
                      alt="Step 1"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      01 <br />
                      <strong>At Home Consult</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 1 and 2 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 2 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "#000",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                    }}
                  >
                    <img
                      src={step2}
                      alt="Step 2"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      02 <br />
                      <strong>Measurements & Quotes</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 2 and 3 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 3 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(2deg)",
                    }}
                  >
                    <img
                      src={step3}
                      alt="Step 3"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      03 <br />
                      <strong>Booking Confirmation</strong>
                    </h5>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  style={{ padding: "0 5%" }}
                >
                  {/* Step 1 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    <img
                      src={step1}
                      alt="Step 1"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      01 <br />
                      <strong>At Home Consult</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 1 and 2 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 2 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "#000",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                    }}
                  >
                    <img
                      src={step2}
                      alt="Step 2"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      02 <br />
                      <strong>Measurements & Quotes</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 2 and 3 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 3 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(2deg)",
                    }}
                  >
                    <img
                      src={step3}
                      alt="Step 3"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      03 <br />
                      <strong>Booking Confirmation</strong>
                    </h5>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  style={{ padding: "0 5%" }}
                >
                  {/* Step 1 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    <img
                      src={step1}
                      alt="Step 1"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      01 <br />
                      <strong>At Home Consult</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 1 and 2 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 2 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "#000",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                    }}
                  >
                    <img
                      src={step2}
                      alt="Step 2"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      02 <br />
                      <strong>Measurements & Quotes</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 2 and 3 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 3 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(2deg)",
                    }}
                  >
                    <img
                      src={step3}
                      alt="Step 3"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      03 <br />
                      <strong>Booking Confirmation</strong>
                    </h5>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  style={{ padding: "0 5%" }}
                >
                  {/* Step 1 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    <img
                      src={step1}
                      alt="Step 1"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      01 <br />
                      <strong>At Home Consult</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 1 and 2 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 2 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "#000",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                    }}
                  >
                    <img
                      src={step2}
                      alt="Step 2"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      02 <br />
                      <strong>Measurements & Quotes</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 2 and 3 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 3 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(2deg)",
                    }}
                  >
                    <img
                      src={step3}
                      alt="Step 3"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      03 <br />
                      <strong>Booking Confirmation</strong>
                    </h5>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  style={{ padding: "0 5%" }}
                >
                  {/* Step 1 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    <img
                      src={step1}
                      alt="Step 1"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      01 <br />
                      <strong>At Home Consult</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 1 and 2 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 2 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "#000",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                    }}
                  >
                    <img
                      src={step2}
                      alt="Step 2"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      02 <br />
                      <strong>Measurements & Quotes</strong>
                    </h5>
                  </div>

                  {/* Arrow Between 2 and 3 */}
                  <img
                    src={arrowicon} // replace with your arrow icon path
                    alt="arrow"
                    style={{ width: "70px", margin: "0 15px" }}
                  />

                  {/* Step 3 */}
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "red",
                      borderRadius: "25px",
                      padding: "20px",
                      color: "#fff",
                      transform: "rotate(2deg)",
                    }}
                  >
                    <img
                      src={step3}
                      alt="Step 3"
                      style={{ width: "100%", borderRadius: "15px" }}
                    />
                    <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
                      03 <br />
                      <strong>Booking Confirmation</strong>
                    </h5>
                  </div>
                </div>
              </Carousel.Item>
            </Carousel>

            {/* Custom styles for arrows and line indicators */}
            <style>{`
    .how-carousel .carousel-control-prev,
    .how-carousel .carousel-control-next {
      width: 40px;
      height: 40px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      opacity: 1;
    }
    .how-carousel .carousel-control-prev {
      left: -10px;
    }
    .how-carousel .carousel-control-next {
      right: -10px;
    }
  .custom-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: #e60000; /* red color arrow */
}
.carousel-control-prev-icon.custom-icon {
  mask-image: url("data:image/svg+xml;utf8,<svg fill='red' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 16 16'><path d='M11 1L3 8l8 7' stroke='red' stroke-width='2' fill='none'/></svg>");
}
.carousel-control-next-icon.custom-icon {
  mask-image: url("data:image/svg+xml;utf8,<svg fill='red' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 16 16'><path d='M5 1l8 7-8 7' stroke='red' stroke-width='2' fill='none'/></svg>");
}


    .carousel-indicators {
      bottom: -63px;
    }
    .carousel-indicators [data-bs-target] {
      width: 30px;
      height: 4px;
      border-radius: 5px;
      background-color: #ccc;
      margin: 0 5px;
    }
    .carousel-indicators .active {
      background-color: red;
      width: 40px;
    }
  `}</style>
          </div>
        </div>
      </div>
      <div
        className="d-block d-lg-none"
        style={{
          background: "#fff",
          padding: "30px 15px",
          textAlign: "center",
        }}
      >
        {/* Section Title */}
        <h3
          style={{
            fontWeight: 700,
            fontSize: "20px",
            marginBottom: "20px",
          }}
        >
          Our Process
        </h3>

        <div
          style={{
            overflowX: "auto",
            display: "flex",
            gap: "16px",
            paddingLeft: "15px",
            scrollSnapType: "x mandatory",
          }}
        >
          {[
            { img: step1, bg: "red", label: "01", title: "At Home Consult" },
            {
              img: step2,
              bg: "#000",
              label: "02",
              title: "Measurements & Quotes",
            },
            {
              img: step3,
              bg: "red",
              label: "03",
              title: "Booking Confirmation",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                minWidth: "85%",
                flexShrink: 0,
                scrollSnapAlign: "start",
                backgroundColor: item.bg,
                borderRadius: "25px",
                padding: "20px",
                color: "#fff",
              }}
            >
              <img
                src={item.img}
                alt={`Step ${item.label}`}
                style={{ width: "100%", borderRadius: "15px" }}
              />
              <h5 style={{ marginTop: "20px", fontSize: "16px" }}>
                {item.label} <br />
                <strong>{item.title}</strong>
              </h5>
            </div>
          ))}
        </div>

        {/* Indicators (optional, static) */}
        <div className="d-flex gap-2 mt-3" style={{ justifyContent: "center" }}>
          <div
            style={{
              width: "30px",
              height: "4px",
              backgroundColor: "red",
              borderRadius: "4px",
            }}
          ></div>
          <div
            style={{
              width: "20px",
              height: "4px",
              backgroundColor: "#ccc",
              borderRadius: "4px",
            }}
          ></div>
          <div
            style={{
              width: "20px",
              height: "4px",
              backgroundColor: "#ccc",
              borderRadius: "4px",
            }}
          ></div>
        </div>
      </div>

      {/* trained profestional */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundImage: `url(${bgProfessional})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "30px",
            padding: "60px",
            width: "1200px",
            // maxWidth: '1200px',
            margin: "40px auto",
            marginTop: "-1%",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "500px" }}>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                marginBottom: "10px",
                whiteSpace: "nowrap",
              }}
            >
              Top trained professionals, <br />
              top quality work
            </h2>
            <p
              style={{
                fontSize: "18px",
                margin: "10px 0 0",
                fontWeight: "bold",
              }}
            >
              We only choose the finest painters
            </p>
            <p
              style={{
                color: "#ff4d4f",
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "6px",
              }}
            >
              0.1% selection rate
            </p>

            <ul style={{ marginTop: "24px", listStyle: "none", padding: 0 }}>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={dotStyle}></span>
                300+ hrs. Intensive training
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={dotStyle}></span>
                5-step background check
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <span style={dotStyle}></span>
                On time completion
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundImage: `url(${bgProfessionalimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "30px",
            padding: "60px 20px",
            margin: "40px auto",
            marginTop: "-1%",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "353px",
            height: "636px",
          }}
        >
          <div style={{ maxWidth: "100%", marginTop: "-87%" }}>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "bold",
                marginBottom: "10px",
                lineHeight: "1.3",
                whiteSpace: "normal",
              }}
            >
              Top Trained <br /> Professionals, <br /> Top Quality Work
            </h2>

            <p
              style={{
                fontSize: "16px",
                margin: "10px 0 0",
                fontWeight: "bold",
              }}
            >
              We only choose the finest painters
            </p>
            <p
              style={{
                color: "#ff4d4f",
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "6px",
              }}
            >
              0.1% selection rate
            </p>

            <ul style={{ marginTop: "24px", listStyle: "none", padding: 0 }}>
              {[
                "300+ hrs. Intensive training",
                "5-step background check",
                "On time completion",
              ].map((text, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: index !== 2 ? "10px" : "0",
                    fontSize: "14px",
                  }}
                >
                  <span style={dotStyle}></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* testimonals */}
      <div className="d-none d-lg-block">
        <div
          style={{
            background: "#fff",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          {/* Title Section */}
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              marginBottom: "10px",
              position: "relative",
              display: "inline-block",
            }}
          >
            Testimonials
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "35px",
                width: "180px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          <p
            style={{
              fontWeight: 600,
              fontSize: "20px",
              marginTop: "20px",
              marginBottom: "40px",
            }}
          >
            What People Say About Us
          </p>
          <div style={{ margin: "0 20px" }}>
            {/* Carousel */}
            <Carousel
              indicators={true}
              controls={false}
              interval={6000}
              className="testimonial-carousel"
            >
              <Carousel.Item>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    padding: "0 5%",
                    gap: "30px",
                    flexWrap: "nowrap", // prevents wrapping
                    overflowX: "hidden", // allows horizontal scroll on smaller screens
                  }}
                >
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx}>
                      <video
                        src={testimonialVideo}
                        width="644"
                        height="412"
                        controls
                        muted
                        preload="auto"
                        style={{
                          objectFit: "cover",
                          borderRadius: "20px",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Carousel.Item>

              <Carousel.Item>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    padding: "0 5%",
                    gap: "30px",
                    flexWrap: "nowrap",
                    overflowX: "hidden",
                  }}
                >
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx}>
                      <video
                        src={testimonialVideo}
                        width="644"
                        height="412"
                        controls
                        muted
                        preload="auto"
                        style={{
                          objectFit: "cover",
                          borderRadius: "20px",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            </Carousel>
          </div>

          {/* Custom Styling */}
          <style>{`
       .testimonial-carousel .carousel-indicators {
         bottom: -60px;
       }
       .testimonial-carousel .carousel-indicators [data-bs-target] {
         width: 30px;
         height: 4px;
         border-radius: 5px;
         background-color: #ccc;
         margin: 0 5px;
       }
       .testimonial-carousel .carousel-indicators .active {
         background-color: red;
         width: 40px;
       }
     `}</style>
        </div>
      </div>
      <div
        className="d-block d-lg-none"
        style={{
          background: "#fff",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        {/* Title Section */}
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
            marginBottom: "10px",
            position: "relative",
            display: "inline-block",
          }}
        >
          Testimonials
          <img
            src={vectoricon}
            alt=""
            style={{
              position: "absolute",
              bottom: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "130px",
              height: "auto",
              pointerEvents: "none",
            }}
          />
        </h2>

        <p
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginTop: "2px",
            // marginBottom: '30px'
          }}
        >
          What People Say About Us
        </p>
        <Swiper
          slidesPerView={1.2}
          spaceBetween={10}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          style={{ paddingLeft: "20px", marginBottom: "20px" }}
        >
          {videos.map((vid, index) => (
            <SwiperSlide key={index}>
              <video
                src={vid}
                height="220"
                controls
                muted
                style={{
                  borderRadius: "15px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Indicator Bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {videos.map((_, index) => (
            <div
              key={index}
              style={{
                width: activeIndex === index ? "30px" : "20px",
                height: "4px",
                backgroundColor: activeIndex === index ? "red" : "#ccc",
                borderRadius: "5px",
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>

        {/* Indicator Styling */}
        <style>{`
    .testimonial-carousel-mobile .carousel-inner {
      overflow: visible;
    }
    .testimonial-carousel-mobile .carousel-item {
      transition: transform 0.5s ease-in-out;
    }
    .testimonial-carousel-mobile .carousel-indicators {
      bottom: -35px;
    }
    .testimonial-carousel-mobile .carousel-indicators [data-bs-target] {
      width: 20px;
      height: 4px;
      border-radius: 5px;
      background-color: #ccc;
      margin: 0 5px;
    }
    .testimonial-carousel-mobile .carousel-indicators .active {
      background-color: red;
      width: 30px;
    }
  `}</style>
      </div>

      {/* ourrecent projects */}
      <div className="d-none d-lg-block">
        <div
          style={{
            background: "#fff",
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          {/* Heading */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#111",
                position: "relative",
                fontFamily: "Poppins, sans-serif",
                display: "inline-block",
              }}
            >
              Our Recent Projects
              <img
                src={vectoricon}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "80px",
                  width: "130px",
                  height: "auto",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </h2>

            <Button
              variant="outline-danger"
              style={{
                fontWeight: 600,
                borderRadius: "30px",
                padding: "8px 24px",
                fontSize: "14px",
              }}
            >
              EXPLORE ALL
            </Button>
          </div>
          <div style={{ margin: "0 10px" }}>
            {/* Carousel */}
            <Carousel
              indicators={true}
              controls={true}
              interval={3000}
              className="recent-carousel"
              nextIcon={
                <span className="carousel-control-next-icon custom-icon" />
              }
              prevIcon={
                <span className="carousel-control-prev-icon custom-icon" />
              }
            >
              <Carousel.Item>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <img
                    src={img1}
                    alt="Project 1"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img2}
                    alt="Project 2"
                    className="rounded"
                    style={{
                      width: "350px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img3}
                    alt="Project 3"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <img
                    src={img2}
                    alt="Project 2"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img3}
                    alt="Project 3"
                    className="rounded"
                    style={{
                      width: "350px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img1}
                    alt="Project 1"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <img
                    src={img2}
                    alt="Project 2"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img3}
                    alt="Project 3"
                    className="rounded"
                    style={{
                      width: "350px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img1}
                    alt="Project 1"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <img
                    src={img1}
                    alt="Project 1"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img2}
                    alt="Project 2"
                    className="rounded"
                    style={{
                      width: "350px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img3}
                    alt="Project 3"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <img
                    src={img1}
                    alt="Project 1"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img2}
                    alt="Project 2"
                    className="rounded"
                    style={{
                      width: "350px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src={img3}
                    alt="Project 3"
                    className="rounded"
                    style={{
                      width: "380px",
                      height: "504px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel.Item>
            </Carousel>
          </div>
          <style>{`
    .carousel-indicators {
      bottom: -40px;
    }
  
    .carousel-indicators [data-bs-target] {
      width: 24px;
      height: 4px;
      border-radius: 5px;
      margin: 0 5px;
      background-color: #ccc;
      transition: all 0.3s ease;
      opacity: 1;
    }
  
    .carousel-indicators .active {
      background-color: red;
      width: 30px;
    }
  
    .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-image: none !important;
  }
  
    /* Updated Control Styles */
    .recent-carousel .carousel-control-prev,
    .recent-carousel .carousel-control-next {
      width: 40px;
      height: 40px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #fff;
      border-radius: 50%;
      opacity: 1;
      z-index: 5;
      box-shadow: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    /* Center Prev to 1st Image Left */
    .recent-carousel .carousel-control-prev {
      left: calc(50% - 600px); /* Assuming each image is 350px + 2 * 20px gap */
    }
  
    /* Center Next to 3rd Image Right */
    .recent-carousel .carousel-control-next {
      right: calc(50% - 600px);
    }
  
  .custom-icon {
    background-color: #ff4d4d; /* <-- Light red */
    width: 20px;
    height: 20px;
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
  }
  
  
    .carousel-control-prev-icon.custom-icon {
      mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
      -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
    }
  
    .carousel-control-next-icon.custom-icon {
      mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
      -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
    }
  `}</style>
        </div>
      </div>
      <div
        className="d-block d-lg-none"
        style={{ background: "#fff", padding: "30px 15px" }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "30px", position: "relative" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#111",
              fontFamily: "Poppins, sans-serif",
              marginBottom: "25px",
              textAlign: "left",
            }}
          >
            Our Recent Projects
          </h2>
          <img
            src={vectoricon}
            alt="underline"
            style={{
              position: "absolute",
              bottom: "-11px",
              left: "140px",
              width: "100px",
              height: "auto",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Custom Scrollable Carousel */}
        <div
          className="custom-scroll-carousel"
          style={{
            overflowX: "auto",
            display: "flex",
            gap: "16px",
            paddingBottom: "8px",
            scrollSnapType: "x mandatory",
            paddingLeft: "15px",
          }}
        >
          {[img2, img2, img3].map((img, index) => (
            <div
              key={index}
              style={{
                minWidth: "80%",
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            >
              <img
                src={img}
                alt={`Project ${index + 1}`}
                style={{
                  width: "100%",
                  height: "300px", // Reduced height
                  borderRadius: "20px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>

        {/* Indicators + Button Row */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex gap-2" style={{ marginLeft: "8%" }}>
            <div
              style={{
                width: "14px",
                height: "4px",
                backgroundColor: "#ff0000",
                borderRadius: "4px",
              }}
            ></div>
            <div
              style={{
                width: "14px",
                height: "4px",
                backgroundColor: "#ccc",
                borderRadius: "4px",
              }}
            ></div>
            <div
              style={{
                width: "14px",
                height: "4px",
                backgroundColor: "#ccc",
                borderRadius: "4px",
              }}
            ></div>
          </div>
          <Button
            variant="outline-danger"
            style={{
              fontWeight: 600,
              borderRadius: "30px",
              padding: "6px 16px",
              fontSize: "12px",
            }}
          >
            EXPLORE ALL
          </Button>
        </div>
      </div>

      {/* faq */}
      <div className="d-none d-lg-block">
        <div
          style={{
            padding: "60px 20px",
            width: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "40px",
              position: "relative",

              display: "inline-block",
            }}
          >
            Frequently Asked Questions
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "300px",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          {/* FAQ Items */}
          <div style={{ marginTop: "40px" }}>
            {faqData.map((question, index) => (
              <div
                key={index}
                onClick={() => toggle(index)}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  padding: "16px 24px",
                  boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: "16px" }}>
                    {question}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p style={{ marginTop: "12px", color: "#555" }}>
                    {/* You can customize this text per FAQ */}
                    Yes, all our painters are trained through a certified
                    onboarding and background verification process.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-block d-lg-none">
        <div
          style={{
            padding: "60px 20px",
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Heading */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Frequently Asked Questions
            </h2>
            <img
              src={vectoricon}
              alt="underline"
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "130px",
                height: "auto",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* FAQ List */}
          <div style={{ marginTop: "40px" }}>
            {faqData.map((question, index) => (
              <div
                key={index}
                onClick={() => toggle(index)}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  padding: "16px 24px",
                  boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "left",
                    }}
                  >
                    {question}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p
                    style={{
                      marginTop: "12px",
                      color: "#555",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                  >
                    {/* You can replace this with real answers per question if needed */}
                    Yes, all our painters are trained through a certified
                    onboarding and background verification process.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* reviewa */}
      <div className="d-none d-lg-block">
        <div
          style={{
            background: "#f4e6ff",
            padding: "60px 20px",
            borderRadius: "30px",
            width: "1200px",
            textAlign: "center",
            // maxWidth: '1200px',
            margin: "40px auto",
          }}
        >
          {/* Heading */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "40px",
              position: "relative",
              display: "inline-block",
            }}
          >
            Customer Reviews
            <img
              src={vectoricon}
              alt=""
              style={{
                position: "absolute",
                bottom: "-14px",
                left: "100px",
                width: "130px",
                height: "auto",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          {/* Rating and Media */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              textAlign: "",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ flex: "1 1 260px", padding: "10px" }}>
              <h1 style={{ fontSize: "40px", margin: "0", fontWeight: "bold" }}>
                4.94{" "}
                <span style={{ fontSize: "16px", fontWeight: "normal" }}>
                  /5
                </span>
              </h1>
              <div
                style={{ margin: "10px 0", fontSize: "16px", color: "#111" }}
              >
                ⭐️⭐️⭐️⭐️⭐️
                <div style={{ fontSize: "14px", color: "#777" }}>
                  2,452 Ratings
                </div>
              </div>

              {/* Rating breakdown */}
              <div style={{ marginTop: "20px" }}>
                {[5, 4, 3, 2, 1].map((star, idx) => {
                  const ratings = { 5: 1524, 4: 235, 3: 152, 2: 95, 1: 20 };
                  const total = 2452;
                  const width = (ratings[star] / total) * 100;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "13px",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ width: "20px" }}>{star}★</span>
                      <div
                        style={{
                          flex: 1,
                          margin: "0 10px",
                          background: "#eee",
                          height: "6px",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${width}%`,
                            background: "#fbbc04",
                            height: "100%",
                          }}
                        />
                      </div>
                      <span style={{ minWidth: "30px", textAlign: "right" }}>
                        {ratings[star]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ flex: "2", padding: "10px", textAlign: "center" }}>
              <h3 style={{ fontWeight: "600" }}>Customer Photos And Videos</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
                  // 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80'
                ].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Customer media"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* All Reviews */}
          <h3
            style={{
              textAlign: "center",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            All Reviews
          </h3>

          {reviewers.map((person, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "15px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <img
                src={person.img}
                alt={person.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1, textAlign: "left" }}>
                <h4 style={{ margin: "0 0 4px", fontSize: "16px" }}>
                  {person.name}
                </h4>

                <p style={{ marginTop: "10px", fontSize: "14px" }}>
                  {person.review}
                </p>
              </div>
              <div style={{ borderColor: "#fff" }}>⭐️⭐️⭐️⭐️⭐️</div>
            </div>
          ))}

          {/* Load More Button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              style={{
                backgroundColor: "#fff",
                color: "#e60000",
                border: "1px solid #e60000",
                padding: "10px 24px",
                borderRadius: "999px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              LOAD MORE
            </button>
          </div>
        </div>
      </div>

      <SlotSelectionModal
        show={showSlotModal}
        onClose={handleCloseSlotModal}
        handleSelectSlot={handleSelectSlot}
        fetchAvailableSlots={fetchAvailableSlots}
        type="booking"
      />

      {showAddress && (
        <AddressPickerModal
          show={showAddress}
          onClose={() => setShowAddress(false)}
          initialLatLng={{
            lat: addressPickerCfg.lat || 12.9716,
            lng: addressPickerCfg.lng || 77.5946,
          }}
          initialAddress={addressPickerCfg.address || ""}
          initialHouseFlat={addressPickerCfg.houseNumber || ""}
          initialLandmark={addressPickerCfg.landmark || ""}
          initialCity={addressPickerCfg.city || ""}
          onSave={handleSaveAddressFromModal}
        />
      )}
    </>
  );
};

const dotStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "#fff", // center white
  border: "6px solid #6c7b7c", // outer ring
  marginRight: "12px",
  display: "inline-block",
};

export default Services;

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Carousel, Form, Modal } from "react-bootstrap";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import serviceBg from "../assets/service-bg.svg";
// import exterior from "../assets/exterior.png";
// import map from "../assets/map.png";
// import searchLocation from "../assets/search-location.png";
// import woodpolish from "../assets/woodpolish.png";
// import texture from "../assets/texture.png";
// import waterproofing from "../assets/waterproofing.png";
// import bgImage from "../assets/quality-bg.png";
// import paintIcon from "../assets/paint-icon.svg";
// import ontime from "../assets/ontime.png";
// import warrantyIcon from "../assets/warranty-icon.png";
// import postservice from "../assets/postservice.png";
// import quoteIcon from "../assets/quote-icon.png";
// import freeinsurance from "../assets/freeinsurance.png";
// import wallpaperBanner from "../assets/wallpaper-banner.png";
// import checkIcon from "../assets/check-green.png";
// import crossIcon from "../assets/cross-red.png";
// import homjeeLogo from "../assets/logohomjee.png";
// import bgBrands from "../assets/brands-bg.png";
// import logoBerger from "../assets/brand-berger.png";
// import logoDulux from "../assets/brand-dulux.png";
// import logoAsian from "../assets/brand-asianpaints.png";
// import logoOpus from "../assets/brand-opus.png";
// import step1 from "../assets/step1.png";
// import step2 from "../assets/step2.png";
// import step3 from "../assets/step3.png";
// import arrowicon from "../assets/arrowicon.png";
// import testimonialVideo from "../assets/testimonial.mp4";
// import bgProfessional from "../assets/pro-bg.png";
// import img1 from "../assets/img1.png";
// import img2 from "../assets/img2.png";
// import img3 from "../assets/img3.png";
// import vectoricon from "../assets/vectoricon.png";
// import paintingservice from "../assets/paintingservice.png";
// import transperancy from "../assets/transperancy.png";
// import wallpaperBannerimage from "../assets/wallpaperBannerimage.png";
// import bgBrandsimage from "../assets/bgBrandsimage.png";
// import bgProfessionalimage from "../assets/bgProfessionalimage.png";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { getRequest, postRequest, putRequest } from "../ApiService/apiHelper";
// import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";
// import { useAddressContext } from "../utils/AddressContext";
// import Autocomplete from "react-google-autocomplete";
// import SlotSelectionModal from "./SlotSelectionModal";
// import { useSelectedSlotContext } from "../utils/SlotContext";
// import GlobalLoader from "../utils/GlobalLoader";
// import AddressPickerModal from "../components/AddressPickerModal";

// const getStoredUser = () => {
//   try {
//     const raw = sessionStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch (e) {
//     console.error("getStoredUser parse error", e);
//     return null;
//   }
// };

// const setStoredUser = (user) => {
//   try {
//     if (!user) sessionStorage.removeItem("user");
//     else sessionStorage.setItem("user", JSON.stringify(user));
//   } catch (e) {
//     console.error("setStoredUser error", e);
//   }
// };

// const Services = () => {
//   const navigate = useNavigate();
//   // const activeIndex = 0;
//   const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [responseLoader, setResponseLoader] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [userName, setUserName] = useState("");
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [joinedOtp, setJoinedOTP] = useState(null);
//   const [otpValue, setOtpValue] = useState(null);

//   const videos = [testimonialVideo, testimonialVideo, testimonialVideo];
//   const [houseNumber, setHouseNumber] = useState("");
//   const [landmark, setLandmark] = useState("");
//   const [locationRequested, setLocationRequested] = useState(false);
//   const [isNewUser, setIsNewUser] = useState(false);

//   const [mapAddress, setMapAddress] = useState("");
//   const [userAddress, setUserAddress] = useState(null);
//   const { addressDataContext, setAddressDataContext } = useAddressContext();
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [currentUser, setCurrentUser] = useState(() => getStoredUser());
//   const userId = currentUser?._id; // ✅ use this everywhere

//   const SERVICE_TYPE = "house_painting"; // <-- change dynamically if reused

//   // const isNewUser = sessionStorage.getItem("isNewUser") === "true";
//   const [showSlotModal, setShowSlotModal] = useState(false);
//   const { setSelectedSlot } = useSelectedSlotContext();

//   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [cityName, setCityName] = useState(null);

//   const [showSearchBarOptions, setShowSearchBarOptions] = useState(false);
//   const [showOptionOpoup, setShowOptionOpoup] = useState(false);

//   const [showAddress, setShowAddress] = useState(false);
//   const [addressPickerCfg, setAddressPickerCfg] = useState({
//     address: "",
//     houseNumber: "",
//     landmark: "",
//     lat: null,
//     lng: null,
//     city: "",

//     allowSearch: false,
//     allowMapPick: false,

//     // ✅ NEW
//     disableHouseFlat: false,
//     disableLandmark: false,
//     primaryCtaLabel: "Save & Proceed",

//     showChangeButton: false,
//   });

//   console.log("isNewUser", isNewUser);
//   const inputRefs = useRef([]);
//   const openAddressAfterOptionCloseRef = useRef(false);

//   // const formattedAddress = "Channasandra, Srinivaspura, Bengaluru, Karnataka 560060, India";

//   useEffect(() => {
//     if (mapAddress) {
//       const addressParts = mapAddress.split(",");
//       const city =
//         addressParts.length >= 3
//           ? addressParts[addressParts.length - 3].trim()
//           : "";
//       console.log("extracted city name:", city);
//       setCityName(city);
//     }
//   }, [mapAddress]); // <-- Reacts to changes in mapAddress

//   // console.log("cityName", cityName);

//   // useEffect(() => {
//   //   if (inputRefs.current[0]) {
//   //     inputRefs.current[0].focus();
//   //   }
//   // }, []);

//   //   const handleProceedClick = () => {
//   //   setShowModal(true);
//   // };
//   const handleCloseModal = () => {
//     setShowModal(false);

//     setOtp(["", "", "", ""]);
//   };

//   //  const handleSubmitOTP = () => {
//   //   setShowModal(false);
//   //  navigate('/checkout', { state: { phoneNumber, openAddressModal: true } });
//   //   window.location.reload();
//   // };

//   const formData = {
//     mobileNumber: phoneNumber,
//     userName: userName,
//   };

//   const handleProceedClick = async (e) => {
//     setResponseLoader(true);
//     e.preventDefault();
//     if (!phoneNumber || !userName) {
//       alert("Please enter your Name and Phone number");
//       setResponseLoader(false);
//       return;
//     }
//     try {
//       const result = await postRequest(
//         API_ENDPOINTS.LOGIN_WITH_MOBILE,
//         formData
//       );
//       setResponseLoader(false);
//       console.log("Login Success", result);
//       alert(result.message || "Login successful");
//       setOtpValue(result.otp);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Login failed:", error);
//     } finally {
//       setResponseLoader(false);
//     }
//   };

//   const verifyOTP = async () => {
//     try {
//       console.log("=== OTP VERIFICATION START ===");

//       if (!joinedOtp || joinedOtp.length !== 4) {
//         alert("Please enter valid OTP");
//         return;
//       }

//       const data = { otp: joinedOtp, mobileNumber: phoneNumber, userName };
//       const result = await postRequest(API_ENDPOINTS.VERIFY_OTP, data);

//       console.log("OTP Verification Result:", result);
//       alert(result.message || "OTP verified successfully");

//       if (result?.data) {
//         setStoredUser(result.data);
//         setCurrentUser(result.data);
//       }

//       // ✅ Store user in session
//       sessionStorage.setItem("user", JSON.stringify(result.data));

//       // ✅ Get isNewUser correctly
//       const isNewUserFlag = Boolean(result.isNewUser);
//       console.log("isNewUser from backend:", isNewUserFlag);

//       sessionStorage.setItem("isNewUser", String(isNewUserFlag));
//       setIsNewUser(isNewUserFlag);

//       setOtp(["", "", "", ""]);
//       setShowModal(false);

//       // ✅ NEW USER FLOW
//       if (isNewUserFlag) {
//         console.log("👤 NEW USER: Opening address modal with current location");
//         try {
//           const loc = await getCurrentLocationDraft();
//           console.log("📍 Current location fetched:", loc);

//           // ✅ NEW USER: Current location locked, house/landmark editable
//           setAddressPickerCfg({
//             address: loc.address || "",
//             houseNumber: "",
//             landmark: "",
//             lat: Number(loc.latitude) || 12.9716,
//             lng: Number(loc.longitude) || 77.5946,
//             city: loc.city || "",
//             allowSearch: false,
//             allowMapPick: false,
//             disableHouseFlat: false,
//             disableLandmark: false,
//             showChangeButton: false,
//             primaryCtaLabel: "Save & Proceed",
//           });

//           setShowAddress(true);
//         } catch (e) {
//           console.error("Failed to get current location:", e);
//           alert("Unable to fetch current location");

//           // Fallback: Allow search
//           setAddressPickerCfg({
//             address: "",
//             houseNumber: "",
//             landmark: "",
//             lat: null,
//             lng: null,
//             city: "",
//             allowSearch: true,
//             allowMapPick: true,
//             disableHouseFlat: false,
//             disableLandmark: false,
//             showChangeButton: false,
//             primaryCtaLabel: "Save & Proceed",
//           });
//           setShowAddress(true);
//         }
//       }
//       // ✅ EXISTING USER FLOW
//       else {
//         console.log("👥 EXISTING USER: Fetching saved address");
//         const userId = result?.data?._id;

//         if (!userId) {
//           console.error("No user ID found");
//           alert("User information not found");
//           return;
//         }

//         // Fetch saved address from backend
//         const savedAddress = await fetchUserAddress(userId);
//         console.log("Fetched saved address:", savedAddress);

//         if (
//           savedAddress?.address &&
//           savedAddress?.latitude &&
//           savedAddress?.longitude
//         ) {
//           console.log("✅ Found saved address, opening locked modal");

//           // ✅ EXISTING USER: Show saved address locked
//           setAddressPickerCfg({
//             address: savedAddress.address || "",
//             houseNumber: savedAddress.houseNumber || "",
//             landmark: savedAddress.landmark || "",
//             lat: Number(savedAddress.latitude),
//             lng: Number(savedAddress.longitude),
//             city: savedAddress.city || "",
//             allowSearch: false,
//             allowMapPick: false,
//             disableHouseFlat: true,
//             disableLandmark: true,
//             showChangeButton: true,
//             primaryCtaLabel: "Proceed",
//           });

//           // Store in session for backup
//           sessionStorage.setItem(
//             "selectedAddress",
//             JSON.stringify(savedAddress)
//           );
//           setShowAddress(true);
//         } else {
//           console.log("❌ No saved address found, opening searchable modal");

//           // No saved address - allow search
//           setAddressPickerCfg({
//             address: "",
//             houseNumber: "",
//             landmark: "",
//             lat: null,
//             lng: null,
//             city: "",
//             allowSearch: true,
//             allowMapPick: true,
//             disableHouseFlat: false,
//             disableLandmark: false,
//             showChangeButton: false,
//             primaryCtaLabel: "Save & Proceed",
//           });
//           setShowAddress(true);
//         }
//       }
//     } catch (error) {
//       console.error("verifyOTP error:", error);
//       alert(error?.message || "Invalid OTP");
//     }
//   };

//   const ResendOTP = async () => {
//     setOtp(["", "", "", ""]);
//     try {
//       const result = await postRequest(API_ENDPOINTS.RESEND_OTP, formData);
//       console.log("OTP Re-sent", result);
//       alert(result.message || "OTP Re-sent");
//       setOtpValue(result.otp);
//     } catch (error) {
//       console.error("OTP Re-sent Error:", error);
//       // NotificationManager.error(error.message || "Login failed");
//     }
//   };

//   const getCurrentLocationDraft = () =>
//     new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error("Geolocation not supported"));
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

//           try {
//             const response = await fetch(geocodingUrl);
//             const data = await response.json();

//             if (data.status === "OK" && data.results.length > 0) {
//               const first = data.results[0];
//               const formatted = first.formatted_address;

//               // ✅ city extract (better than split)
//               const comps = first.address_components || [];
//               const cityComp =
//                 comps.find((c) => c.types?.includes("locality")) ||
//                 comps.find((c) =>
//                   c.types?.includes("administrative_area_level_2")
//                 );

//               resolve({
//                 address: formatted,
//                 latitude,
//                 longitude,
//                 city: cityComp?.long_name || "",
//               });
//               return;
//             }

//             reject(new Error("Unable to resolve address"));
//           } catch (e) {
//             reject(e);
//           }
//         },
//         (err) => reject(err),
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//       );
//     });

//   const fetchUserAddress = async (userId) => {
//     try {
//       if (!userId) return null;

//       const response = await getRequest(
//         `${API_ENDPOINTS.GET_ADDRESS}${userId}`
//       );

//       // Check if the address is in `savedAddress` or `address` field
//       const addressData = response?.address || response?.savedAddress;

//       if (addressData) {
//         const addrObj = {
//           uniqueCode:
//             addressData.uniqueCode ||
//             `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//           address: addressData.address,
//           houseNumber: addressData.houseNumber || "",
//           landmark: addressData.landmark || "",
//           latitude: Number(addressData.latitude),
//           longitude: Number(addressData.longitude),
//           city: addressData.city || "",
//         };

//         setAddressDataContext(addrObj);
//         sessionStorage.setItem("selectedAddress", JSON.stringify(addrObj));
//         return addrObj;
//       }

//       return null;
//     } catch (error) {
//       console.error("fetchUserAddress error:", error?.response || error);
//       return null;
//     }
//   };
//   useEffect(() => {
//     if (!userId) return;
//     fetchUserAddress(userId);
//   }, [userId]);

//   console.log("mapAddress", mapAddress);

//   const handleSaveAddressFromModal = async (picked) => {
//     try {
//       console.log("💾 Saving address from modal:", picked);

//       // ✅ If "Proceed" button was clicked (existing user with saved address)
//       if (addressPickerCfg.primaryCtaLabel === "Proceed") {
//         console.log("🚀 Proceeding with existing address");

//         const existingAddress = {
//           uniqueCode: `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//           address: addressPickerCfg.address,
//           houseNumber: addressPickerCfg.houseNumber,
//           landmark: addressPickerCfg.landmark,
//           latitude: addressPickerCfg.lat,
//           longitude: addressPickerCfg.lng,
//           city: addressPickerCfg.city,
//         };

//         // Store in context and session
//         setAddressDataContext(existingAddress);
//         sessionStorage.setItem(
//           "selectedAddress",
//           JSON.stringify(existingAddress)
//         );
//         setShowAddress(false);

//         // Proceed to slot selection
//         await handleProceedToSlotSelection();
//         return;
//       }

//       // ✅ For new/changed addresses
//       if (!picked?.houseNumber?.trim() && !addressPickerCfg.disableHouseFlat) {
//         alert("House/Flat Number is required");
//         return;
//       }

//       const uniqueCode = `ADDR-${Date.now()}-${Math.floor(
//         Math.random() * 1000
//       )}`;
//       const addressObj = {
//         uniqueCode,
//         address: picked.address || addressPickerCfg.address,
//         houseNumber: addressPickerCfg.disableHouseFlat
//           ? addressPickerCfg.houseNumber
//           : picked.houseNumber?.trim() || "",
//         landmark: addressPickerCfg.disableLandmark
//           ? addressPickerCfg.landmark
//           : picked.landmark?.trim() || "",
//         latitude: Number(picked.lat || addressPickerCfg.lat),
//         longitude: Number(picked.lng || addressPickerCfg.lng),
//         city: picked.city || addressPickerCfg.city || "",
//       };

//       console.log("📝 Address to save:", addressObj);

//       // Save to backend for existing users
//       if (currentUser?._id) {
//         const payload = { savedAddress: addressObj };
//         console.log("📤 Saving to backend:", payload);

//         const result = await putRequest(
//           `${API_ENDPOINTS.SAVE_ADDRESS}${currentUser._id}`,
//           payload
//         );
//         console.log("✅ Save result:", result);
//       }

//       // Store in context and session
//       setAddressDataContext(addressObj);
//       sessionStorage.setItem("selectedAddress", JSON.stringify(addressObj));
//       setShowAddress(false);

//       // Proceed to slot selection
//       await handleProceedToSlotSelection();
//     } catch (error) {
//       console.error("💥 handleSaveAddressFromModal error:", error);
//       alert(error?.message || "Failed to save address");
//     }
//   };
//   useEffect(() => {
//     try {
//       const onStorage = (e) => {
//         if (e.key === "user") setCurrentUser(getStoredUser());
//       };
//       window.addEventListener("storage", onStorage);
//       return () => window.removeEventListener("storage", onStorage);
//     } catch (e) {
//       console.error("storage sync error", e);
//     }
//   }, []);

//   // useEffect(() => {
//   //   const cleanupFns = [];
//   //   let map, autocomplete, marker, geocoder;

//   //   const reverseGeocode = (pos, formattedAddrFromPlace = null) => {
//   //     if (!geocoderRef.current) return;

//   //     if (markerRef.current) markerRef.current.setPosition(pos);
//   //     if (mapRef.current) {
//   //       mapRef.current.setCenter(pos);
//   //       mapRef.current.setZoom(17);
//   //     }

//   //     if (formattedAddrFromPlace) {
//   //       setAddr(formattedAddrFromPlace);
//   //     }

//   //     // ✅ Always update latLng state
//   //     setLatLng({ lat: pos.lat, lng: pos.lng });

//   //     geocoderRef.current.geocode({ location: pos }, (results, status) => {
//   //       if (status === "OK" && results?.length) {
//   //         const formattedAddress = results[0].formatted_address;
//   //         const addressComponents = results[0].address_components;

//   //         let detectedCity = "";
//   //         let state = "";
//   //         let country = "";

//   //         for (const comp of addressComponents) {
//   //           const types = comp.types;
//   //           if (types.includes("locality")) detectedCity = comp.long_name;
//   //           else if (
//   //             types.includes("administrative_area_level_2") &&
//   //             !detectedCity
//   //           )
//   //             detectedCity = comp.long_name;
//   //           else if (types.includes("administrative_area_level_1"))
//   //             state = comp.long_name;
//   //           else if (types.includes("country")) country = comp.long_name;
//   //         }

//   //         if (detectedCity)
//   //           detectedCity =
//   //             detectedCity.charAt(0).toUpperCase() + detectedCity.slice(1);

//   //         if (!formattedAddrFromPlace) setAddr(formattedAddress);

//   //         // Set the city from reverse geocoding
//   //         setCity(detectedCity);
//   //       }
//   //     });
//   //   };

//   //   const init = async (posToUse) => {
//   //     await loadGoogleMaps();
//   //     geocoder = new window.google.maps.Geocoder();
//   //     geocoderRef.current = geocoder;

//   //     map = new window.google.maps.Map(mapRef.current, {
//   //       center: posToUse,
//   //       zoom: 16,
//   //       streetViewControl: false,
//   //       mapTypeControl: false,
//   //     });
//   //     mapRef.current = map;

//   //     marker = new window.google.maps.Marker({
//   //       map,
//   //       position: posToUse,
//   //       draggable: true,
//   //     });
//   //     markerRef.current = marker;

//   //     const autocomplete = new window.google.maps.places.Autocomplete(
//   //       inputRef.current,
//   //       { fields: ["formatted_address", "geometry"] }
//   //     );

//   //     const ensureAutocompleteZIndex = () => {
//   //       const containers = document.querySelectorAll(".pac-container");
//   //       containers.forEach((el) => {
//   //         el.style.zIndex = "100000";
//   //       });
//   //     };
//   //     ensureAutocompleteZIndex();

//   //     autocomplete.addListener("place_changed", () => {
//   //       const place = autocomplete.getPlace();
//   //       if (!place.geometry) return;
//   //       const pos = {
//   //         lat: place.geometry.location.lat(),
//   //         lng: place.geometry.location.lng(),
//   //       };

//   //       // ✅ Update state first
//   //       setLatLng(pos);

//   //       reverseGeocode(pos, place.formatted_address);
//   //     });

//   //     const observer = new MutationObserver(ensureAutocompleteZIndex);
//   //     observer.observe(document.body, {
//   //       childList: true,
//   //       subtree: true,
//   //     });

//   //     map.addListener("click", (e) => {
//   //       const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//   //       setLatLng(pos);
//   //       markerRef.current.setPosition(pos);
//   //       reverseGeocode(pos);
//   //     });

//   //     marker.addListener("dragend", () => {
//   //       const pos = {
//   //         lat: markerRef.current.getPosition().lat(),
//   //         lng: markerRef.current.getPosition().lng(),
//   //       };
//   //       setLatLng(pos);
//   //       reverseGeocode(pos);
//   //     });

//   //     if (!initialAddress) reverseGeocode(posToUse);
//   //     cleanupFns.push(() => observer.disconnect());
//   //   };

//   //   if (navigator.geolocation) {
//   //     navigator.geolocation.getCurrentPosition(
//   //       (position) => {
//   //         const currentPos = {
//   //           lat: position.coords.latitude,
//   //           lng: position.coords.longitude,
//   //         };
//   //         setLatLng(currentPos);
//   //         init(currentPos);
//   //       },
//   //       () => init(initialLatLng || { lat: 12.9716, lng: 77.5946 })
//   //     );
//   //   } else {
//   //     init(initialLatLng || { lat: 12.9716, lng: 77.5946 });
//   //   }
//   //   return () => {
//   //     cleanupFns.forEach((fn) => {
//   //       try {
//   //         fn();
//   //       } catch (err) {
//   //         console.warn("AddressPicker cleanup error:", err);
//   //       }
//   //     });
//   //   };
//   // }, [initialLatLng, initialAddress]);

//   const handlePhoneNumberChange = (e) => {
//     setPhoneNumber(e.target.value);
//   };

//   const handleOtpChange = (e, index) => {
//     try {
//       const value = e.target.value.replace(/\D/g, ""); // only digit
//       const newOtp = [...otp];
//       newOtp[index] = value;

//       const joinString = newOtp.join("");
//       setJoinedOTP(joinString);
//       setOtp(newOtp);

//       if (value && index < newOtp.length - 1) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     } catch (err) {
//       console.error("handleOtpChange error:", err);
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       if (otp[index]) {
//         // clear current box
//         const newOtp = [...otp];
//         newOtp[index] = "";
//         setOtp(newOtp);
//         setJoinedOTP(newOtp.join(""));
//       } else if (index > 0) {
//         // go to prev box
//         inputRefs.current[index - 1]?.focus();
//       }
//     }
//   };

//   const features = [
//     "Final Pay after 100% quality satisfaction",
//     "Full material procurement",
//     "100% packaging & masking",
//     "Trained experts & advanced tools",
//     "Daily quality checks & dedicated manager",
//     "Free Insurance for damages of up to ₹10,000",
//     "1 Yr service warranty against chipping , bubbling",
//     "Timely completion & clean up",
//   ];

//   const randomAvatars = [
//     "https://randomuser.me/api/portraits/women/44.jpg",
//     "https://randomuser.me/api/portraits/men/22.jpg",
//     "https://randomuser.me/api/portraits/men/45.jpg",
//     "https://randomuser.me/api/portraits/men/54.jpg",
//     "https://randomuser.me/api/portraits/women/51.jpg",
//   ];

//   const reviewers = [
//     {
//       name: "Sandhya Nair",
//       review:
//         "I availed painting and false ceiling services from Homjee in Mar 2023 after much research... Read more",
//     },
//     {
//       name: "Aniket Sharma",
//       review:
//         "Quality work at affordable prices, team is very polite and skilled...",
//     },
//     {
//       name: "Deepak Patil",
//       review:
//         "Homjee commitment to timelines is commendable. They completed our project ahead of schedule...",
//     },
//     {
//       name: "Yuvraj Chourasia",
//       review: "Painter was very punctual, professional, and hard working...",
//     },
//     {
//       name: "Lucky Sharma",
//       review:
//         "Work done was good and they even completed the work in promised time...",
//     },
//   ];

//   const faqData = [
//     "Are your painters trained and experienced professionals?",
//     "What if Paint/Primer/Tools are required in the middle of  the service?",
//     "Who will clean up the house after the service?",
//     "What if I have an issue or doubt which I need to resolve during painting?",
//     "Can I choose my preferred paint brand and colour for the project?",
//     "Will the painting process cause disruptions to my daily routine?",
//   ];

//   const [openIndex, setOpenIndex] = useState(null);

//   const toggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   const handleCloseSlotModal = () => {
//     setShowSlotModal(false);
//   };

//   // const availableSlots = [
//   //   { date: "2025-06-06", time: "10:00 AM - 12:00 PM" },
//   //   { date: "2025-06-06", time: "02:00 PM - 04:00 PM" },
//   //   { date: "2025-06-07", time: "09:00 AM - 11:00 AM" },
//   // ];

//   const getLatLngFromSession = () => {
//     const addr = sessionStorage.getItem("selectedAddress");
//     if (!addr) return null;

//     const parsed = JSON.parse(addr);
//     return {
//       lat: Number(parsed.latitude),
//       lng: Number(parsed.longitude),
//     };
//   };

//   const fetchAvailableSlots = async (date) => {
//     const location = getLatLngFromSession();
//     if (!location) return [];

//     const payload = {
//       serviceType: SERVICE_TYPE, // 🔥 dynamic
//       date,
//       lat: location.lat,
//       lng: location.lng,
//     };

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/slots/website/get-available-slots`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();
//       if (!data.success) return [];

//       return data.slots || [];
//     } catch (err) {
//       console.error("Slot fetch failed", err);
//       return [];
//     }
//   };

//   const handleProceedToSlotSelection = async () => {
//     const today = new Date().toISOString().split("T")[0];
//     const slots = await fetchAvailableSlots(today);
//     sessionStorage.setItem("availableSlots", JSON.stringify(slots));
//     setShowSlotModal(true);
//   };

//   // Function to handle selecting a slot
//   const handleSelectSlot = (slot) => {
//     // console.log("slot", slot);
//     setSelectedSlot(slot);
//     sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
//     setShowSlotModal(false);
//     navigate("/checkout", {
//       state: {
//         serviceType: "house_painting",
//       },
//     });
//   };

//   return (
//     <>
//       {responseLoader && <GlobalLoader />}
//       {/* Hero Section */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             width: "1200px",
//             // height: '622px',
//             margin: "0 auto",
//             borderRadius: "30px",
//             overflow: "hidden",
//             position: "relative",
//           }}
//         >
//           <Carousel interval={3000} controls={true} indicators={false}>
//             <Carousel.Item>
//               <div className="carousel-wrapper">
//                 <img
//                   className="d-block w-100"
//                   src={serviceBg}
//                   alt="Slide 1"
//                   style={{ height: "400px", objectFit: "cover" }}
//                 />
//                 <div className="custom-bar-indicators">
//                   <div className="bar active" />
//                   <div className="bar" />
//                 </div>
//               </div>
//             </Carousel.Item>

//             <Carousel.Item>
//               <div className="carousel-wrapper">
//                 <img
//                   className="d-block w-100"
//                   src={serviceBg}
//                   alt="Slide 2"
//                   style={{ height: "400px", objectFit: "cover" }}
//                 />
//                 <div className="custom-bar-indicators">
//                   <div className="bar" />
//                   <div className="bar active" />
//                 </div>
//               </div>
//             </Carousel.Item>
//           </Carousel>

//           <style>{`
//         .carousel-wrapper {
//           position: relative;
//         }

//         .custom-bar-indicators {
//           position: absolute;
//           bottom: 20px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 8px;
//         }

//         .bar {
//           width: 30px;
//           height: 6px;
//           border-radius: 4px;
//           background-color: black;
//           transition: all 0.3s;
//         }

//         .bar.active {
//           width: 40px;
//           background-color: red;
//         }
//       `}</style>

//           {/* Back Button */}
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               position: "absolute",
//               top: "20px",
//               left: "20px",
//               backgroundColor: "#fff",
//               color: "#e60000",
//               fontWeight: "bold",
//               border: "none",
//               padding: "10px 18px",
//               borderRadius: "999px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               fontSize: "16px",
//               boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
//               zIndex: 2,
//             }}
//           >
//             <span style={{ marginRight: "8px", fontSize: "20px" }}>{"<"}</span>
//             <span style={{ color: "#000" }}>Back</span>
//           </button>
//         </div>
//       </div>

//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             width: "353px",
//             // height: '622px',
//             margin: "0 auto",
//             borderRadius: "30px",
//             overflow: "hidden",
//             position: "relative",
//           }}
//         >
//           <Carousel interval={3000} controls={true} indicators={false}>
//             <Carousel.Item>
//               <div className="carousel-wrapper">
//                 <img
//                   className="d-block w-100"
//                   src={paintingservice}
//                   alt="Slide 1"
//                   style={{ height: "", objectFit: "cover" }}
//                 />
//                 <div className="custom-bar-indicators">
//                   <div className="bar active" />
//                   <div className="bar" />
//                 </div>
//               </div>
//             </Carousel.Item>

//             <Carousel.Item>
//               <div className="carousel-wrapper">
//                 <img
//                   className="d-block w-100"
//                   src={paintingservice}
//                   alt="Slide 2"
//                   style={{ height: "", objectFit: "cover" }}
//                 />
//                 <div className="custom-bar-indicators">
//                   <div className="bar" />
//                   <div className="bar active" />
//                 </div>
//               </div>
//             </Carousel.Item>
//           </Carousel>

//           <style>{`
//         .carousel-wrapper {
//           position: relative;
//         }

//         .custom-bar-indicators {
//           position: absolute;
//           bottom: 20px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 8px;
//         }

//         .bar {
//           width: 30px;
//           height: 6px;
//           border-radius: 4px;
//           background-color: black;
//           transition: all 0.3s;
//         }

//         .bar.active {
//           width: 40px;
//           background-color: red;
//         }
//       `}</style>

//           {/* Back Button */}
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               position: "absolute",
//               top: "12px",
//               left: "20px",
//               backgroundColor: "#fff",
//               color: "#e60000",
//               fontWeight: "bold",
//               border: "none",
//               padding: "10px 18px",
//               borderRadius: "999px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               fontSize: "16px",
//               boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
//               zIndex: 2,
//             }}
//           >
//             <span style={{ marginRight: "8px", fontSize: "16px" }}>{"<"}</span>
//             {/* <span style={{ color: '#000' }}></span> */}
//           </button>
//         </div>
//       </div>

//       {/* Booking Section */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             backgroundColor: "#fff5f1",
//             borderRadius: "30px",
//             padding: "40px 20px",
//             width: "1200px",
//             margin: "40px auto",
//             textAlign: "center",
//             position: "relative",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "35px",
//               fontWeight: "600",
//               marginBottom: "20px",
//               position: "relative",
//               display: "inline-block",
//             }}
//           >
//             Book A Site Visit For At Home Consultation
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "320px",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               flexWrap: "wrap",
//               gap: "20px",
//               marginTop: "30px",
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Enter Name"
//               style={{
//                 padding: "12px 20px",
//                 borderRadius: "12px",
//                 border: "1px solid #ccc",
//                 minWidth: "500px",
//                 fontSize: "14px",
//                 backgroundColor: "#fff5f1",
//                 outline: "none",
//                 color: "#000",
//               }}
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Enter WhatsApp Phone Number"
//               value={phoneNumber}
//               maxLength={10}
//               onChange={handlePhoneNumberChange}
//               style={{
//                 padding: "12px 20px",
//                 borderRadius: "12px",
//                 backgroundColor: "#fff5f1",
//                 border: "1px solid #ccc",
//                 minWidth: "500px",
//                 fontSize: "14px",
//                 outline: "none",
//                 color: "#000",
//               }}
//             />
//           </div>

//           <button
//             onClick={responseLoader ? null : handleProceedClick}
//             style={{
//               marginTop: "30px",
//               padding: "12px 40px",
//               border: "1px solid #e60000",
//               color: "#e60000",
//               fontWeight: "700",
//               backgroundColor: "transparent",
//               borderRadius: "999px",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//           >
//             PROCEED
//           </button>

//           {/* OTP Modal */}
//           {showModal && (
//             <>
//               {/* Backdrop */}
//               <div
//                 style={{
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "rgba(0, 0, 0, 0.5)",
//                   zIndex: 1000,
//                 }}
//                 onClick={handleCloseModal}
//               />
//               {/* Modal Content */}
//               <div
//                 style={{
//                   position: "fixed",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   backgroundColor: "#fff",
//                   borderRadius: "10px",
//                   padding: "20px",
//                   width: "400px",
//                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                   zIndex: 1001,
//                   textAlign: "center",
//                   border: "1px solid #e60000",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "20px",
//                   }}
//                 >
//                   <h3
//                     style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}
//                   >
//                     OTP
//                   </h3>
//                   <button
//                     onClick={handleCloseModal}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       fontSize: "24px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//                 <p style={{ fontSize: "16px", marginBottom: "20px" }}>
//                   Enter OTP sent to number {phoneNumber}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     marginBottom: "20px",
//                     color: "red",
//                   }}
//                 >
//                   development: {otpValue}
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     gap: "10px",
//                     marginBottom: "20px",
//                   }}
//                 >
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       type="text"
//                       maxLength="1"
//                       value={digit}
//                       onChange={(e) => handleOtpChange(e, index)}
//                       onKeyDown={(e) => handleKeyDown(e, index)}
//                       ref={(el) => (inputRefs.current[index] = el)}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         textAlign: "center",
//                         border: "1px solid #ccc",
//                         borderRadius: "5px",
//                         color: "black",
//                         fontSize: "18px",
//                         outline: "none",
//                         backgroundColor: "#fff",
//                       }}
//                     />
//                   ))}
//                 </div>
//                 <p style={{ marginBottom: "20px" }}>
//                   <a
//                     href="#"
//                     style={{
//                       color: "#e60000",
//                       textDecoration: "none",
//                       fontSize: "14px",
//                     }}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       ResendOTP();
//                     }}
//                   >
//                     Resend OTP
//                   </a>
//                 </p>
//                 <button
//                   onClick={verifyOTP}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     backgroundColor: "#e60000",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "5px",
//                     fontSize: "16px",
//                     fontWeight: "bold",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             backgroundColor: "#fff5f1",
//             borderRadius: "30px",
//             padding: "40px 20px",
//             width: "90%",
//             maxWidth: "1450px",
//             margin: "40px auto",
//             textAlign: "center",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "26px",
//               fontWeight: "600",
//               marginBottom: "20px",
//               position: "relative",
//               display: "inline-block",
//             }}
//           >
//             Book A Site Visit For At <br />
//             Home Consultation
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "28px",
//                 left: "85px",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               flexWrap: "wrap",
//               gap: "20px",
//               marginTop: "30px",
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Enter Name"
//               style={{
//                 padding: "12px 20px",
//                 borderRadius: "12px",
//                 border: "1px solid #ccc",
//                 minWidth: "300px",
//                 fontSize: "14px",
//                 backgroundColor: "#fff5f1",
//                 outline: "none",
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Enter WhatsApp Phone Number"
//               style={{
//                 padding: "12px 20px",
//                 borderRadius: "12px",
//                 backgroundColor: "#fff5f1",
//                 border: "1px solid #ccc",
//                 minWidth: "300px",
//                 fontSize: "14px",
//                 outline: "none",
//               }}
//             />
//           </div>

//           <button
//             style={{
//               marginTop: "30px",
//               padding: "12px 40px",
//               border: "1px solid #e60000",
//               color: "#e60000",
//               fontWeight: "700",
//               backgroundColor: "transparent",
//               borderRadius: "999px",
//               fontSize: "16px",
//               width: "100%",
//               cursor: "pointer",
//             }}
//           >
//             PROCEED
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <div
//         style={{
//           position: "relative",
//           display: "inline-block",
//           marginBottom: "40px",
//           textAlign: "center",
//           marginLeft: "",
//         }}
//         className="d-none d-lg-block"
//       >
//         <h2
//           style={{
//             fontSize: "32px",
//             fontWeight: "600",
//             margin: 0,
//             textAlign: "center",
//           }}
//         >
//           For All Your Home Painting Needs
//         </h2>
//         <img
//           src={vectoricon}
//           alt=""
//           style={{
//             position: "absolute",
//             bottom: "-14px",
//             left: "46%",
//             width: "130px",
//             height: "auto",
//             borderRadius: "10px",
//             pointerEvents: "none",
//           }}
//         />
//       </div>
//       <div
//         style={{
//           position: "relative",
//           display: "inline-block",
//           marginBottom: "40px",
//           textAlign: "center",
//         }}
//         className="d-block d-lg-none"
//       >
//         <h2
//           style={{
//             fontSize: "32px",
//             fontWeight: "600",
//             margin: 0,
//             textAlign: "center",
//           }}
//         >
//           For All Your Home Painting Needs
//         </h2>
//         <img
//           src={vectoricon}
//           alt=""
//           style={{
//             position: "absolute",
//             bottom: "30px",
//             left: "90px",
//             width: "130px",
//             height: "auto",
//             borderRadius: "10px",
//             pointerEvents: "none",
//           }}
//         />
//       </div>
//       {/* painting needs */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             backgroundColor: "#f4e6ff",
//             borderRadius: "30px",
//             padding: "50px 30px",
//             width: "1200px",
//             // maxWidth: '1450px',
//             margin: " auto",

//             textAlign: "center",
//           }}
//         >
//           {/* Grid of 2x2 cards */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "24px",
//             }}
//           >
//             {[
//               {
//                 title: "Interiors & Exteriors",
//                 subtitle: "Color Your Home Inside Out",
//                 img: exterior,
//               },
//               {
//                 title: "Wood Polish",
//                 subtitle: "Shine Your Home Like Never Before",
//                 img: woodpolish,
//               },
//               {
//                 title: "Texture",
//                 subtitle: "Elevate Your Space With Wall Beautification",
//                 img: texture,
//               },
//               {
//                 title: "Waterproofing",
//                 subtitle: "Seal, Shield, & Sustain Your Home",
//                 img: waterproofing,
//               },
//             ].map((service, index) => (
//               <div
//                 key={index}
//                 style={{
//                   //   backgroundColor: '#fff',
//                   borderRadius: "20px",
//                   overflow: "hidden",
//                   textAlign: "left",
//                   //   boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
//                 }}
//               >
//                 <img
//                   src={service.img}
//                   alt={service.title}
//                   style={{
//                     width: "100%",
//                     height: "250px",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <div style={{ padding: "16px" }}>
//                   <h3
//                     style={{
//                       margin: "0 0 6px",
//                       fontSize: "18px",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {service.title}
//                   </h3>
//                   <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
//                     {service.subtitle}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             backgroundColor: "#f4e6ff",
//             borderRadius: "30px",
//             padding: "40px 20px",
//             width: "90%",
//             maxWidth: "1450px",
//             margin: "auto",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "24px",
//             }}
//           >
//             {[
//               {
//                 title: "Interiors & exteriors",
//                 img: exterior,
//               },
//               {
//                 title: "Wood polish",
//                 img: woodpolish,
//               },
//               {
//                 title: "Texture",
//                 img: texture,
//               },
//               {
//                 title: "Waterproofing",
//                 img: waterproofing,
//               },
//             ].map((service, index) => (
//               <div
//                 key={index}
//                 style={{
//                   borderRadius: "10px",
//                   overflow: "hidden",
//                   textAlign: "left",
//                 }}
//               >
//                 <img
//                   src={service.img}
//                   alt={service.title}
//                   style={{
//                     width: "100%",
//                     height: "118px",
//                     objectFit: "cover",
//                     borderRadius: "10px",
//                   }}
//                 />
//                 <div style={{ padding: "8px 2px 0 2px" }}>
//                   <h3
//                     style={{
//                       margin: 0,
//                       fontSize: "14px",
//                       fontWeight: 600,
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       textAlign: "center",
//                     }}
//                   >
//                     {service.title}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* transperency */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             position: "relative",
//             height: "400px",
//             width: "1200px",
//             // maxWidth: '1450px',
//             margin: "40px auto",
//             borderRadius: "30px",
//             overflow: "hidden",
//             backgroundImage: `url(${bgImage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {/* Overlay content */}
//           <div
//             style={{
//               textAlign: "left",
//               color: "#fff",
//               padding: "30px",
//               //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
//               borderRadius: "20px",
//               maxWidth: "500px",
//               marginLeft: "-57%",
//             }}
//           >
//             {/* Paint Icon */}
//             <img
//               src={paintIcon}
//               alt="Paint Icon"
//               style={{ width: "108px", marginBottom: "20px" }}
//             />
//             <br />
//             {/* Heading */}
//             <div style={{ position: "relative", display: "inline-block" }}>
//               <h2
//                 style={{
//                   fontSize: "44px",
//                   fontWeight: "bold",
//                   margin: 0,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 100 % Quality with Transparency
//               </h2>
//               <img
//                 src={vectoricon}
//                 alt=""
//                 style={{
//                   position: "absolute",
//                   bottom: "-14px",
//                   left: "135px",
//                   width: "130px",
//                   height: "auto",
//                   borderRadius: "10px",
//                   pointerEvents: "none",
//                 }}
//               />
//             </div>

//             {/* Subtext */}
//             <p
//               style={{
//                 marginTop: "20px",
//                 fontSize: "28px",
//                 color: "#fff",
//                 fontWeight: "600",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               A fresh coat for a fresh start
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             position: "relative",
//             height: "400px",
//             width: "90%",
//             maxWidth: "1450px",
//             margin: "40px auto",
//             borderRadius: "30px",
//             overflow: "hidden",
//             backgroundImage: `url(${transperancy})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           {/* Overlay content centered absolutely */}
//           <div
//             style={{
//               position: "absolute",
//               top: "43%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               textAlign: "left",
//               color: "#fff",
//               padding: "30px",
//               borderRadius: "20px",
//               maxWidth: "90%",
//               width: "500px",
//             }}
//           >
//             {/* Paint Icon */}
//             <img
//               src={paintIcon}
//               alt="Paint Icon"
//               style={{ width: "108px", marginBottom: "20px" }}
//             />
//             <br />

//             {/* Heading with underline icon */}
//             <div style={{ position: "relative", display: "inline-block" }}>
//               <h2
//                 style={{
//                   fontSize: "30px",
//                   fontWeight: "bold",
//                   margin: 0,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 100% Quality with <br /> Transparency
//               </h2>
//               <img
//                 src={vectoricon}
//                 alt=""
//                 style={{
//                   position: "absolute",
//                   bottom: "-14px",
//                   left: "130px",
//                   width: "120px",
//                   height: "auto",
//                   borderRadius: "10px",
//                   pointerEvents: "none",
//                 }}
//               />
//             </div>

//             {/* Subtext */}
//             <p
//               style={{
//                 marginTop: "20px",
//                 fontSize: "20px",
//                 color: "#fff",
//                 fontWeight: "600",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               A fresh coat for a fresh start
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* our promises */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             backgroundColor: "#f9f9f9",
//             borderRadius: "30px",
//             padding: "60px 30px",
//             width: "1200px",
//             // maxWidth: '1300px',
//             margin: "40px auto",
//             textAlign: "center",
//           }}
//         >
//           {/* Heading */}
//           <div
//             style={{
//               position: "relative",
//               display: "inline-block",
//               marginBottom: "40px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "bold",
//                 margin: 0,
//               }}
//             >
//               Our Promises
//             </h2>
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "50px",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </div>

//           {/* Cards Grid */}
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "nowrap",

//               justifyContent: "center",
//               gap: "20px",
//               marginTop: "20px",
//             }}
//           >
//             {[
//               {
//                 bg: "#e8d7ff",
//                 icon: ontime,
//                 title: "On-time Completion\nGuarantee",
//               },
//               {
//                 bg: "#d9ecff",
//                 icon: warrantyIcon,
//                 title: "1-Year\nWarranty",
//               },
//               {
//                 bg: "#ccf0f7",
//                 icon: postservice,
//                 title: "Post Service\nCleaning",
//               },
//               {
//                 bg: "#e6dbff",
//                 icon: quoteIcon,
//                 title: "Accurate Quotations,\nNo Hidden Charges",
//               },
//               {
//                 bg: "#ccf7ec",
//                 icon: freeinsurance,
//                 title: "Free Insurance",
//                 subtitle: "for damages of up to ₹10,000",
//               },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: item.bg,
//                   borderRadius: "20px",
//                   padding: "30px 20px",
//                   width: "210px",
//                   height: "200px",
//                   flexShrink: 0, // prevents shrinking on small screens
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   textAlign: "center",
//                   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//                 }}
//               >
//                 <img
//                   src={item.icon}
//                   alt=""
//                   style={{ width: "80px", marginBottom: "20px" }}
//                 />
//                 <h3
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     whiteSpace: "pre-line",
//                   }}
//                 >
//                   {item.title}
//                 </h3>
//                 {item.subtitle && (
//                   <p
//                     style={{
//                       fontSize: "13px",
//                       marginTop: "1px",
//                       color: "#333",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {item.subtitle}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             backgroundColor: "#f9f9f9",
//             borderRadius: "30px",
//             padding: "60px 30px",
//             width: "90%",
//             maxWidth: "1300px",
//             margin: "40px auto",
//             textAlign: "center",
//           }}
//         >
//           {/* Heading */}
//           <div
//             style={{
//               position: "relative",
//               display: "inline-block",
//               marginBottom: "40px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "bold",
//                 margin: 0,
//               }}
//             >
//               Our Promises
//             </h2>
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </div>

//           {/* Cards Vertical Stack */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "20px",
//               alignItems: "center",
//             }}
//           >
//             {[
//               {
//                 bg: "#e8d7ff",
//                 icon: ontime,
//                 title: "On-time Completion\nGuarantee",
//               },
//               {
//                 bg: "#d9ecff",
//                 icon: warrantyIcon,
//                 title: "1-Year\nWarranty",
//               },
//               {
//                 bg: "#ccf0f7",
//                 icon: postservice,
//                 title: "Post Service\nCleaning",
//               },
//               {
//                 bg: "#e6dbff",
//                 icon: quoteIcon,
//                 title: "Accurate Quotations,\nNo Hidden Charges",
//               },
//               {
//                 bg: "#ccf7ec",
//                 icon: freeinsurance,
//                 title: "Free Insurance",
//                 subtitle: "for damages of up to ₹10,000",
//               },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: item.bg,
//                   borderRadius: "20px",
//                   padding: "24px 20px",
//                   width: "100%",
//                   maxWidth: "400px",
//                   display: "flex",
//                   alignItems: "center",
//                   textAlign: "left",
//                   gap: "20px",
//                 }}
//               >
//                 <img
//                   src={item.icon}
//                   alt=""
//                   style={{ width: "60px", height: "60px", flexShrink: 0 }}
//                 />
//                 <div>
//                   <h3
//                     style={{
//                       fontSize: "15px",
//                       fontWeight: 600,
//                       whiteSpace: "pre-line",
//                       margin: 0,
//                       lineHeight: "1.3",
//                     }}
//                   >
//                     {item.title}
//                   </h3>
//                   {item.subtitle && (
//                     <p
//                       style={{
//                         fontSize: "13px",
//                         marginTop: "4px",
//                         color: "#333",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {item.subtitle}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* newly launched */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             position: "relative",
//             height: "400px",
//             width: "1200px",
//             // maxWidth: '1300px',
//             margin: "40px auto",
//             borderRadius: "30px",
//             overflow: "hidden",
//             backgroundImage: `url(${wallpaperBanner})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             display: "flex",
//             alignItems: "center",
//             padding: "0 50px",
//           }}
//         >
//           {/* Text Overlay */}
//           <div style={{ color: "#fff", maxWidth: "500px" }}>
//             {/* Badge */}
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 color: "#e60000",
//                 fontWeight: "bold",
//                 fontSize: "14px",
//                 padding: "6px 16px",
//                 borderRadius: "999px",
//                 display: "inline-block",
//                 marginBottom: "16px",
//               }}
//             >
//               Newly Launched
//             </div>
//             <br />
//             {/* Heading with underline */}
//             <div style={{ position: "relative", display: "inline-block" }}>
//               {/* <h2
//             style={{
//               fontSize: '50px',
//               fontWeight: 'bold',
//               margin: 0,
//               lineHeight: '1.2',
//             }}
//           >
//             Wallpaper And <br /> Wall Panels
//           </h2> */}
//               <h2
//                 style={{
//                   fontSize: "50px",
//                   fontWeight: "500",
//                   margin: 0,
//                   lineHeight: "1.2",
//                   fontFamily: "Poppins, sans-serif",
//                   color: "#fff",
//                 }}
//               >
//                 <span style={{ position: "relative", display: "inline-block" }}>
//                   Wallpaper
//                   <img
//                     src={vectoricon}
//                     alt="underline"
//                     style={{
//                       position: "absolute",
//                       bottom: "-10px",
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       width: "130px",
//                       height: "auto",
//                       pointerEvents: "none",
//                     }}
//                   />
//                 </span>{" "}
//                 And
//                 <br />
//                 <span style={{ marginTop: "1%" }}>Wall Panels</span>
//               </h2>
//             </div>

//             {/* Subtitle */}
//             <p
//               style={{
//                 marginTop: "24px",
//                 fontSize: "35px",
//                 fontFamily: "Fasthand",
//                 fontWeight: 400,
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Bringing Life To Your Surrounding
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             position: "relative",
//             height: "400px",
//             width: "90%",
//             maxWidth: "1300px",
//             margin: "40px auto",
//             borderRadius: "30px",
//             overflow: "hidden",
//             backgroundImage: `url(${wallpaperBannerimage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             display: "flex",
//             alignItems: "center",
//             padding: "0 50px",
//           }}
//         >
//           {/* Text Overlay */}
//           <div style={{ color: "#fff", maxWidth: "500px", marginLeft: "-12%" }}>
//             {/* Badge */}
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 color: "#e60000",
//                 fontWeight: "600",
//                 fontSize: "14px",
//                 padding: "6px 16px",
//                 borderRadius: "999px",
//                 display: "inline-block",
//                 marginBottom: "16px",
//               }}
//             >
//               Newly Launched
//             </div>
//             <br />
//             {/* Heading with underline */}
//             <div style={{ position: "relative", display: "inline-block" }}>
//               {/* <h2
//             style={{
//               fontSize: '50px',
//               fontWeight: 'bold',
//               margin: 0,
//               lineHeight: '1.2',
//             }}
//           >
//             Wallpaper And <br /> Wall Panels
//           </h2> */}
//               <h2
//                 style={{
//                   fontSize: "30px",
//                   fontWeight: "500",
//                   margin: 0,
//                   lineHeight: "1.4",
//                   fontFamily: "Poppins, sans-serif",
//                   color: "#fff",
//                 }}
//               >
//                 <span style={{ position: "relative", display: "inline-block" }}>
//                   Wallpaper
//                   <img
//                     src={vectoricon}
//                     alt="underline"
//                     style={{
//                       position: "absolute",
//                       bottom: "-10px",
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       width: "130px",
//                       height: "auto",
//                       pointerEvents: "none",
//                     }}
//                   />
//                 </span>{" "}
//                 And
//                 <br />
//                 <span style={{ marginTop: "1%" }}>Wall Panels</span>
//               </h2>
//             </div>

//             {/* Subtitle */}
//             <p
//               style={{
//                 marginTop: "24px",
//                 fontSize: "20px",
//                 fontFamily: "Fasthand",
//                 fontWeight: 400,
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Bringing Life To Your Surrounding
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* why choose homjee */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             backgroundColor: "#ffffff",
//             borderRadius: "30px",
//             padding: "60px 20px",
//             width: "1200px",
//             // maxWidth: '1200px',
//             margin: "40px auto",
//           }}
//         >
//           {/* Heading */}
//           <div style={{ textAlign: "center", marginBottom: "40px" }}>
//             <h2
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "600",
//                 marginBottom: "10px",
//                 position: "relative",
//               }}
//             >
//               Why Choose Homjee?
//               <img
//                 src={vectoricon}
//                 alt=""
//                 style={{
//                   position: "absolute",
//                   bottom: "-14px",
//                   left: "480px",
//                   width: "130px",
//                   height: "auto",
//                   borderRadius: "10px",
//                   pointerEvents: "none",
//                 }}
//               />
//             </h2>
//           </div>

//           {/* Table Grid */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1.8fr 1fr 1fr",
//               gap: "0px",
//               alignItems: "center",
//             }}
//           >
//             {/* Column Headers */}
//             <div></div>
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "8px 0",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//               }}
//             >
//               <img
//                 src={homjeeLogo}
//                 alt="Homjee"
//                 style={{ height: "32px", marginLeft: "-34%" }}
//               />
//             </div>
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "8px 0",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//                 marginLeft: "-30%",
//               }}
//             >
//               Local Market
//             </div>

//             {/* Rows */}
//             {features.map((text, index) => (
//               <React.Fragment key={index}>
//                 <div
//                   key={`feature-${index}`}
//                   style={{
//                     fontSize: "16px",
//                     padding: "14px 0",
//                     fontWeight: "500",
//                   }}
//                 >
//                   {text}
//                 </div>
//                 <div
//                   style={{
//                     textAlign: "center",
//                     padding: "14px 0",
//                     width: "70%",
//                     backgroundColor: "#e8f5e9",
//                   }}
//                 >
//                   <img src={checkIcon} alt="yes" style={{ width: "30px" }} />
//                 </div>

//                 <div
//                   style={{
//                     textAlign: "center",
//                     padding: "14px 0",
//                     backgroundColor: "#ffebee",
//                     width: "70%",
//                   }}
//                 >
//                   <img src={crossIcon} alt="no" style={{ width: "30px" }} />
//                 </div>
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             backgroundColor: "#ffffff",
//             borderRadius: "30px",
//             padding: "60px 20px",
//             width: "90%",
//             maxWidth: "1200px",
//             margin: "40px auto",
//           }}
//         >
//           {/* Heading */}
//           <div style={{ textAlign: "center", marginBottom: "40px" }}>
//             <h2
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "600",
//                 marginBottom: "10px",
//                 position: "relative",
//               }}
//             >
//               Why Choose Homjee?
//               <img
//                 src={vectoricon}
//                 alt=""
//                 style={{
//                   position: "absolute",
//                   bottom: "-14px",
//                   left: "24%",
//                   width: "130px",
//                   height: "auto",
//                   borderRadius: "10px",
//                   pointerEvents: "none",
//                 }}
//               />
//             </h2>
//           </div>

//           {/* Table Grid */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1.8fr 1fr 1fr",
//               gap: "0px",
//               alignItems: "center",
//             }}
//           >
//             {/* Column Headers */}
//             <div></div>
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "8px 0",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//               }}
//             >
//               <img
//                 src={homjeeLogo}
//                 alt="Homjee"
//                 style={{ height: "32px", marginLeft: "-34%" }}
//               />
//             </div>
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "8px 0",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//                 marginLeft: "-30%",
//               }}
//             >
//               Local Market
//             </div>

//             {/* Rows */}
//             {features.map((text, index) => (
//               <React.Fragment key={index}>
//                 <div
//                   key={`feature-${index}`}
//                   style={{
//                     fontSize: "14px",
//                     padding: "14px 0",
//                     fontWeight: "500",
//                   }}
//                 >
//                   {text}
//                 </div>
//                 <div
//                   style={{
//                     textAlign: "center",
//                     padding: "14px 0",
//                     width: "70%",
//                     // backgroundColor: '#e8f5e9',
//                   }}
//                 >
//                   <img src={checkIcon} alt="yes" style={{ width: "30px" }} />
//                 </div>

//                 <div
//                   style={{
//                     textAlign: "center",
//                     padding: "14px 0",
//                     // backgroundColor: '#ffebee',
//                     width: "70%",
//                   }}
//                 >
//                   <img src={crossIcon} alt="no" style={{ width: "30px" }} />
//                 </div>
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* premium brands */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             backgroundImage: `url(${bgBrands})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderRadius: "30px",
//             padding: "60px 30px",
//             width: "1200px",
//             height: "400px",
//             margin: "40px auto",
//             textAlign: "center",
//             color: "#fff",
//           }}
//         >
//           {/* Heading */}
//           <div
//             style={{
//               position: "relative",
//               display: "inline-block",
//               marginBottom: "40px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "bold",
//                 marginTop: "15%",
//               }}
//             >
//               Premium brands, <span style={{ color: "" }}>for you</span>
//               <img
//                 src={vectoricon}
//                 alt=""
//                 style={{
//                   position: "absolute",
//                   bottom: "-10px",
//                   left: "150px",
//                   width: "130px",
//                   height: "auto",
//                   borderRadius: "10px",
//                   pointerEvents: "none",
//                 }}
//               />
//             </h2>
//           </div>

//           {/* Logos */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "20px",
//               flexWrap: "wrap",
//               padding: "20px 0",
//             }}
//           >
//             {[logoBerger, logoDulux, logoAsian, logoOpus].map((img, index) => (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "16px",
//                   padding: "12px 20px",
//                   boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//                   width: "160px",
//                   height: "100px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <img
//                   src={img}
//                   alt={`brand-${index}`}
//                   style={{
//                     width: "160px",
//                     height: "100px",
//                     objectFit: "contain",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             backgroundImage: `url(${bgBrandsimage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderRadius: "30px",
//             padding: "60px 30px",
//             height: "400px",
//             margin: "40px auto",
//             width: "361px",
//             textAlign: "center",
//             color: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {/* Heading */}
//           <div
//             style={{
//               position: "relative",
//               marginBottom: "30px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "28px",
//                 fontWeight: "bold",
//                 margin: 0,
//                 lineHeight: 1.3,
//               }}
//             >
//               Premium Brands,
//               <br />
//               For You
//             </h2>
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-12px",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 width: "120px",
//                 height: "auto",
//                 pointerEvents: "none",
//               }}
//             />
//           </div>

//           {/* Logos */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "20px",
//               flexWrap: "wrap",
//               padding: "10px 0",
//               maxWidth: "360px",
//             }}
//           >
//             {[logoBerger, logoDulux, logoAsian, logoOpus].map((img, index) => (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "16px",
//                   padding: "12px 20px",
//                   width: "140px",
//                   height: "80px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <img
//                   src={img}
//                   alt={`brand-${index}`}
//                   style={{
//                     maxWidth: "140px",
//                     maxHeight: "80px",
//                     objectFit: "contain",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* our process */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             background: "#fff",
//             padding: "60px 20px",
//             textAlign: "center",
//           }}
//         >
//           {/* Main Heading */}
//           <h2
//             style={{
//               fontSize: "40px",
//               fontWeight: "600",
//               fontFamily: "Poppins, sans-serif",
//               color: "#111",
//               marginBottom: "10px",
//               position: "relative",
//               display: "inline-block",
//             }}
//           >
//             Our Process
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "50px",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           <div
//             style={{
//               background: "#fff",
//               padding: "60px 20px",
//               textAlign: "center",
//             }}
//           >
//             {/* Carousel */}
//             <Carousel
//               indicators={true}
//               controls={true}
//               interval={4000}
//               className="how-carousel"
//               nextIcon={
//                 <span className="carousel-control-next-icon custom-icon" />
//               }
//               prevIcon={
//                 <span className="carousel-control-prev-icon custom-icon" />
//               }
//             >
//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-between align-items-center flex-wrap"
//                   style={{ padding: "0 5%" }}
//                 >
//                   {/* Step 1 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(-2deg)",
//                     }}
//                   >
//                     <img
//                       src={step1}
//                       alt="Step 1"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       01 <br />
//                       <strong>At Home Consult</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 1 and 2 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 2 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "#000",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                     }}
//                   >
//                     <img
//                       src={step2}
//                       alt="Step 2"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       02 <br />
//                       <strong>Measurements & Quotes</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 2 and 3 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 3 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(2deg)",
//                     }}
//                   >
//                     <img
//                       src={step3}
//                       alt="Step 3"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       03 <br />
//                       <strong>Booking Confirmation</strong>
//                     </h5>
//                   </div>
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-between align-items-center flex-wrap"
//                   style={{ padding: "0 5%" }}
//                 >
//                   {/* Step 1 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(-2deg)",
//                     }}
//                   >
//                     <img
//                       src={step1}
//                       alt="Step 1"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       01 <br />
//                       <strong>At Home Consult</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 1 and 2 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 2 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "#000",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                     }}
//                   >
//                     <img
//                       src={step2}
//                       alt="Step 2"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       02 <br />
//                       <strong>Measurements & Quotes</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 2 and 3 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 3 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(2deg)",
//                     }}
//                   >
//                     <img
//                       src={step3}
//                       alt="Step 3"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       03 <br />
//                       <strong>Booking Confirmation</strong>
//                     </h5>
//                   </div>
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-between align-items-center flex-wrap"
//                   style={{ padding: "0 5%" }}
//                 >
//                   {/* Step 1 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(-2deg)",
//                     }}
//                   >
//                     <img
//                       src={step1}
//                       alt="Step 1"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       01 <br />
//                       <strong>At Home Consult</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 1 and 2 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 2 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "#000",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                     }}
//                   >
//                     <img
//                       src={step2}
//                       alt="Step 2"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       02 <br />
//                       <strong>Measurements & Quotes</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 2 and 3 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 3 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(2deg)",
//                     }}
//                   >
//                     <img
//                       src={step3}
//                       alt="Step 3"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       03 <br />
//                       <strong>Booking Confirmation</strong>
//                     </h5>
//                   </div>
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-between align-items-center flex-wrap"
//                   style={{ padding: "0 5%" }}
//                 >
//                   {/* Step 1 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(-2deg)",
//                     }}
//                   >
//                     <img
//                       src={step1}
//                       alt="Step 1"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       01 <br />
//                       <strong>At Home Consult</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 1 and 2 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 2 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "#000",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                     }}
//                   >
//                     <img
//                       src={step2}
//                       alt="Step 2"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       02 <br />
//                       <strong>Measurements & Quotes</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 2 and 3 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 3 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(2deg)",
//                     }}
//                   >
//                     <img
//                       src={step3}
//                       alt="Step 3"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       03 <br />
//                       <strong>Booking Confirmation</strong>
//                     </h5>
//                   </div>
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-between align-items-center flex-wrap"
//                   style={{ padding: "0 5%" }}
//                 >
//                   {/* Step 1 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(-2deg)",
//                     }}
//                   >
//                     <img
//                       src={step1}
//                       alt="Step 1"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       01 <br />
//                       <strong>At Home Consult</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 1 and 2 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 2 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "#000",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                     }}
//                   >
//                     <img
//                       src={step2}
//                       alt="Step 2"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       02 <br />
//                       <strong>Measurements & Quotes</strong>
//                     </h5>
//                   </div>

//                   {/* Arrow Between 2 and 3 */}
//                   <img
//                     src={arrowicon} // replace with your arrow icon path
//                     alt="arrow"
//                     style={{ width: "70px", margin: "0 15px" }}
//                   />

//                   {/* Step 3 */}
//                   <div
//                     style={{
//                       width: "25%",
//                       backgroundColor: "red",
//                       borderRadius: "25px",
//                       padding: "20px",
//                       color: "#fff",
//                       transform: "rotate(2deg)",
//                     }}
//                   >
//                     <img
//                       src={step3}
//                       alt="Step 3"
//                       style={{ width: "100%", borderRadius: "15px" }}
//                     />
//                     <h5 style={{ marginTop: "20px", fontSize: "18px" }}>
//                       03 <br />
//                       <strong>Booking Confirmation</strong>
//                     </h5>
//                   </div>
//                 </div>
//               </Carousel.Item>
//             </Carousel>

//             {/* Custom styles for arrows and line indicators */}
//             <style>{`
//     .how-carousel .carousel-control-prev,
//     .how-carousel .carousel-control-next {
//       width: 40px;
//       height: 40px;
//       top: 50%;
//       transform: translateY(-50%);
//       background-color: #fff;
//       border-radius: 50%;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.15);
//       opacity: 1;
//     }
//     .how-carousel .carousel-control-prev {
//       left: -10px;
//     }
//     .how-carousel .carousel-control-next {
//       right: -10px;
//     }
//   .custom-icon {
//   display: inline-block;
//   width: 20px;
//   height: 20px;
//   mask-size: contain;
//   mask-repeat: no-repeat;
//   mask-position: center;
//   background-color: #e60000; /* red color arrow */
// }
// .carousel-control-prev-icon.custom-icon {
//   mask-image: url("data:image/svg+xml;utf8,<svg fill='red' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 16 16'><path d='M11 1L3 8l8 7' stroke='red' stroke-width='2' fill='none'/></svg>");
// }
// .carousel-control-next-icon.custom-icon {
//   mask-image: url("data:image/svg+xml;utf8,<svg fill='red' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 16 16'><path d='M5 1l8 7-8 7' stroke='red' stroke-width='2' fill='none'/></svg>");
// }

//     .carousel-indicators {
//       bottom: -63px;
//     }
//     .carousel-indicators [data-bs-target] {
//       width: 30px;
//       height: 4px;
//       border-radius: 5px;
//       background-color: #ccc;
//       margin: 0 5px;
//     }
//     .carousel-indicators .active {
//       background-color: red;
//       width: 40px;
//     }
//   `}</style>
//           </div>
//         </div>
//       </div>
//       <div
//         className="d-block d-lg-none"
//         style={{
//           background: "#fff",
//           padding: "30px 15px",
//           textAlign: "center",
//         }}
//       >
//         {/* Section Title */}
//         <h3
//           style={{
//             fontWeight: 700,
//             fontSize: "20px",
//             marginBottom: "20px",
//           }}
//         >
//           Our Process
//         </h3>

//         <div
//           style={{
//             overflowX: "auto",
//             display: "flex",
//             gap: "16px",
//             paddingLeft: "15px",
//             scrollSnapType: "x mandatory",
//           }}
//         >
//           {[
//             { img: step1, bg: "red", label: "01", title: "At Home Consult" },
//             {
//               img: step2,
//               bg: "#000",
//               label: "02",
//               title: "Measurements & Quotes",
//             },
//             {
//               img: step3,
//               bg: "red",
//               label: "03",
//               title: "Booking Confirmation",
//             },
//           ].map((item, idx) => (
//             <div
//               key={idx}
//               style={{
//                 minWidth: "85%",
//                 flexShrink: 0,
//                 scrollSnapAlign: "start",
//                 backgroundColor: item.bg,
//                 borderRadius: "25px",
//                 padding: "20px",
//                 color: "#fff",
//               }}
//             >
//               <img
//                 src={item.img}
//                 alt={`Step ${item.label}`}
//                 style={{ width: "100%", borderRadius: "15px" }}
//               />
//               <h5 style={{ marginTop: "20px", fontSize: "16px" }}>
//                 {item.label} <br />
//                 <strong>{item.title}</strong>
//               </h5>
//             </div>
//           ))}
//         </div>

//         {/* Indicators (optional, static) */}
//         <div className="d-flex gap-2 mt-3" style={{ justifyContent: "center" }}>
//           <div
//             style={{
//               width: "30px",
//               height: "4px",
//               backgroundColor: "red",
//               borderRadius: "4px",
//             }}
//           ></div>
//           <div
//             style={{
//               width: "20px",
//               height: "4px",
//               backgroundColor: "#ccc",
//               borderRadius: "4px",
//             }}
//           ></div>
//           <div
//             style={{
//               width: "20px",
//               height: "4px",
//               backgroundColor: "#ccc",
//               borderRadius: "4px",
//             }}
//           ></div>
//         </div>
//       </div>

//       {/* trained profestional */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             backgroundImage: `url(${bgProfessional})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderRadius: "30px",
//             padding: "60px",
//             width: "1200px",
//             // maxWidth: '1200px',
//             margin: "40px auto",
//             marginTop: "-1%",
//             color: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <div style={{ maxWidth: "500px" }}>
//             <h2
//               style={{
//                 fontSize: "40px",
//                 fontWeight: "bold",
//                 marginBottom: "10px",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Top trained professionals, <br />
//               top quality work
//             </h2>
//             <p
//               style={{
//                 fontSize: "18px",
//                 margin: "10px 0 0",
//                 fontWeight: "bold",
//               }}
//             >
//               We only choose the finest painters
//             </p>
//             <p
//               style={{
//                 color: "#ff4d4f",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 marginTop: "6px",
//               }}
//             >
//               0.1% selection rate
//             </p>

//             <ul style={{ marginTop: "24px", listStyle: "none", padding: 0 }}>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <span style={dotStyle}></span>
//                 300+ hrs. Intensive training
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <span style={dotStyle}></span>
//                 5-step background check
//               </li>
//               <li style={{ display: "flex", alignItems: "center" }}>
//                 <span style={dotStyle}></span>
//                 On time completion
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             backgroundImage: `url(${bgProfessionalimage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderRadius: "30px",
//             padding: "60px 20px",
//             margin: "40px auto",
//             marginTop: "-1%",
//             color: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             width: "353px",
//             height: "636px",
//           }}
//         >
//           <div style={{ maxWidth: "100%", marginTop: "-87%" }}>
//             <h2
//               style={{
//                 fontSize: "26px",
//                 fontWeight: "bold",
//                 marginBottom: "10px",
//                 lineHeight: "1.3",
//                 whiteSpace: "normal",
//               }}
//             >
//               Top Trained <br /> Professionals, <br /> Top Quality Work
//             </h2>

//             <p
//               style={{
//                 fontSize: "16px",
//                 margin: "10px 0 0",
//                 fontWeight: "bold",
//               }}
//             >
//               We only choose the finest painters
//             </p>
//             <p
//               style={{
//                 color: "#ff4d4f",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 marginTop: "6px",
//               }}
//             >
//               0.1% selection rate
//             </p>

//             <ul style={{ marginTop: "24px", listStyle: "none", padding: 0 }}>
//               {[
//                 "300+ hrs. Intensive training",
//                 "5-step background check",
//                 "On time completion",
//               ].map((text, index) => (
//                 <li
//                   key={index}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: index !== 2 ? "10px" : "0",
//                     fontSize: "14px",
//                   }}
//                 >
//                   <span style={dotStyle}></span>
//                   {text}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* testimonals */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             background: "#fff",
//             padding: "60px 20px",
//             textAlign: "center",
//           }}
//         >
//           {/* Title Section */}
//           <h2
//             style={{
//               fontSize: "40px",
//               fontWeight: "bold",
//               fontFamily: "Poppins, sans-serif",
//               marginBottom: "10px",
//               position: "relative",
//               display: "inline-block",
//             }}
//           >
//             Testimonials
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "35px",
//                 width: "180px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           <p
//             style={{
//               fontWeight: 600,
//               fontSize: "20px",
//               marginTop: "20px",
//               marginBottom: "40px",
//             }}
//           >
//             What People Say About Us
//           </p>
//           <div style={{ margin: "0 20px" }}>
//             {/* Carousel */}
//             <Carousel
//               indicators={true}
//               controls={false}
//               interval={6000}
//               className="testimonial-carousel"
//             >
//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-center align-items-center"
//                   style={{
//                     padding: "0 5%",
//                     gap: "30px",
//                     flexWrap: "nowrap", // prevents wrapping
//                     overflowX: "hidden", // allows horizontal scroll on smaller screens
//                   }}
//                 >
//                   {[...Array(3)].map((_, idx) => (
//                     <div key={idx}>
//                       <video
//                         src={testimonialVideo}
//                         width="644"
//                         height="412"
//                         controls
//                         muted
//                         preload="auto"
//                         style={{
//                           objectFit: "cover",
//                           borderRadius: "20px",
//                           display: "block",
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </Carousel.Item>

//               <Carousel.Item>
//                 <div
//                   className="d-flex justify-content-center align-items-center"
//                   style={{
//                     padding: "0 5%",
//                     gap: "30px",
//                     flexWrap: "nowrap",
//                     overflowX: "hidden",
//                   }}
//                 >
//                   {[...Array(3)].map((_, idx) => (
//                     <div key={idx}>
//                       <video
//                         src={testimonialVideo}
//                         width="644"
//                         height="412"
//                         controls
//                         muted
//                         preload="auto"
//                         style={{
//                           objectFit: "cover",
//                           borderRadius: "20px",
//                           display: "block",
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </Carousel.Item>
//             </Carousel>
//           </div>

//           {/* Custom Styling */}
//           <style>{`
//        .testimonial-carousel .carousel-indicators {
//          bottom: -60px;
//        }
//        .testimonial-carousel .carousel-indicators [data-bs-target] {
//          width: 30px;
//          height: 4px;
//          border-radius: 5px;
//          background-color: #ccc;
//          margin: 0 5px;
//        }
//        .testimonial-carousel .carousel-indicators .active {
//          background-color: red;
//          width: 40px;
//        }
//      `}</style>
//         </div>
//       </div>
//       <div
//         className="d-block d-lg-none"
//         style={{
//           background: "#fff",
//           padding: "40px 20px",
//           textAlign: "center",
//         }}
//       >
//         {/* Title Section */}
//         <h2
//           style={{
//             fontSize: "30px",
//             fontWeight: "bold",
//             fontFamily: "Poppins, sans-serif",
//             marginBottom: "10px",
//             position: "relative",
//             display: "inline-block",
//           }}
//         >
//           Testimonials
//           <img
//             src={vectoricon}
//             alt=""
//             style={{
//               position: "absolute",
//               bottom: "-12px",
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: "130px",
//               height: "auto",
//               pointerEvents: "none",
//             }}
//           />
//         </h2>

//         <p
//           style={{
//             fontWeight: 600,
//             fontSize: "16px",
//             marginTop: "2px",
//             // marginBottom: '30px'
//           }}
//         >
//           What People Say About Us
//         </p>
//         <Swiper
//           slidesPerView={1.2}
//           spaceBetween={10}
//           onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//           style={{ paddingLeft: "20px", marginBottom: "20px" }}
//         >
//           {videos.map((vid, index) => (
//             <SwiperSlide key={index}>
//               <video
//                 src={vid}
//                 height="220"
//                 controls
//                 muted
//                 style={{
//                   borderRadius: "15px",
//                   objectFit: "cover",
//                   width: "100%",
//                 }}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         {/* Custom Indicator Bar */}
//         <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
//           {videos.map((_, index) => (
//             <div
//               key={index}
//               style={{
//                 width: activeIndex === index ? "30px" : "20px",
//                 height: "4px",
//                 backgroundColor: activeIndex === index ? "red" : "#ccc",
//                 borderRadius: "5px",
//                 transition: "width 0.3s",
//               }}
//             />
//           ))}
//         </div>

//         {/* Indicator Styling */}
//         <style>{`
//     .testimonial-carousel-mobile .carousel-inner {
//       overflow: visible;
//     }
//     .testimonial-carousel-mobile .carousel-item {
//       transition: transform 0.5s ease-in-out;
//     }
//     .testimonial-carousel-mobile .carousel-indicators {
//       bottom: -35px;
//     }
//     .testimonial-carousel-mobile .carousel-indicators [data-bs-target] {
//       width: 20px;
//       height: 4px;
//       border-radius: 5px;
//       background-color: #ccc;
//       margin: 0 5px;
//     }
//     .testimonial-carousel-mobile .carousel-indicators .active {
//       background-color: red;
//       width: 30px;
//     }
//   `}</style>
//       </div>

//       {/* ourrecent projects */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             background: "#fff",
//             padding: "60px 40px",
//             textAlign: "center",
//           }}
//         >
//           {/* Heading */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "30px",
//               flexWrap: "wrap",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "36px",
//                 fontWeight: "bold",
//                 color: "#111",
//                 position: "relative",
//                 fontFamily: "Poppins, sans-serif",
//                 display: "inline-block",
//               }}
//             >
//               Our Recent Projects
//               <img
//                 src={vectoricon}
//                 alt=""
//                 style={{
//                   position: "absolute",
//                   bottom: "-14px",
//                   left: "80px",
//                   width: "130px",
//                   height: "auto",
//                   borderRadius: "10px",
//                   pointerEvents: "none",
//                 }}
//               />
//             </h2>

//             <Button
//               variant="outline-danger"
//               style={{
//                 fontWeight: 600,
//                 borderRadius: "30px",
//                 padding: "8px 24px",
//                 fontSize: "14px",
//               }}
//             >
//               EXPLORE ALL
//             </Button>
//           </div>
//           <div style={{ margin: "0 10px" }}>
//             {/* Carousel */}
//             <Carousel
//               indicators={true}
//               controls={true}
//               interval={3000}
//               className="recent-carousel"
//               nextIcon={
//                 <span className="carousel-control-next-icon custom-icon" />
//               }
//               prevIcon={
//                 <span className="carousel-control-prev-icon custom-icon" />
//               }
//             >
//               <Carousel.Item>
//                 <div className="d-flex justify-content-center gap-4 flex-wrap">
//                   <img
//                     src={img1}
//                     alt="Project 1"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img2}
//                     alt="Project 2"
//                     className="rounded"
//                     style={{
//                       width: "350px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img3}
//                     alt="Project 3"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div className="d-flex justify-content-center gap-4 flex-wrap">
//                   <img
//                     src={img2}
//                     alt="Project 2"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img3}
//                     alt="Project 3"
//                     className="rounded"
//                     style={{
//                       width: "350px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img1}
//                     alt="Project 1"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div className="d-flex justify-content-center gap-4 flex-wrap">
//                   <img
//                     src={img2}
//                     alt="Project 2"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img3}
//                     alt="Project 3"
//                     className="rounded"
//                     style={{
//                       width: "350px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img1}
//                     alt="Project 1"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div className="d-flex justify-content-center gap-4 flex-wrap">
//                   <img
//                     src={img1}
//                     alt="Project 1"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img2}
//                     alt="Project 2"
//                     className="rounded"
//                     style={{
//                       width: "350px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img3}
//                     alt="Project 3"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </Carousel.Item>
//               <Carousel.Item>
//                 <div className="d-flex justify-content-center gap-4 flex-wrap">
//                   <img
//                     src={img1}
//                     alt="Project 1"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img2}
//                     alt="Project 2"
//                     className="rounded"
//                     style={{
//                       width: "350px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <img
//                     src={img3}
//                     alt="Project 3"
//                     className="rounded"
//                     style={{
//                       width: "380px",
//                       height: "504px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </Carousel.Item>
//             </Carousel>
//           </div>
//           <style>{`
//     .carousel-indicators {
//       bottom: -40px;
//     }

//     .carousel-indicators [data-bs-target] {
//       width: 24px;
//       height: 4px;
//       border-radius: 5px;
//       margin: 0 5px;
//       background-color: #ccc;
//       transition: all 0.3s ease;
//       opacity: 1;
//     }

//     .carousel-indicators .active {
//       background-color: red;
//       width: 30px;
//     }

//     .carousel-control-prev-icon,
//   .carousel-control-next-icon {
//     background-image: none !important;
//   }

//     /* Updated Control Styles */
//     .recent-carousel .carousel-control-prev,
//     .recent-carousel .carousel-control-next {
//       width: 40px;
//       height: 40px;
//       top: 50%;
//       transform: translateY(-50%);
//       background-color: #fff;
//       border-radius: 50%;
//       opacity: 1;
//       z-index: 5;
//       box-shadow: none;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     }

//     /* Center Prev to 1st Image Left */
//     .recent-carousel .carousel-control-prev {
//       left: calc(50% - 600px); /* Assuming each image is 350px + 2 * 20px gap */
//     }

//     /* Center Next to 3rd Image Right */
//     .recent-carousel .carousel-control-next {
//       right: calc(50% - 600px);
//     }

//   .custom-icon {
//     background-color: #ff4d4d; /* <-- Light red */
//     width: 20px;
//     height: 20px;
//     mask-size: contain;
//     mask-repeat: no-repeat;
//     mask-position: center;
//     -webkit-mask-size: contain;
//     -webkit-mask-repeat: no-repeat;
//     -webkit-mask-position: center;
//   }

//     .carousel-control-prev-icon.custom-icon {
//       mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
//       -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
//     }

//     .carousel-control-next-icon.custom-icon {
//       mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
//       -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
//     }
//   `}</style>
//         </div>
//       </div>
//       <div
//         className="d-block d-lg-none"
//         style={{ background: "#fff", padding: "30px 15px" }}
//       >
//         {/* Heading */}
//         <div style={{ marginBottom: "30px", position: "relative" }}>
//           <h2
//             style={{
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#111",
//               fontFamily: "Poppins, sans-serif",
//               marginBottom: "25px",
//               textAlign: "left",
//             }}
//           >
//             Our Recent Projects
//           </h2>
//           <img
//             src={vectoricon}
//             alt="underline"
//             style={{
//               position: "absolute",
//               bottom: "-11px",
//               left: "140px",
//               width: "100px",
//               height: "auto",
//               pointerEvents: "none",
//             }}
//           />
//         </div>

//         {/* Custom Scrollable Carousel */}
//         <div
//           className="custom-scroll-carousel"
//           style={{
//             overflowX: "auto",
//             display: "flex",
//             gap: "16px",
//             paddingBottom: "8px",
//             scrollSnapType: "x mandatory",
//             paddingLeft: "15px",
//           }}
//         >
//           {[img2, img2, img3].map((img, index) => (
//             <div
//               key={index}
//               style={{
//                 minWidth: "80%",
//                 flexShrink: 0,
//                 scrollSnapAlign: "start",
//               }}
//             >
//               <img
//                 src={img}
//                 alt={`Project ${index + 1}`}
//                 style={{
//                   width: "100%",
//                   height: "300px", // Reduced height
//                   borderRadius: "20px",
//                   objectFit: "cover",
//                 }}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Indicators + Button Row */}
//         <div className="d-flex justify-content-between align-items-center mt-3">
//           <div className="d-flex gap-2" style={{ marginLeft: "8%" }}>
//             <div
//               style={{
//                 width: "14px",
//                 height: "4px",
//                 backgroundColor: "#ff0000",
//                 borderRadius: "4px",
//               }}
//             ></div>
//             <div
//               style={{
//                 width: "14px",
//                 height: "4px",
//                 backgroundColor: "#ccc",
//                 borderRadius: "4px",
//               }}
//             ></div>
//             <div
//               style={{
//                 width: "14px",
//                 height: "4px",
//                 backgroundColor: "#ccc",
//                 borderRadius: "4px",
//               }}
//             ></div>
//           </div>
//           <Button
//             variant="outline-danger"
//             style={{
//               fontWeight: 600,
//               borderRadius: "30px",
//               padding: "6px 16px",
//               fontSize: "12px",
//             }}
//           >
//             EXPLORE ALL
//           </Button>
//         </div>
//       </div>

//       {/* faq */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             padding: "60px 20px",
//             width: "900px",
//             margin: "0 auto",
//             textAlign: "center",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "32px",
//               fontWeight: "600",
//               textAlign: "center",
//               marginBottom: "40px",
//               position: "relative",

//               display: "inline-block",
//             }}
//           >
//             Frequently Asked Questions
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "300px",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           {/* FAQ Items */}
//           <div style={{ marginTop: "40px" }}>
//             {faqData.map((question, index) => (
//               <div
//                 key={index}
//                 onClick={() => toggle(index)}
//                 style={{
//                   background: "#fff",
//                   borderRadius: "12px",
//                   marginBottom: "16px",
//                   padding: "16px 24px",
//                   boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <span style={{ fontWeight: 500, fontSize: "16px" }}>
//                     {question}
//                   </span>
//                   <span style={{ fontSize: "16px", fontWeight: "bold" }}>
//                     {openIndex === index ? "−" : "+"}
//                   </span>
//                 </div>
//                 {openIndex === index && (
//                   <p style={{ marginTop: "12px", color: "#555" }}>
//                     {/* You can customize this text per FAQ */}
//                     Yes, all our painters are trained through a certified
//                     onboarding and background verification process.
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             padding: "60px 20px",
//             maxWidth: "900px",
//             margin: "0 auto",
//             textAlign: "center",
//           }}
//         >
//           {/* Heading */}
//           <div
//             style={{
//               position: "relative",
//               display: "inline-block",
//               marginBottom: "40px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "600",
//                 margin: 0,
//               }}
//             >
//               Frequently Asked Questions
//             </h2>
//             <img
//               src={vectoricon}
//               alt="underline"
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 width: "130px",
//                 height: "auto",
//                 pointerEvents: "none",
//               }}
//             />
//           </div>

//           {/* FAQ List */}
//           <div style={{ marginTop: "40px" }}>
//             {faqData.map((question, index) => (
//               <div
//                 key={index}
//                 onClick={() => toggle(index)}
//                 style={{
//                   background: "#fff",
//                   borderRadius: "12px",
//                   marginBottom: "16px",
//                   padding: "16px 24px",
//                   boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontWeight: 500,
//                       fontSize: "16px",
//                       textAlign: "left",
//                     }}
//                   >
//                     {question}
//                   </span>
//                   <span style={{ fontSize: "16px", fontWeight: "bold" }}>
//                     {openIndex === index ? "−" : "+"}
//                   </span>
//                 </div>
//                 {openIndex === index && (
//                   <p
//                     style={{
//                       marginTop: "12px",
//                       color: "#555",
//                       fontSize: "14px",
//                       textAlign: "left",
//                     }}
//                   >
//                     {/* You can replace this with real answers per question if needed */}
//                     Yes, all our painters are trained through a certified
//                     onboarding and background verification process.
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* reviewa */}
//       <div className="d-none d-lg-block">
//         <div
//           style={{
//             background: "#f4e6ff",
//             padding: "60px 20px",
//             borderRadius: "30px",
//             width: "1200px",
//             textAlign: "center",
//             // maxWidth: '1200px',
//             margin: "40px auto",
//           }}
//         >
//           {/* Heading */}
//           <h2
//             style={{
//               textAlign: "center",
//               fontSize: "32px",
//               fontWeight: "bold",
//               marginBottom: "40px",
//               position: "relative",
//               display: "inline-block",
//             }}
//           >
//             Customer Reviews
//             <img
//               src={vectoricon}
//               alt=""
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "100px",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           {/* Rating and Media */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "20px",
//               padding: "20px",
//               display: "flex",
//               textAlign: "",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               alignItems: "center",
//               marginBottom: "40px",
//             }}
//           >
//             <div style={{ flex: "1 1 260px", padding: "10px" }}>
//               <h1 style={{ fontSize: "40px", margin: "0", fontWeight: "bold" }}>
//                 4.94{" "}
//                 <span style={{ fontSize: "16px", fontWeight: "normal" }}>
//                   /5
//                 </span>
//               </h1>
//               <div
//                 style={{ margin: "10px 0", fontSize: "16px", color: "#111" }}
//               >
//                 ⭐️⭐️⭐️⭐️⭐️
//                 <div style={{ fontSize: "14px", color: "#777" }}>
//                   2,452 Ratings
//                 </div>
//               </div>

//               {/* Rating breakdown */}
//               <div style={{ marginTop: "20px" }}>
//                 {[5, 4, 3, 2, 1].map((star, idx) => {
//                   const ratings = { 5: 1524, 4: 235, 3: 152, 2: 95, 1: 20 };
//                   const total = 2452;
//                   const width = (ratings[star] / total) * 100;

//                   return (
//                     <div
//                       key={idx}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         fontSize: "13px",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <span style={{ width: "20px" }}>{star}★</span>
//                       <div
//                         style={{
//                           flex: 1,
//                           margin: "0 10px",
//                           background: "#eee",
//                           height: "6px",
//                           borderRadius: "4px",
//                           overflow: "hidden",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: `${width}%`,
//                             background: "#fbbc04",
//                             height: "100%",
//                           }}
//                         />
//                       </div>
//                       <span style={{ minWidth: "30px", textAlign: "right" }}>
//                         {ratings[star]}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div style={{ flex: "2", padding: "10px", textAlign: "center" }}>
//               <h3 style={{ fontWeight: "600" }}>Customer Photos And Videos</h3>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: "10px",
//                   marginTop: "10px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {[
//                   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
//                   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
//                   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
//                   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80",
//                   // 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80'
//                 ].map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt="Customer media"
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       borderRadius: "12px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* All Reviews */}
//           <h3
//             style={{
//               textAlign: "center",
//               fontWeight: "600",
//               marginBottom: "20px",
//             }}
//           >
//             All Reviews
//           </h3>

//           {reviewers.map((person, index) => (
//             <div
//               key={index}
//               style={{
//                 backgroundColor: "#fff",
//                 padding: "20px",
//                 borderRadius: "15px",
//                 marginBottom: "16px",
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "16px",
//               }}
//             >
//               <img
//                 src={randomAvatars[index % randomAvatars.length]}
//                 alt={person.name}
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={{ flex: 1, textAlign: "left" }}>
//                 <h4 style={{ margin: "0 0 4px", fontSize: "16px" }}>
//                   {person.name}
//                 </h4>
//                 <span style={{ fontSize: "13px", color: "#777" }}>
//                   PageMaker
//                 </span>
//                 <p style={{ marginTop: "10px", fontSize: "14px" }}>
//                   {person.review}
//                 </p>
//               </div>
//               <div style={{ borderColor: "#fff" }}>⭐️⭐️⭐️⭐️⭐️</div>
//             </div>
//           ))}

//           {/* Load More Button */}
//           <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <button
//               style={{
//                 backgroundColor: "#fff",
//                 color: "#e60000",
//                 border: "1px solid #e60000",
//                 padding: "10px 24px",
//                 borderRadius: "999px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//               }}
//             >
//               LOAD MORE
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="d-block d-lg-none">
//         <div
//           style={{
//             background: "#f4e6ff",
//             padding: "60px 20px",
//             borderRadius: "30px",
//             width: "90%",
//             maxWidth: "1200px",
//             margin: "40px auto",
//             textAlign: "center",
//           }}
//         >
//           {/* Heading */}
//           <h2
//             style={{
//               textAlign: "center",
//               fontSize: "32px",
//               fontWeight: "bold",
//               marginBottom: "40px",
//               position: "relative",
//               whiteSpace: "nowrap",
//               display: "inline-block",
//             }}
//           >
//             Customer Reviews
//             <img
//               src={vectoricon}
//               alt="underline"
//               style={{
//                 position: "absolute",
//                 bottom: "-14px",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 width: "130px",
//                 height: "auto",
//                 borderRadius: "10px",
//                 pointerEvents: "none",
//               }}
//             />
//           </h2>

//           {/* Rating & Photos */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "20px",
//               padding: "20px",
//               display: "flex",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               alignItems: "center",
//               marginBottom: "40px",
//             }}
//           >
//             {/* Rating Box */}
//             <div style={{ flex: "1 1 260px", padding: "10px" }}>
//               <h1 style={{ fontSize: "40px", margin: "0", fontWeight: "bold" }}>
//                 4.94{" "}
//                 <span style={{ fontSize: "16px", fontWeight: "normal" }}>
//                   /5
//                 </span>
//               </h1>
//               <div
//                 style={{ margin: "10px 0", fontSize: "16px", color: "#111" }}
//               >
//                 ⭐️⭐️⭐️⭐️⭐️
//                 <div style={{ fontSize: "14px", color: "#777" }}>
//                   2,452 Ratings
//                 </div>
//               </div>

//               {/* Rating breakdown */}
//               <div style={{ marginTop: "20px" }}>
//                 {[5, 4, 3, 2, 1].map((star) => {
//                   const ratings = { 5: 1524, 4: 235, 3: 152, 2: 95, 1: 20 };
//                   const total = 2452;
//                   const width = (ratings[star] / total) * 100;

//                   return (
//                     <div
//                       key={star}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         fontSize: "13px",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <span style={{ width: "20px" }}>{star}★</span>
//                       <div
//                         style={{
//                           flex: 1,
//                           margin: "0 10px",
//                           background: "#eee",
//                           height: "6px",
//                           borderRadius: "4px",
//                           overflow: "hidden",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: `${width}%`,
//                             background: "#fbbc04",
//                             height: "100%",
//                           }}
//                         />
//                       </div>
//                       <span style={{ minWidth: "30px", textAlign: "right" }}>
//                         {ratings[star]}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Customer Media */}
//             <div style={{ flex: "2", padding: "10px", textAlign: "center" }}>
//               <p style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
//                 Customer Photos And Videos
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: "10px",
//                   marginTop: "10px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {[1, 2, 3, 4].map((i) => (
//                   <img
//                     key={i}
//                     src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80"
//                     alt="Customer media"
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       borderRadius: "12px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Reviews */}
//           <h3
//             style={{
//               textAlign: "center",
//               fontWeight: "600",
//               marginBottom: "20px",
//             }}
//           >
//             All Reviews
//           </h3>

//           {reviewers.map((person, index) => (
//             <div
//               key={index}
//               style={{
//                 backgroundColor: "#fff",
//                 padding: "16px",
//                 borderRadius: "15px",
//                 marginBottom: "16px",
//                 display: "flex",
//                 gap: "14px",
//                 alignItems: "flex-start",
//                 position: "relative",
//               }}
//             >
//               {/* Avatar */}
//               <img
//                 src={randomAvatars[index % randomAvatars.length]}
//                 alt={person.name}
//                 style={{
//                   width: "48px",
//                   height: "48px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                   flexShrink: 0,
//                 }}
//               />

//               {/* Content */}
//               <div style={{ flex: 1 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                   }}
//                 >
//                   <div>
//                     <h4
//                       style={{
//                         margin: 0,
//                         fontSize: "15px",
//                         fontWeight: 600,
//                         textAlign: "left",
//                       }}
//                     >
//                       {person.name}
//                     </h4>
//                     <span
//                       style={{
//                         fontSize: "13px",
//                         color: "#777",
//                         textAlign: "left",
//                       }}
//                     >
//                       PageMaker
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "14px",
//                       color: "#fbbc04",
//                       whiteSpace: "nowrap",
//                       border: "none",
//                       outline: "none",
//                     }}
//                   >
//                     ⭐️⭐️⭐️⭐️⭐️
//                   </div>
//                 </div>

//                 <p
//                   style={{
//                     marginTop: "8px",
//                     fontSize: "14px",
//                     lineHeight: 1.5,
//                     color: "#333",
//                     textAlign: "left",
//                   }}
//                 >
//                   {person.review}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {/* Load More Button */}
//           <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <button
//               style={{
//                 backgroundColor: "#fff",
//                 color: "#e60000",
//                 border: "1px solid #e60000",
//                 padding: "10px 24px",
//                 borderRadius: "999px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//               }}
//             >
//               LOAD MORE
//             </button>
//           </div>
//         </div>
//       </div>

//       <Modal
//         show={showOptionOpoup}
//         size="small"
//         centered
//         backdrop="static"
//         keyboard={false}
//         onHide={() => {
//           // ✅ close first, open address only after modal is fully removed from DOM
//           openAddressAfterOptionCloseRef.current = true;
//           setShowOptionOpoup(false);
//         }}
//         onExited={() => {
//           if (openAddressAfterOptionCloseRef.current) {
//             openAddressAfterOptionCloseRef.current = false;
//             setShowAddress(true);
//           }
//         }}
//       >
//         <Modal.Header closeButton></Modal.Header>
//         <Modal.Body>
//           <div className="row">
//             <div className="col-md-6">
//               <div
//                 style={{ cursor: "pointer" }}
//                 onClick={async () => {
//                   try {
//                     console.log("📍 Current Location selected");
//                     const loc = await getCurrentLocationDraft();
//                     setShowOptionOpoup(false);

//                     // ✅ EXISTING -> CURRENT LOCATION: locked map, editable house/landmark
//                     setAddressPickerCfg({
//                       address: loc.address || "",
//                       houseNumber: "",
//                       landmark: "",
//                       lat: Number(loc.latitude),
//                       lng: Number(loc.longitude),
//                       city: loc.city || "",
//                       allowSearch: false,
//                       allowMapPick: false,
//                       disableHouseFlat: false,
//                       disableLandmark: false,
//                       showChangeButton: true,
//                       primaryCtaLabel: "Save & Proceed",
//                     });

//                     setTimeout(() => setShowAddress(true), 100);
//                   } catch (e) {
//                     console.error("Failed to get current location:", e);
//                     alert("Unable to fetch current location");
//                   }
//                 }}
//               >
//                 <img
//                   src={map}
//                   style={{ width: "50%" }}
//                   alt="Current Location"
//                 />
//                 <p style={{ textAlign: "center", marginTop: 10 }}>
//                   Current Location
//                 </p>
//               </div>
//             </div>

//             {/* Search Location Option */}
//             <div className="col-md-6">
//               <div
//                 style={{ cursor: "pointer" }}
//                 onClick={() => {
//                   console.log("🔍 Search by Location selected");
//                   const cached = JSON.parse(
//                     sessionStorage.getItem("selectedAddress") || "null"
//                   );
//                   setShowOptionOpoup(false);

//                   // ✅ EXISTING -> SEARCH LOCATION: fully editable
//                   setAddressPickerCfg({
//                     address: cached?.address || "",
//                     houseNumber: "",
//                     landmark: "",
//                     lat: cached?.latitude ? Number(cached.latitude) : null,
//                     lng: cached?.longitude ? Number(cached.longitude) : null,
//                     city: cached?.city || "",
//                     allowSearch: true,
//                     allowMapPick: true,
//                     disableHouseFlat: false,
//                     disableLandmark: false,
//                     showChangeButton: false,
//                     primaryCtaLabel: "Save & Proceed",
//                   });

//                   setTimeout(() => setShowAddress(true), 100);
//                 }}
//               >
//                 <img
//                   src={searchLocation}
//                   style={{ width: "50%" }}
//                   alt="Search Location"
//                 />
//                 <p style={{ textAlign: "center", marginTop: 10 }}>
//                   Search By Location
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       <SlotSelectionModal
//         show={showSlotModal}
//         onClose={handleCloseSlotModal}
//         handleSelectSlot={handleSelectSlot}
//         fetchAvailableSlots={fetchAvailableSlots}
//         type="booking"
//       />

//       {showAddress && (
//         <AddressPickerModal
//           show={showAddress}
//           onClose={() => setShowAddress(false)}
//           initialLatLng={{
//             lat: addressPickerCfg.lat || 12.9716,
//             lng: addressPickerCfg.lng || 77.5946,
//           }}
//           initialAddress={addressPickerCfg.address || ""}
//           initialHouseFlat={addressPickerCfg.houseNumber || ""}
//           initialLandmark={addressPickerCfg.landmark || ""}
//           initialCity={addressPickerCfg.city || ""}
//           allowSearch={addressPickerCfg.allowSearch}
//           allowMapPick={addressPickerCfg.allowMapPick}
//           disableHouseFlat={addressPickerCfg.disableHouseFlat}
//           disableLandmark={addressPickerCfg.disableLandmark}
//           primaryCtaLabel={addressPickerCfg.primaryCtaLabel}
//           showChangeButton={addressPickerCfg.showChangeButton}
//           onClickChange={() => {
//             setShowAddress(false);
//             setTimeout(() => setShowOptionOpoup(true), 100);
//           }}
//           onSave={(payload) => handleSaveAddressFromModal(payload)}
//         />
//       )}
//     </>
//   );
// };

// const dotStyle = {
//   width: "20px",
//   height: "20px",
//   borderRadius: "50%",
//   backgroundColor: "#fff", // center white
//   border: "6px solid #6c7b7c", // outer ring
//   marginRight: "12px",
//   display: "inline-block",
// };

// export default Services;
