import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Carousel, Form, Modal } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";
import serviceBg from "../assets/service-bg.svg";
import exterior from "../assets/exterior.png";
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
import { API_ENDPOINTS } from "../ApiService/apiConstants";
import { useAddressContext } from "../utils/AddressContext";
// import { NotificationManager } from "react-notifications";

const Deepcleaning = () => {
  const navigate = useNavigate();
  // const activeIndex = 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [joinedOtp, setJoinedOTP] = useState(null);
  const [otpValue, setOtpValue] = useState(null);
  // const [searchInput, setSearchInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const videos = [testimonialVideo, testimonialVideo, testimonialVideo];
  const inputRefs = useRef([]);

  const { setAddressDataContext } = useAddressContext();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const [mapAddress, setMapAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");

  const [showAnotherPopup, setAnotherPopup] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem("user"));

  // const handleProceedClick = async () => {
  //   try {
  //     setShowModal(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  console.log("otp", otp);
  const formData = {
    mobileNumber: phoneNumber,
    userName: userName,
  };

  const handleProceedClick = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !userName) {
      alert("Please enter your Name and Phone number");
    }
    try {
      const result = await postRequest(
        API_ENDPOINTS.LOGIN_WITH_MOBILE,
        formData
      );
      console.log("Login Success", result);
      alert(result.message || "Login successful");
      setOtpValue(result.otp);
      // setUserName("");
      // setPhoneNumber("");
      // NotificationManager.success(result.message || "Login successful");
      setShowModal(true);
    } catch (error) {
      console.error("Login failed:", error);
      // NotificationManager.error(error.message || "Login failed");
    }
  };

  const verifyOTP = async () => {
    if (joinedOtp === null) {
      alert("Please enter OTP");
    }
    try {
      const data = { otp: joinedOtp, mobileNumber: phoneNumber };
      const result = await postRequest(API_ENDPOINTS.VERIFY_OTP, data);
      console.log("OTP Verified", result);
      alert(result.message || "OTP verified successfully");
      // console.log("otp verified");
      if (result.data) {
        sessionStorage.setItem("user", JSON.stringify(result.data));
      }
      console.log("otp verified");
      setShowModal(false);
      // setOtpValue(null);
      setIsLocationModalVisible(true);
    } catch (error) {
      alert(error.message || "Invalid OTP");
      console.error("Login failed:", error);
    }
  };

  const ResendOTP = async () => {
    try {
      const result = await postRequest(API_ENDPOINTS.RESEND_OTP, formData);
      console.log("OTP Re-sent", result);
      alert(result.message || "OTP Re-sent");
      setOtpValue(result.otp);
    } catch (error) {
      console.error("OTP Re-sent Error:", error);
      // NotificationManager.error(error.message || "Login failed");
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await getRequest(
        `${API_ENDPOINTS.GET_ADDRESS}${userData?._id}`
      );
      console.log("API Res", `${API_ENDPOINTS.GET_ADDRESS}${userData?._id}`);
      setUserAddress(response.address);
    } catch (error) {
      console.error("GET error:", error.response || error);
      throw error.response ? error.response.data : error;
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, [userData?._id]);

  const handleCloseModal = () => {
    setShowModal(false);
    setOtp(["", "", "", "", "", ""]);
  };

  // const handleSubmitOTP = () => {
  //   setShowModal(false); // Hide OTP modal
  //   setIsLocationModalVisible(true); // Show location modal
  // };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    const joinString = newOtp?.join("");
    // setOtp(joinString);
    setJoinedOTP(joinString);
    setOtp(newOtp);
    if (value && index < 7) {
      inputRefs.current[index + 1].focus();
    }
  };

  console.log("joinedOtp", joinedOtp);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSelectAddress = (addr) => {
    console.log(addr);
    setAddressDataContext(addr);
    setSelectedAddressId(addr.uniqueCode);
    sessionStorage.setItem("selectedAddress", JSON.stringify(addr));
    // navigate("/deep-cleaning-packages");
  };

  const handleAddress = async () => {
    console.log("function called");
    const uniqueCode = `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const data = {
      savedAddress: {
        uniqueCode: uniqueCode,
        address: mapAddress,
        houseNumber: houseNumber,
        landmark: landmark,
      },
    };

    if (!houseNumber.trim()) return alert("House/Flat Number is required");

    try {
      const result = await putRequest(
        `${API_ENDPOINTS.SAVE_ADDRESS}${userData?._id}`,
        data
      );
      setAddressDataContext(data.savedAddress);
      sessionStorage.setItem(
        "selectedAddress",
        JSON.stringify(data.savedAddress)
      );
      setShowLocationPopup(false);
      setAnotherPopup(false);
      console.log("Address Saved", result);
      // handleClose();
      navigate("/deep-cleaning-packages");
      alert(result.message || "Address Saved");
    } catch (error) {
      console.error("Address failed:", error);
    }
  };

  // const handleCurrentLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;

  //       setCoords({ lat, lng });
  //       setMapUrl(
  //         `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  //       );

  //       try {
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  //         );
  //         const data = await response.json();
  //         setMapAddress(data.display_name || "Unknown location");
  //       } catch (error) {
  //         console.error("Error fetching address:", error);
  //       }

  //       setShowLocationPopup(true);
  //     },
  //     (error) => {
  //       console.error("Location Error:", error);
  //       alert("Unable to access your location.");
  //     }
  //   );
  // };

  const handleCurrentLocation = () => {
    const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    // Clear any previous watch ID if you were using one (optional safeguard)
    // navigator.geolocation.clearWatch(previousWatchId);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Lat:", latitude, "Lng:", longitude);

        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

        try {
          const response = await fetch(geocodingUrl);
          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            const addressComponents = data.results[0].address_components;

            const city = addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name;

            const town = addressComponents.find((component) =>
              component.types.includes("sublocality_level_1")
            )?.long_name;

            // ✅ Update map URL and address
            setMapUrl(
              `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
            );
            setMapAddress(address || `${city || ""} ${town || ""}`);
            setIsLocationModalVisible(false);
            setShowLocationPopup(true);
          } else {
            alert("Could not fetch a valid address from your location.");
          }
        } catch (error) {
          console.error("Geocoding Error:", error);
          alert("Something went wrong while fetching the address.");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        if (error.code === 1) {
          alert("Permission to access location was denied.");
        } else if (error.code === 2) {
          alert("Location unavailable.");
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // ✅ increase timeout to reduce "Timeout expired" error
        maximumAge: 0, // Always fetch fresh location
      }
    );
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
      name: "Sandhya Nair",
      review:
        "I availed painting and false ceiling services from Homjee in Mar 2023 after much research... Read more",
    },
    {
      name: "Aniket Sharma",
      review:
        "Quality work at affordable prices, team is very polite and skilled...",
    },
    {
      name: "Deepak Patil",
      review:
        "Homjee commitment to timelines is commendable. They completed our project ahead of schedule...",
    },
    {
      name: "Yuvraj Chourasia",
      review: "Painter was very punctual, professional, and hard working...",
    },
    {
      name: "Lucky Sharma",
      review:
        "Work done was good and they even completed the work in promised time...",
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

  const handleLocationSelected = (location) => {
    if (location === "Current Location") {
      // Redirect to checkout page with location info
      navigate("/checkoutcleaning", {
        state: { phoneNumber, openAddressModal: true },
      });
    }
  };
  console.log("userAddress", userAddress);
  return (
    <>
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
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter WhatsApp Phone Number"
              value={phoneNumber}
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
            onClick={handleProceedClick}
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
          {showModal && !isLocationModalVisible && (
            <>
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
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
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
                    onClick={ResendOTP}
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
          {/* saved adress */}
          <Modal
            centered
            backdrop="static"
            keyboard={false}
            show={isLocationModalVisible}
            onHide={() => setIsLocationModalVisible(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Saved Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                style={{
                  color: "#e60000",
                  fontSize: 14,
                  textAlign: "left",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
                onClick={handleCurrentLocation}
                // onClick={() => {
                // setShowLocationPopup(true);
                // setIsLocationModalVisible(false);
                // }}
              >
                + Add new address
              </div>
              {userAddress && userAddress?.length > 0 && (
                <div className="mt-4">
                  {userAddress?.map((ele, idx) => (
                    <div key={idx}>
                      <div
                        className="row"
                        style={{
                          marginBottom: 10,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => handleSelectAddress(ele)}
                      >
                        <div className="col-md-1">
                          <Form.Check
                            type="radio"
                            id={ele.uniqueCode}
                            name="selectedAddress"
                            checked={ele.uniqueCode === selectedAddressId}
                            onChange={() => handleSelectAddress(ele)}
                          />
                        </div>

                        <div
                          className="col-md-11"
                          style={{
                            fontSize: "12px",
                            textAlign: "left",
                          }}
                        >
                          {ele.houseNumber}, {ele.address}
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              )}
              {selectedAddressId !== null && (
                <div
                  // onClick={handleCurrentLocation}
                  onClick={() => navigate("/deep-cleaning-packages")}
                  style={{
                    backgroundColor: "#FF0000",
                    color: "white",
                    cursor: "pointer",
                    padding: "10px",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  Procced
                </div>
              )}

              <div
                style={{
                  textAlign: "center",
                  color: "#888",
                  fontSize: 12,
                  marginTop: 20,
                }}
              >
                powered by{" "}
                <span style={{ color: "#4285F4", fontWeight: 600 }}>G</span>
                <span style={{ color: "#EA4335", fontWeight: 600 }}>o</span>
                <span style={{ color: "#FBBC05", fontWeight: 600 }}>o</span>
                <span style={{ color: "#4285F4", fontWeight: 600 }}>g</span>
                <span style={{ color: "#34A853", fontWeight: 600 }}>l</span>
                <span style={{ color: "#EA4335", fontWeight: 600 }}>e</span>
              </div>
            </Modal.Body>
          </Modal>
          {/* asking current location */}
          {/* <Modal
            centered
            backdrop="static"
            keyboard={false}
            show={showAnotherPopup}
            onHide={() => {
              setAnotherPopup(false);
              setIsLocationModalVisible(true);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>Add New Address</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                onClick={handleCurrentLocation}
                style={{
                  color: "#FF0000",
                  cursor: "pointer",
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <FaMapMarkerAlt style={{ marginRight: 8 }} />
                Use current location
              </div>
            </Modal.Body> 
          </Modal> */}
          {/* showing current location */}
          <Modal
            show={showLocationPopup}
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
            onHide={() => {
              setShowLocationPopup(false);
              // setAnotherPopup(true);
              setIsLocationModalVisible(true);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>Current Location</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={mapUrl}
                  />
                </div>
                <div className="col-md-6">
                  <div>
                    <div
                      style={{
                        marginBottom: 16,
                      }}
                    >
                      {/* <Button
                        variant="outline-danger"
                        onClick={() => {
                          setAnotherPopup(true);
                          console.log("popup opened");
                        }}
                        style={{
                          marginBottom: 20,
                        }}
                      >
                        Change
                      </Button> */}
                      <div style={{ fontSize: 14 }}>{mapAddress}</div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        House/Flat Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="Enter House/Flat Number"
                        style={{ borderRadius: 8, fontSize: 14 }}
                      />
                    </Form.Group>
                    {/* <Form.Group className="mb-3">
                      <Form.Label>
                        Street Location <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        // value={mapAddress}
                        // onChange={(e) => setMapAddress(e.target.value)}
                        placeholder="Enter House/Flat Number"
                        style={{ borderRadius: 8, fontSize: 14 }}
                      />
                    </Form.Group> */}
                    <Form.Group className="mb-3">
                      <Form.Label>Landmark (Optional)</Form.Label>
                      <Form.Control
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Enter Landmark"
                        style={{ borderRadius: 8, fontSize: 14 }}
                      />
                    </Form.Group>

                    <Button
                      onClick={handleAddress}
                      disabled={!houseNumber.trim()}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: !houseNumber.trim() ? "#eee" : "#FF0000",
                        color: !houseNumber.trim() ? "#aaa" : "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 15,
                        // fontWeight: 600,
                        cursor: !houseNumber.trim() ? "not-allowed" : "pointer",
                      }}
                    >
                      Save and proceed
                    </Button>
                  </div>
                </div>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>vcbnvcnbvc</Modal.Footer> */}
          </Modal>
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
          For All Your Deep Cleaning Needs
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

      {/* transperency */}
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

      {/* package */}
      {/* Desktop Version */}
      <div className="d-none d-lg-block">
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "30px",
            padding: "50px 20px",
            width: "1200px",
            margin: "40px auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
              Choose Your Package
            </h2>
            <p style={{ fontSize: "16px", color: "#666" }}>
              Select the best package that suits your needs
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
            }}
          >
            {[
              {
                name: "Basic",
                price: "₹999",
                features: ["1 Room Cleaning", "1 Bathroom", "Dry Dusting"],
              },
              {
                name: "Standard",
                price: "₹1999",
                features: [
                  "2 BHK Cleaning",
                  "2 Bathrooms",
                  "Wet & Dry Dusting",
                ],
              },
              {
                name: "Premium",
                price: "₹2999",
                features: [
                  "3 BHK Full Cleaning",
                  "3 Bathrooms",
                  "Deep Sanitization",
                ],
              },
            ].map((pkg, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  padding: "30px 20px",
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                }}
              >
                <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>
                  {pkg.name}
                </h4>
                <h3
                  style={{
                    color: "#e60000",
                    fontWeight: "700",
                    marginBottom: "20px",
                  }}
                >
                  {pkg.price}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    marginBottom: "20px",
                  }}
                >
                  {pkg.features.map((f, i) => (
                    <li
                      key={i}
                      style={{ marginBottom: "8px", fontSize: "14px" }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  style={{
                    backgroundColor: "#e60000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "30px",
                    padding: "10px 24px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="d-block d-lg-none">
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "30px 16px",
            margin: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "22px", fontWeight: "600" }}>
              Choose Your Package
            </h3>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Select a plan that fits your need
            </p>
          </div>

          {[
            {
              name: "Basic",
              price: "₹999",
              features: ["1 Room Cleaning", "1 Bathroom", "Dry Dusting"],
            },
            {
              name: "Standard",
              price: "₹1999",
              features: ["2 BHK Cleaning", "2 Bathrooms", "Wet & Dry Dusting"],
            },
            {
              name: "Premium",
              price: "₹2999",
              features: [
                "3 BHK Full Cleaning",
                "3 Bathrooms",
                "Deep Sanitization",
              ],
            },
          ].map((pkg, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #eee",
                borderRadius: "16px",
                padding: "24px 16px",
                marginBottom: "20px",
                textAlign: "center",
                backgroundColor: "#fdfdfd",
              }}
            >
              <h4 style={{ fontWeight: "600", marginBottom: "8px" }}>
                {pkg.name}
              </h4>
              <h3
                style={{
                  color: "#e60000",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                {pkg.price}
              </h3>
              <ul
                style={{ listStyle: "none", padding: 0, marginBottom: "16px" }}
              >
                {pkg.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: "6px", fontSize: "13px" }}>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                style={{
                  backgroundColor: "#e60000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "25px",
                  padding: "8px 20px",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Select
              </Button>
            </div>
          ))}
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
                src={randomAvatars[index % randomAvatars.length]}
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
                <span style={{ fontSize: "13px", color: "#777" }}>
                  PageMaker
                </span>
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
      <div className="d-block d-lg-none">
        <div
          style={{
            background: "#f4e6ff",
            padding: "60px 20px",
            borderRadius: "30px",
            width: "90%",
            maxWidth: "1200px",
            margin: "40px auto",
            textAlign: "center",
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
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            Customer Reviews
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
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </h2>

          {/* Rating & Photos */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            {/* Rating Box */}
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
                {[5, 4, 3, 2, 1].map((star) => {
                  const ratings = { 5: 1524, 4: 235, 3: 152, 2: 95, 1: 20 };
                  const total = 2452;
                  const width = (ratings[star] / total) * 100;

                  return (
                    <div
                      key={star}
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

            {/* Customer Media */}
            <div style={{ flex: "2", padding: "10px", textAlign: "center" }}>
              <p style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
                Customer Photos And Videos
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&h=120&q=80"
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

          {/* Reviews */}
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
                padding: "16px",
                borderRadius: "15px",
                marginBottom: "16px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              {/* Avatar */}
              <img
                src={randomAvatars[index % randomAvatars.length]}
                alt={person.name}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      {person.name}
                    </h4>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#777",
                        textAlign: "left",
                      }}
                    >
                      PageMaker
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#fbbc04",
                      whiteSpace: "nowrap",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    ⭐️⭐️⭐️⭐️⭐️
                  </div>
                </div>

                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#333",
                    textAlign: "left",
                  }}
                >
                  {person.review}
                </p>
              </div>
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

export default Deepcleaning;
