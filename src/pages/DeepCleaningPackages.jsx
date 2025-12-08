import React, { useContext, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "./CartContext";
import FurnishedApartmentModal from "./services/FurnishedApartmentModal";
import UnfurnishedApartmentModal from "./services/UnfurnishedApartmentModal";
import BookByRoomModal from "./services/BookByRoomModal";
import FurnishedBungalowModal from "./services/FurnishedBungalowModal";
import UnfurnishedBungalowModal from "./services/UnfurnishedBungalowModal";
import MiniServicesModal from "./services/MiniServicesModal";
import sparkling from "../assets/sparkling.jpeg";
import furnishedApartmentImg from "../assets/Furnishedapartment.webp";
import unfurnishedApartmentImg from "../assets/Unfurnishedapartment.webp";
import bookByRoomImg from "../assets/Bookbyroom.webp";
import furnishedBungalowImg from "../assets/Furnishedbungalow.webp";
import unfurnishedBungalowImg from "../assets/Unfurnishedbungalow.webp";
import miniServicesImg from "../assets/Miniservices.webp";
import one from "/media/one.webp";
import twwo from "/media/twwo.webp";
import three from "/media/three.webp";
import four from "/media/four.webp";
import five from "/media/five.webp";
import six from "/media/six.webp";
import seven from "/media/seven.webp";
import eight from "/media/eight.webp";
import nine from "/media/nine.webp";
import ten from "/media/ten.webp";
import eleven from "/media/eleven.webp";
import tweleve from "/media/tweleve.webp";
import thirteen from "/media/thirteen.webp";
import fourteen from "/media/fourteen.webp";
import fifteen from "/media/fifteen.webp";
import sixteen from "/media/sixteen.webp";
import seventeen from "/media/seventeen.webp";
import eighteen from "/media/eighteen.webp";
import ninteen from "/media/ninteen.webp";
import twenty from "/media/twenty.webp";
import twentyone from "/media/twentyone.webp";
import twentytwo from "/media/twentytwo.webp";
import twentythree from "/media/twentythree.webp";
import twentyfour from "/media/twentyfour.webp";
import twentyfive from "/media/twentyfive.webp";
import twentysix from "/media/twentysix.webp";
import twentyseven from "/media/twentyseven.webp";
import twentyeight from "/media/twentyeight.webp";
import twentynine from "/media/twentynine.webp";
import thirty from "/media/thirty.webp";
import thirtytwo from "/media/thirtytwo.webp";
import thirtythree from "/media/thirtythree.webp";
import thirtyfour from "/media/thirtyfour.webp";
import thirtyfive from "/media/thirtyfive.webp";
import SlotSelectionModal from "./SlotSelectionModal";
import { useSelectedSlotContext } from "../utils/SlotContext";
import { API_BASE_URL, API_ENDPOINTS } from "../ApiService/apiConstants";

// Map services to their corresponding images
const serviceImages = {
  "Furnished apartment": furnishedApartmentImg,
  "Unfurnished apartment": unfurnishedApartmentImg,
  "Book by room": bookByRoomImg,
  "Furnished bungalow/duplex": furnishedBungalowImg,
  "Unfurnished bungalow/duplex": unfurnishedBungalowImg,
  "Mini services": miniServicesImg,
};

// Map services to their modal components
const modalComponents = {
  "Furnished apartment": FurnishedApartmentModal,
  "Unfurnished apartment": UnfurnishedApartmentModal,
  "Book by room": BookByRoomModal,
  "Furnished bungalow/duplex": FurnishedBungalowModal,
  "Unfurnished bungalow/duplex": UnfurnishedBungalowModal,
  "Mini services": MiniServicesModal,
};

const cleaningServices = {
  "Furnished apartment": [
    {
      _id: "CLA1BHK001",
      name: "1 BHK Cleaning - Classic",
      reviews: "4.80 (15K reviews)",
      price: 3199,
      details: "Includes 1 bedroom, 1 bathroom, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes terrace & paint marks removal",
      image: one,
      teamMembers: 3,
    },
    {
      _id: "PRE1BHK002",
      name: "1 BHK Cleaning - Premium",
      reviews: "4.85 (12K reviews)",
      price: 4199,
      details:
        "Includes 1 bedroom, 1 bathroom, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      _id: "PLA1BHK003",
      name: "1 BHK Cleaning - Platinum",
      reviews: "4.90 (10K reviews)",
      price: 5199,
      details:
        "Includes 1 bedroom, 1 bathroom, 1 hall, 1 kitchen & 1 balcony with premium deep cleaning",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 3,
    },
    {
      name: "2 BHK Cleaning - Classic",
      reviews: "4.80 (41K reviews)",
      price: 3499,
      details:
        "Includes 2 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 2 balconies",
      extras: "Basic cleaning, excludes terrace & paint marks removal",
      image: twwo,
      teamMembers: 4,
    },
    {
      name: "2 BHK Cleaning - Premium",
      reviews: "4.85 (35K reviews)",
      price: 4499,
      details:
        "Includes 2 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 2 balconies with deep cleaning",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "2 BHK Cleaning - Platinum",
      reviews: "4.90 (30K reviews)",
      price: 5499,
      details:
        "Includes 2 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 2 balconies with premium deep cleaning",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
    {
      name: "3 BHK Cleaning - Classic",
      reviews: "4.85 (10K reviews)",
      price: 3999,
      details:
        "Includes 3 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes terrace & paint marks removal",
      image: three,
      teamMembers: 4,
    },
    {
      name: "3 BHK Cleaning - Premium",
      reviews: "4.88 (8K reviews)",
      price: 4999,
      details:
        "Includes 3 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "3 BHK Cleaning - Platinum",
      reviews: "4.92 (7K reviews)",
      price: 5999,
      details:
        "Includes 3 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 1 balcony with premium deep cleaning",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
    {
      name: "4 BHK Cleaning - Classic",
      reviews: "4.88 (8K reviews)",
      price: 4999,
      details:
        "Includes 4 bedrooms, 3 bathrooms, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes terrace & paint marks removal",
      image: four,
      teamMembers: 4,
    },
    {
      name: "4 BHK Cleaning - Premium",
      reviews: "4.90 (6K reviews)",
      price: 5999,
      details:
        "Includes 4 bedrooms, 3 bathrooms, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "4 BHK Cleaning - Platinum",
      reviews: "4.93 (5K reviews)",
      price: 6999,
      details:
        "Includes 4 bedrooms, 3 bathrooms, 1 hall, 1 kitchen & 1 balcony with premium deep cleaning",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
    {
      name: "5+ BHK Cleaning - Classic",
      reviews: "4.85 (5K reviews)",
      price: 5999,
      details:
        "Includes 5+ bedrooms, 3+ bathrooms, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes terrace & paint marks removal",
      image: five,
      teamMembers: 4,
    },
    {
      name: "5+ BHK Cleaning - Premium",
      reviews: "4.90 (4K reviews)",
      price: 6999,
      details:
        "Includes 5+ bedrooms, 3+ bathrooms, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "5+ BHK Cleaning - Platinum",
      reviews: "4.95 (3K reviews)",
      price: 7999,
      details:
        "Includes 5+ bedrooms, 3+ bathrooms, 1 hall, 1 kitchen & 1 balcony with premium deep cleaning",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
  ],
  "Unfurnished apartment": [
    {
      name: "1 BHK Cleaning - Classic",
      reviews: "4.75 (10K reviews)",
      price: 2799,
      details: "Includes 1 bedroom, 1 bathroom, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes paint marks removal",
      image: six,
      teamMembers: 2,
    },
    {
      name: "1 BHK Cleaning - Premium",
      reviews: "4.80 (8K reviews)",
      price: 3799,
      details:
        "Includes 1 bedroom, 1 bathroom, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 2,
    },
    {
      name: "2 BHK Cleaning - Classic",
      reviews: "4.78 (12K reviews)",
      price: 3099,
      details:
        "Includes 2 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 2 balconies",
      extras: "Basic cleaning, excludes paint marks removal",
      image: seven,
      teamMembers: 3,
    },
    {
      name: "2 BHK Cleaning - Premium",
      reviews: "4.82 (10K reviews)",
      price: 4099,
      details:
        "Includes 2 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 2 balconies with deep cleaning",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "3 BHK Cleaning - Classic",
      reviews: "4.80 (9K reviews)",
      price: 3599,
      details:
        "Includes 3 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes paint marks removal",
      image: eight,
      teamMembers: 3,
    },
    {
      name: "3 BHK Cleaning - Premium",
      reviews: "4.85 (7K reviews)",
      price: 4599,
      details:
        "Includes 3 bedrooms, 2 bathrooms, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "4 BHK Cleaning - Classic",
      reviews: "4.82 (6K reviews)",
      price: 4599,
      details:
        "Includes 4 bedrooms, 3 bathrooms, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes paint marks removal",
      image: nine,
      teamMembers: 4,
    },
    {
      name: "4 BHK Cleaning - Premium",
      reviews: "4.88 (5K reviews)",
      price: 5599,
      details:
        "Includes 4 bedrooms, 3 bathrooms, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "5+ BHK Cleaning - Classic",
      reviews: "4.80 (4K reviews)",
      price: 5599,
      details:
        "Includes 5+ bedrooms, 3+ bathrooms, 1 hall, 1 kitchen & 1 balcony",
      extras: "Basic cleaning, excludes paint marks removal",
      image: ten,
      teamMembers: 4,
    },
    {
      name: "5+ BHK Cleaning - Premium",
      reviews: "4.85 (3K reviews)",
      price: 6599,
      details:
        "Includes 5+ bedrooms, 3+ bathrooms, 1 hall, 1 kitchen & 1 balcony with deep cleaning",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 4,
    },
  ],
  "Book by room": [
    {
      name: "Bedroom Cleaning - Unfurnished",
      reviews: "4.70 (8K reviews)",
      price: 999,
      details: "Cleaning of one empty bedroom",
      extras: "Excludes furniture cleaning",
      image: eleven,
      teamMembers: 1,
    },
    {
      name: "Bedroom Cleaning - Furnished",
      reviews: "4.75 (9K reviews)",
      price: 1299,
      details: "Cleaning of one furnished bedroom",
      extras: "Includes furniture wiping, excludes upholstery cleaning",
      teamMembers: 1,
    },
    {
      name: "Living Room Cleaning - Unfurnished",
      reviews: "4.65 (7K reviews)",
      price: 899,
      details: "Cleaning of one empty living room",
      extras: "Excludes furniture cleaning",
      image: tweleve,
      teamMembers: 1,
    },
    {
      name: "Living Room Cleaning - Furnished",
      reviews: "4.70 (8K reviews)",
      price: 1199,
      details: "Cleaning of one furnished living room",
      extras: "Includes furniture wiping, excludes upholstery cleaning",
      teamMembers: 1,
    },
    {
      name: "Kitchen Cleaning - Occupied Kitchen",
      reviews: "4.75 (10K reviews)",
      price: 1499,
      details: "Cleaning of occupied kitchen without appliances",
      extras: "Excludes appliance cleaning",
      image: thirteen,
      teamMembers: 1,
    },
    {
      name: "Kitchen Cleaning - Occupied Kitchen With Appliances",
      reviews: "4.80 (9K reviews)",
      price: 1999,
      details: "Cleaning of occupied kitchen with appliances",
      extras: "Includes basic appliance cleaning",
      teamMembers: 1,
    },
    {
      name: "Kitchen Cleaning - Empty Kitchen",
      reviews: "4.70 (6K reviews)",
      price: 999,
      details: "Cleaning of empty kitchen",
      extras: "Excludes appliance cleaning",
      teamMembers: 1,
    },
    {
      name: "Kitchen Cleaning - Empty Kitchen With Appliances",
      reviews: "4.75 (5K reviews)",
      price: 1499,
      details: "Cleaning of empty kitchen with appliances",
      extras: "Includes basic appliance cleaning",
      teamMembers: 1,
    },
    {
      name: "Bathroom Cleaning",
      reviews: "4.85 (12K reviews)",
      price: 799,
      details: "Cleaning of one bathroom",
      extras: "Includes sanitization",
      image: fourteen,
      teamMembers: 1,
    },
    {
      name: "Balcony Cleaning - Small (Upto 3 ft width)",
      reviews: "4.60 (5K reviews)",
      price: 499,
      details: "Cleaning of small balcony",
      extras: "Excludes plant cleaning",
      image: fifteen,
      teamMembers: 4,
    },
    {
      name: "Balcony Cleaning - Big (larger than 3 ft)",
      reviews: "4.65 (4K reviews)",
      price: 799,
      details: "Cleaning of large balcony",
      extras: "Excludes plant cleaning",
      teamMembers: 1,
    },
  ],
  "Furnished bungalow/duplex": [
    {
      name: "<1200 sqft Bungalow Cleaning - Classic",
      reviews: "4.80 (5K reviews)",
      price: 5999,
      details: "Includes full bungalow cleaning under 1200 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: sixteen,
      teamMembers: 2,
    },
    {
      name: "<1200 sqft Bungalow Cleaning - Premium",
      reviews: "4.85 (4K reviews)",
      price: 6999,
      details: "Includes deep cleaning for bungalow under 1200 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 2,
    },
    {
      name: "<1200 sqft Bungalow Cleaning - Platinum",
      reviews: "4.90 (3K reviews)",
      price: 7999,
      details: "Includes premium deep cleaning for bungalow under 1200 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 2,
    },
    {
      name: "1200-2000 sqft Bungalow Cleaning - Classic",
      reviews: "4.82 (4.5K reviews)",
      price: 6999,
      details: "Includes full bungalow cleaning for 1200-2000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: seventeen,
      teamMembers: 3,
    },
    {
      name: "1200-2000 sqft Bungalow Cleaning - Premium",
      reviews: "4.87 (4K reviews)",
      price: 7999,
      details: "Includes deep cleaning for bungalow 1200-2000 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 2,
    },
    {
      name: "1200-2000 sqft Bungalow Cleaning - Platinum",
      reviews: "4.92 (3.5K reviews)",
      price: 8999,
      details: "Includes premium deep cleaning for bungalow 1200-2000 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 3,
    },
    {
      name: "2000-3000 sqft Bungalow Cleaning - Classic",
      reviews: "4.83 (4K reviews)",
      price: 7999,
      details: "Includes full bungalow cleaning for 2000-3000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: eighteen,
      teamMembers: 4,
    },
    {
      name: "2000-3000 sqft Bungalow Cleaning - Premium",
      reviews: "4.88 (3.5K reviews)",
      price: 8999,
      details: "Includes deep cleaning for bungalow 2000-3000 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "2000-3000 sqft Bungalow Cleaning - Platinum",
      reviews: "4.93 (3K reviews)",
      price: 9999,
      details: "Includes premium deep cleaning for bungalow 2000-3000 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
    {
      name: "3000-4000 sqft Bungalow Cleaning - Classic",
      reviews: "4.84 (3.5K reviews)",
      price: 9999,
      details: "Includes full bungalow cleaning for 3000-4000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: ninteen,
      teamMembers: 4,
    },
    {
      name: "3000-4000 sqft Bungalow Cleaning - Premium",
      reviews: "4.89 (3K reviews)",
      price: 10999,
      details: "Includes deep cleaning for bungalow 3000-4000 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "3000-4000 sqft Bungalow Cleaning - Platinum",
      reviews: "4.94 (2.5K reviews)",
      price: 11999,
      details: "Includes premium deep cleaning for bungalow 3000-4000 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
    {
      name: "4000-5000 sqft Bungalow Cleaning - Classic",
      reviews: "4.85 (3K reviews)",
      price: 11999,
      details: "Includes full bungalow cleaning for 4000-5000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twenty,
      teamMembers: 3,
    },
    {
      name: "4000-5000 sqft Bungalow Cleaning - Premium",
      reviews: "4.90 (2.5K reviews)",
      price: 12999,
      details: "Includes deep cleaning for bungalow 4000-5000 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "4000-5000 sqft Bungalow Cleaning - Platinum",
      reviews: "4.95 (2K reviews)",
      price: 13999,
      details: "Includes premium deep cleaning for bungalow 4000-5000 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 2,
    },
    {
      name: "5000-6000 sqft Bungalow Cleaning - Classic",
      reviews: "4.86 (2.5K reviews)",
      price: 13999,
      details: "Includes full bungalow cleaning for 5000-6000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentyone,
      teamMembers: 4,
    },
    {
      name: "5000-6000 sqft Bungalow Cleaning - Premium",
      reviews: "4.91 (2K reviews)",
      price: 14999,
      details: "Includes deep cleaning for bungalow 5000-6000 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "5000-6000 sqft Bungalow Cleaning - Platinum",
      reviews: "4.96 (1.5K reviews)",
      price: 15999,
      details: "Includes premium deep cleaning for bungalow 5000-6000 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 3,
    },
    {
      name: "6000-7000 sqft Bungalow Cleaning - Classic",
      reviews: "4.85 (2K reviews)",
      price: 15999,
      details: "Includes full bungalow cleaning for 6000-7000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentytwo,
      teamMembers: 4,
    },
    {
      name: "6000-7000 sqft Bungalow Cleaning - Premium",
      reviews: "4.90 (1.5K reviews)",
      price: 17999,
      details: "Includes deep cleaning for bungalow 6000-7000 sqft",
      extras: "Includes upholstery cleaning, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "6000-7000 sqft Bungalow Cleaning - Platinum",
      reviews: "4.95 (1K reviews)",
      price: 19999,
      details: "Includes premium deep cleaning for bungalow 6000-7000 sqft",
      extras: "Includes upholstery and appliance cleaning",
      teamMembers: 4,
    },
  ],
  "Unfurnished bungalow/duplex": [
    {
      name: "<1200 sqft Bungalow Cleaning - Classic",
      reviews: "4.75 (4K reviews)",
      price: 5499,
      details: "Includes full bungalow cleaning under 1200 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentythree,
      teamMembers: 4,
    },
    {
      name: "<1200 sqft Bungalow Cleaning - Premium",
      reviews: "4.80 (3K reviews)",
      price: 6499,
      details: "Includes deep cleaning for bungalow under 1200 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "1200-2000 sqft Bungalow Cleaning - Classic",
      reviews: "4.77 (3.5K reviews)",
      price: 6499,
      details: "Includes full bungalow cleaning for 1200-2000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentyfour,
      teamMembers: 4,
    },
    {
      name: "1200-2000 sqft Bungalow Cleaning - Premium",
      reviews: "4.82 (3K reviews)",
      price: 7499,
      details: "Includes deep cleaning for bungalow 1200-2000 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "2000-3000 sqft Bungalow Cleaning - Classic",
      reviews: "4.78 (3K reviews)",
      price: 7499,
      details: "Includes full bungalow cleaning for 2000-3000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentyfive,
      teamMembers: 4,
    },
    {
      name: "2000-3000 sqft Bungalow Cleaning - Premium",
      reviews: "4.83 (2.5K reviews)",
      price: 8499,
      details: "Includes deep cleaning for bungalow 2000-3000 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "3000-4000 sqft Bungalow Cleaning - Classic",
      reviews: "4.79 (2.5K reviews)",
      price: 9499,
      details: "Includes full bungalow cleaning for 3000-4000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentysix,
      teamMembers: 4,
    },
    {
      name: "3000-4000 sqft Bungalow Cleaning - Premium",
      reviews: "4.84 (2K reviews)",
      price: 10499,
      details: "Includes deep cleaning for bungalow 3000-4000 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 4,
    },
    {
      name: "4000-5000 sqft Bungalow Cleaning - Classic",
      reviews: "4.80 (2K reviews)",
      price: 11499,
      details: "Includes full bungalow cleaning for 4000-5000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentyseven,
      teamMembers: 4,
    },
    {
      name: "4000-5000 sqft Bungalow Cleaning - Premium",
      reviews: "4.85 (1.5K reviews)",
      price: 12499,
      details: "Includes deep cleaning for bungalow 4000-5000 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "5000-6000 sqft Bungalow Cleaning - Classic",
      reviews: "4.81 (1.5K reviews)",
      price: 13499,
      details: "Includes full bungalow cleaning for 5000-6000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentyeight,
      teamMembers: 3,
    },
    {
      name: "5000-6000 sqft Bungalow Cleaning - Premium",
      reviews: "4.86 (1K reviews)",
      price: 14499,
      details: "Includes deep cleaning for bungalow 5000-6000 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 3,
    },
    {
      name: "6000-7000 sqft Bungalow Cleaning - Classic",
      reviews: "4.80 (1K reviews)",
      price: 14999,
      details: "Includes full bungalow cleaning for 6000-7000 sqft",
      extras: "Basic cleaning, excludes paint marks removal",
      image: twentyeight,
      teamMembers: 4,
    },
    {
      name: "6000-7000 sqft Bungalow Cleaning - Premium",
      reviews: "4.85 (800 reviews)",
      price: 16999,
      details: "Includes deep cleaning for bungalow 6000-7000 sqft",
      extras: "Includes thorough scrubbing, excludes paint marks removal",
      teamMembers: 2,
    },
  ],
  "Mini services": [
    {
      name: "Kitchen Appliances Cleaning - Chimney",
      reviews: "4.70 (6K reviews)",
      price: 799,
      details: "Deep cleaning of kitchen chimney",
      extras: "Excludes external pipe cleaning",
      image: twentynine,
      teamMembers: 1,
    },
    {
      name: "Kitchen Appliances Cleaning - Microwave",
      reviews: "4.65 (5K reviews)",
      price: 499,
      details: "Cleaning of microwave interior and exterior",
      extras: "Includes sanitization",
      teamMembers: 1,
    },
    {
      name: "Kitchen Appliances Cleaning - Stove",
      reviews: "4.70 (4K reviews)",
      price: 599,
      details: "Cleaning of gas stove",
      extras: "Includes burner cleaning",
      teamMembers: 1,
    },
    {
      name: "Kitchen Appliances Cleaning - Single Door Fridge",
      reviews: "4.75 (3K reviews)",
      price: 699,
      details: "Cleaning of single door fridge",
      extras: "Includes interior and exterior cleaning",
      teamMembers: 1,
    },
    {
      name: "Kitchen Appliances Cleaning - Double Door Fridge",
      reviews: "4.80 (2K reviews)",
      price: 999,
      details: "Cleaning of double door fridge",
      extras: "Includes interior and exterior cleaning",
      teamMembers: 1,
    },
    {
      name: "Sofa & Upholstery Wet Shampooing - Sofa (5 seats)",
      reviews: "4.85 (5K reviews)",
      price: 1499,
      details: "Wet shampooing of 5-seat sofa",
      extras: "Includes stain removal",
      image: thirty,
      teamMembers: 1,
    },
    {
      name: "Sofa & Upholstery Wet Shampooing - Carpet (upto 25 sqft)",
      reviews: "4.80 (4K reviews)",
      price: 999,
      details: "Wet shampooing of carpet up to 25 sqft",
      extras: "Includes stain removal",
      teamMembers: 1,
    },
    {
      name: "Sofa & Upholstery Wet Shampooing - Cushion Chair",
      reviews: "4.75 (3K reviews)",
      price: 499,
      details: "Wet shampooing of one cushion chair",
      extras: "Includes stain removal",
      teamMembers: 1,
    },
    {
      name: "Sofa & Upholstery Wet Shampooing - Mattress",
      reviews: "4.80 (4K reviews)",
      price: 1299,
      details: "Wet shampooing of one mattress",
      extras: "Includes stain removal",
      teamMembers: 1,
    },
    {
      name: "Utensil Removal & Placement",
      reviews: "4.60 (2K reviews)",
      price: 399,
      details: "Removal and placement of utensils",
      extras: "Excludes cleaning of utensils",
      image: thirtytwo,
      teamMembers: 1,
    },
    {
      name: "Cabinet Cleaning (Upto 2)",
      reviews: "4.65 (3K reviews)",
      price: 599,
      details: "Cleaning of up to 2 cabinets",
      extras: "Includes interior and exterior cleaning",
      image: thirtythree,
      teamMembers: 1,
    },
    {
      name: "Furniture Wet Wiping",
      reviews: "4.70 (3K reviews)",
      price: 799,
      details: "Wet wiping of furniture surfaces",
      extras: "Excludes upholstery cleaning",
      image: thirtyfour,
      teamMembers: 1,
    },
    {
      name: "Ceiling Dusting & Cobweb Removal",
      reviews: "4.75 (4K reviews)",
      price: 499,
      details: "Dusting and cobweb removal from ceilings",
      extras: "Excludes high ceiling areas above 12 ft",
      image: thirtyfive,
      teamMembers: 1,
    },
  ],
};

const DeepCleaningPackages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [minimumAmount, setMinimumAmount] = useState(0);

  // Predefined slots for demonstration
  const availableSlots = [
    { date: "2025-06-06", time: "10:00 AM - 12:00 PM" },
    { date: "2025-06-06", time: "02:00 PM - 04:00 PM" },
    { date: "2025-06-07", time: "09:00 AM - 11:00 AM" },
  ];

  // Function to handle closing the slot modal
  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
  };
  const { selectedSlot, setSelectedSlot } = useSelectedSlotContext();
  // Function to handle selecting a slot
  const handleSelectSlot = (slot) => {
    // console.log("slot", slot);
    setSelectedSlot(slot);
    sessionStorage.setItem("selectedSlots", JSON.stringify(slot));
    setShowSlotModal(false);
    navigate("/checkout", {
      state: {
        serviceType: "deep-cleaning",
      },
    });
  };

  const { cartItems, updateCartItem, getQuantity } = useContext(CartContext);

  console.log("cartItems checking team members>>>", cartItems);

  const serviceRefs = useRef({});
  const [selectedPackageGroup, setSelectedPackageGroup] = useState(null);

  const getDisplayTitle = (service) => {
    if (service.includes("bungalow")) {
      return service.split(" ")[0] + " Bungalow/Duplex";
    }
    return service;
  };

  // console.log("selectedSlot from context api>>>", selectedSlot);

  const groupPackages = (packages) => {
    const grouped = {};
    packages.forEach((pkg) => {
      const baseName = pkg.name.split(" - ")[0];
      if (!grouped[baseName]) {
        grouped[baseName] = [];
      }
      grouped[baseName].push(pkg);
    });
    return Object.values(grouped);
  };

  const openModal = (pkgGroup, service) => {
    setSelectedPackageGroup(pkgGroup);
    navigate(
      `/deep-cleaning-packages?modal=${service
        .toLowerCase()
        .replace(/ /g, "-")}`
    );
  };

  const closeModal = () => {
    setSelectedPackageGroup(null);
    navigate("/deep-cleaning-packages");
  };

  const scrollToService = (service) => {
    if (serviceRefs.current[service]) {
      serviceRefs.current[service].scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get modal type from query parameter
  const query = new URLSearchParams(location.search);
  const modalType = query.get("modal");
  const ModalComponent = modalType
    ? modalComponents[
    Object.keys(modalComponents).find(
      (key) => key.toLowerCase().replace(/ /g, "-") === modalType
    )
    ]
    : null;

  // Set selected package group based on modal type
  useEffect(() => {
    if (modalType) {
      const service = Object.keys(modalComponents).find(
        (key) => key.toLowerCase().replace(/ /g, "-") === modalType
      );
      if (service && !selectedPackageGroup) {
        const firstPkgGroup = groupPackages(cleaningServices[service])[0];
        setSelectedPackageGroup(firstPkgGroup);
      }
    }
  }, [modalType]);

  const TotalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // console.log("TotalPrice", TotalPrice);

  // const advancedAmount = 10000;

  const fetchMinimumAmount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_MINIMUM_ORDERS_VALUE}`);
      const json = await res.json();
      if (!json.success)
        throw new Error(json.message || "Failed to fetch Minimum Amount");
      setMinimumAmount(json.data.amount || 0)
    } catch (err) {
      console.error("GET Minimum Amount:", err.message);
    }
  };
  useEffect(() => {
    fetchMinimumAmount();
  }, []);

  const balanceamount = minimumAmount - TotalPrice;

  // console.log("minimumAmount", minimumAmount);

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
        marginTop: "4%",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Sidebar - Service Selection */}
      <div
        style={{
          width: "450px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxHeight: "350px",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <h2
          style={{ fontSize: "14px", fontWeight: "700", marginBottom: "20px" }}
        >
          Select a service
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {Object.keys(cleaningServices).map((service, index) => (
            <div
              key={index}
              onClick={() => scrollToService(service)}
              style={{
                width: "calc(33.33% - 6.66px)",
                textAlign: "center",
                cursor: "pointer",
                padding: "5px",
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
            >
              <img
                src={serviceImages[service]}
                alt={service}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              />
              <p
                style={{
                  fontSize: "10px",
                  color: "#333",
                  textTransform: "capitalize",
                }}
              >
                {service}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section - Service Details */}
      <div
        style={{
          flex: 1,
          maxWidth: "900px",
          // padding: "20px",
        }}
      >
        <div
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            width: "500px",
            paddingRight: "10px",
            marginBottom: "30px",
            position: "relative", // Ensure the container is positioned for sticky child
          }}
          className="scroll-section"
        >
          {Object.keys(cleaningServices).map((service, serviceIndex) => (
            <div
              key={serviceIndex}
              ref={(el) => (serviceRefs.current[service] = el)}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  // marginBottom: "20px",
                  position: "sticky",
                  top: "0",
                  backgroundColor: "#fff",
                  zIndex: 1,
                  paddingBottom: "10px",
                }}
              >
                {getDisplayTitle(service)}
              </h2>
              {groupPackages(cleaningServices[service]).map(
                (pkgGroup, index) => {
                  const currentPkg =
                    pkgGroup.find((pkg) => pkg.teamMembers !== undefined) ||
                    pkgGroup[0];
                  // console.log("currentPkg", currentPkg);
                  return (
                    <div
                      key={`${serviceIndex}-${index}`}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            marginBottom: "8px",
                          }}
                        >
                          {currentPkg.name.split(" - ")[0]}
                          {/* {pkgGroup[0].name.split(" - ")[0]} */}
                          {/* cleaning */}
                        </h3>
                        <p style={{ margin: "0", color: "#333" }}>
                          {/* Starts at ₹{pkgGroup[0].price} */}
                          Starts at ₹{currentPkg.price}
                        </p>
                        <ul
                          style={{
                            paddingLeft: "20px",
                            fontSize: "13px",
                            margin: "10px 0",
                          }}
                        >
                          <li>{currentPkg.details}</li>
                          <li>{currentPkg.extras}</li>
                          {/* <li>{pkgGroup[0].details}</li>
                          <li>{pkgGroup[0].extras}</li> */}
                        </ul>
                        <p
                          style={{
                            color: "red",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                          onClick={() => openModal(pkgGroup, service)}
                        >
                          View details
                        </p>
                      </div>
                      <div style={{ width: "150px", textAlign: "center" }}>
                        <img
                          // src={pkgGroup[0].image}
                          // alt={pkgGroup[0].name}
                          src={currentPkg.image}
                          alt={currentPkg.name}
                          style={{
                            width: "80%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "-15px",
                          }}
                        />
                        {/* {getQuantity(pkgGroup[0].name, service) > 0 ? ( */}
                        {getQuantity(currentPkg.name, service) > 0 ? (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              border: "1px solid red",
                              borderRadius: "20px",
                              overflow: "hidden",
                              backgroundColor: "white",
                            }}
                          >
                            <button
                              onClick={() =>
                                updateCartItem(
                                  currentPkg.name,
                                  currentPkg.price,
                                  -1,
                                  service,
                                  currentPkg.teamMembers
                                )
                              }
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "#fff",
                                border: "none",
                                fontSize: "16px",
                                color: "red",
                                cursor: "pointer",
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{ padding: "5px 15px", fontSize: "14px" }}
                            >
                              {getQuantity(pkgGroup[0].name, service)}{" "}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItem(
                                  currentPkg.name,
                                  currentPkg.price,
                                  1,
                                  service,
                                  currentPkg.teamMembers
                                )
                              }
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "red",
                                color: "#fff",
                                border: "none",
                                fontSize: "16px",
                                cursor: "pointer",
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          (() => {
                            const isAnyInCart = pkgGroup.some((pkg) =>
                              cartItems.some(
                                (item) =>
                                  item.name === pkg.name &&
                                  item.service.toLowerCase() ===
                                  service.toLowerCase()
                              )
                            );

                            if (isAnyInCart) {
                              const specificCartItem = cartItems.find(
                                (cartItem) =>
                                  pkgGroup.some(
                                    (pkg) =>
                                      pkg.name === cartItem.name &&
                                      cartItem.service.toLowerCase() ===
                                      service.toLowerCase()
                                  )
                              );

                              if (specificCartItem) {
                                return (
                                  <div
                                    onClick={() => {
                                      if (service === "Mini services") {
                                        updateCartItem(
                                          // pkgGroup[0].name,
                                          // pkgGroup[0].price,
                                          // 1,
                                          // service,
                                          // pkgGroup[0].teamMembers
                                          currentPkg.name,
                                          currentPkg.price,
                                          1,
                                          service,
                                          currentPkg.teamMembers
                                        );
                                      } else {
                                        openModal(pkgGroup, service);
                                      }
                                    }}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      border: "1px solid red",
                                      borderRadius: "20px",
                                      overflow: "hidden",
                                      backgroundColor: "white",
                                    }}
                                  >
                                    <button
                                      style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#fff",
                                        border: "none",
                                        fontSize: "16px",
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                    >
                                      −
                                    </button>
                                    <span
                                      style={{
                                        padding: "5px 15px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {specificCartItem.quantity}
                                    </span>
                                    <button
                                      style={{
                                        padding: "5px 10px",
                                        backgroundColor: "red",
                                        color: "#fff",
                                        border: "none",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                );
                              }
                              return (
                                <button
                                  disabled
                                  style={{
                                    backgroundColor: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "15px",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    cursor: "not-allowed",
                                  }}
                                >
                                  Error
                                </button>
                              );
                            } else {
                              // If no variant from this group is in the cart, show the "Add" button
                              return (
                                <button
                                  onClick={() => {
                                    if (service === "Mini services") {
                                      updateCartItem(
                                        pkgGroup[0].name,
                                        pkgGroup[0].price,
                                        1,
                                        service,
                                        pkgGroup[0].teamMembers
                                      );
                                    } else {
                                      openModal(pkgGroup, service);
                                    }
                                  }}
                                  style={{
                                    backgroundColor: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "15px",
                                    padding: "8px 15px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Add
                                </button>
                              );
                            }
                          })()
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ))}
          <style>
            {`
              .scroll-section::-webkit-scrollbar {
                display: none;
              }
              .scroll-section {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>
        </div>
      </div>
      <div
        style={{
          width: "450px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxHeight: "600px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          Cart
        </h2>
        {cartItems.length > 0 ? (
          <div
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              flex: 1,
              marginBottom: "10px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="hide-scroll"
          >
            {cartItems.map((item, index) => (
              <div
                className="row"
                key={index}
                style={{ marginBottom: "15px", alignItems: "center" }}
              >
                <p
                  className="col-md-5"
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "5px",
                  }}
                >
                  {item.service} - {item.name}
                </p>
                <p
                  className="col-md-5"
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "5px",
                  }}
                >
                  TEAM MEMEBRS {item.teamMembers}
                </p>
                <div
                  className="col-md-4"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "5px",
                  }}
                >
                  <button
                    onClick={() =>
                      updateCartItem(
                        item.name,
                        item.price,
                        -1,
                        item.service,
                        item.teamMembers
                      )
                    }
                    style={{
                      backgroundColor: "#f0f0f0",
                      border: "none",
                      color: "red",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartItem(
                        item.name,
                        item.price,
                        1,
                        item.service,
                        item.teamMembers
                      )
                    }
                    style={{
                      backgroundColor: "#f0f0f0",
                      border: "none",
                      color: "red",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
                <p
                  className="col-md-3"
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "600",
                  }}
                >
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            {minimumAmount > TotalPrice ? (
              <div
                className="row"
                style={{
                  backgroundColor: "lightgrey",
                  padding: "6px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                <div className="text-center" style={{ fontSize: "12px" }}>
                  Shop for ₹{balanceamount} more to checkout
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <div className="" style={{ fontSize: "13px" }}>
                ₹{TotalPrice}
              </div>
              <div className="" style={{ fontSize: "13px" }}>
                Total Price
              </div>
            </div>

            <button
              onClick={() => {
                minimumAmount > TotalPrice ? null : setShowSlotModal(true);
              }}
              style={{
                width: "100%",
                backgroundColor:
                  minimumAmount > TotalPrice ? "rgb(0 0 0 / 9%)" : "#fff",
                color:
                  minimumAmount > TotalPrice ? "rgba(0, 0, 0, 0.125)" : "red",
                border: minimumAmount > TotalPrice ? 0 : "1px solid red",
                padding: "10px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                // cursor: "pointer",
                marginBottom: "10px",
                cursor: minimumAmount > TotalPrice ? "not-allowed" : "pointer",
                marginTop: "10px",
              }}
            >
              {/* ₹{totalPrice}  */}
              Proceed for Slot Selection
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src="https://img.icons8.com/ios/50/000000/shopping-cart.png"
                alt="Empty Cart"
                style={{
                  width: "50px",
                  height: "50px",
                  marginBottom: "10px",
                }}
              />
              <p style={{ fontSize: "14px", color: "#666" }}>
                No items in your cart
              </p>
            </div>
          </>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              Homjee Promise
            </h3>
            <ul
              style={{
                padding: 0,
                listStyle: "none",
                fontSize: "14px",
                color: "#333",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <span style={{ marginRight: "5px" }}>✔</span> Verified
                Professionals
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <span style={{ marginRight: "5px" }}>✔</span> Safe Chemicals
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "5px" }}>✔</span> Superior Stain
                Removal
              </li>
            </ul>
          </div>
          <img
            src={sparkling}
            alt="Sparkling Clean Hygienic"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
        </div>
      </div>
      <SlotSelectionModal
        show={showSlotModal}
        onClose={handleCloseSlotModal}
        // availableSlots={availableSlots}
        handleSelectSlot={handleSelectSlot}
      />

      {/* Modal */}
      {ModalComponent && selectedPackageGroup && (
        <ModalComponent
          pkgGroup={selectedPackageGroup}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default DeepCleaningPackages;
