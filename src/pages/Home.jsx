import React from 'react';
import { useState  } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import vediopainting from '../assets/vediopainting.mp4'; 
import arrow from '../assets/arrow.png';
import brush from '../assets/brush.svg';
import cleaning from '../assets/cleaning.svg';
import tool from '../assets/tool.svg';
import home from '../assets/home.svg';
import setting from '../assets/setting.svg';
import bannerhome from '../assets/banner-home.png'; 
import verified from '../assets/verified.svg';
import iconQuality from '../assets/iconQuality.png';
import iconWarranty from '../assets/iconWarranty.png';
import iconDelivery from '../assets/iconDelivery.png';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import interior from '../assets/interior.png';
import falseceiling from '../assets/false-ceiling.png';
import stencil from '../assets/stencil.png'; 
import fullhome from '../assets/full-home.png';
import kitchen from '../assets/kitchen.png';
import bathroom from '../assets/bathroom.png'; 
import fullinterior from '../assets/full-interior.png';
import modularkitchen from '../assets/modular-kitchen.png';
import makeover from '../assets/makeover.png'; 
import step1 from '../assets/step1.png';
import step2 from '../assets/step2.png';
import step3 from '../assets/step3.png';
import arrowicon from '../assets/arrowicon.png';
import icon1 from '../assets/ontime.png';
import icon2 from '../assets/warranty-icon.png';
import icon3 from '../assets/verified-icon.png';
import icon4 from '../assets/quote-icon.png';
import lookingImage from '../assets/looking-for.png'; 
import testimonialVideo from '../assets/testimonial.mp4';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import gallery1 from '../assets/gallery1.png';
import gallery2 from '../assets/gallery2.png';
import gallery3 from '../assets/gallery3.png';
import gallery4 from '../assets/gallery4.png';
import gallery5 from '../assets/gallery5.png';
import backgroundImage from '../assets/banner-bg.png'; 
import vectoricon from '../assets/vectoricon.png'
import bannerhomemobile from '../assets/bannerhomemobile.png'
import circleicon from '../assets/circleicon.png'
import lineicon from '../assets/lineicon.png';
import backgroundhome from '../assets/backgroundhome.png';
import lineiconimage from '../assets/lineiconimage.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Home = ({ handleShow }) => {
  const [activeCategory, setActiveCategory] = useState('Painting');

  const [activeIndex, setActiveIndex] = useState(0);
  const videos = [testimonialVideo, testimonialVideo, testimonialVideo];
  const icons = [
    { src: brush, style: { top: '5%', left: '35%' } },
    { src: cleaning, style: { top: '30%', left: '42%' } },
    { src: tool, style: { top: '56%', left: '43%' } },
    { src: home, style: { top: '18px', right: '22%' } },
    { src: setting, style: { top: '65%', left: '66%' } },
    { src: verified, style: { top: '58%', right: '9%' } },
  ];

  const serviceSteps = {
  Painting: [
    'At Home Consult',
    'Measurements & Quotes',
    'Booking Confirmation',
    'Paint Begins With Packing & Masking',
    'Quality Work With Genuine Products',
    'Final Check And Handoff',
  ],
  Cleaning: [
    'Select The Right Package',
    'Schedule As Per Your Convenience',
    'Book The Service',
    'Right Tools & Safe Chemicals',
    'Superior Stain Removal',
    'Final Check And Handoff',
  ],
  Shifting: [
    'Pre-Move Survey',
    'Quotation & Service Confirmation',
    'Experts Packing & Loading',
    'Safe Transit & Unloading',
    'Shifting',
    'Final Check & Handoff',
  ],
  Interiors: [
    'At Home Consult',
    'Idea, Design & Drawing',
    'Specs & Materials Finalization',
    'Execution',
    'Final Check & Handoff',
    'Cleaning',
  ],
};
const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};


  const promises = [
    {
      icon: icon1,
      title: 'On-time\nCompletion Guarantee',
      bg: '#f2e8fd'
    },
    {
      icon: icon2,
      title: '1-Year\nWarranty',
      bg: '#dff0ff'
    },
    {
      icon: icon3,
      title: 'Verified\nProfessionals',
      bg: '#d5f7f8'
    },
    {
      icon: icon4,
      title: 'Accurate Quotations, No\nHidden Charges',
      bg: '#f2e8fd'
    }
  ];



const testimonials = [
    {
      name: 'Aroon Zhang',
      role: 'PageMaker',
      image: avatar1,
      text: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been.',
      rating: 5
    },
    {
      name: 'Malakai Liu',
      role: 'PageMaker',
      image: avatar2,
      text: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been.',
      rating: 5
    },
    {
      name: 'Chan Ming',
      role: 'PageMaker',
      image: avatar3,
      text: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been.',
      rating: 5
    }
  ];
  

  return (
    <div style={{ overflow:'hidden',}}>

<div className='d-none d-lg-block' >
    <div 
    style={{
      display: 'flex',
      alignItems: 'center',
     overflow: 'hidden',
      justifyContent: 'space-between',
      padding: '60px 40px',
      background: '#fff',
      flexWrap: 'wrap',
      position: 'relative',
      
    }}>
      {/* LEFT SIDE */}
      <div style={{ maxWidth: '560px', zIndex: 2, marginTop:'-15%' }}>
        <div style={{
          backgroundColor: '#ffecec',
          display: 'inline-block',
          padding: '6px 12px',
          borderRadius: '30px',
          fontSize: '10px',
          fontWeight: 500,
          color: '#ff0000',
          marginBottom: '20px'
        }}>
          One Stop Solution For
        </div>

        <h1 style={{
  fontSize: '48px',
  lineHeight: '1.3',
  fontWeight: 700,
  fontFamily: 'Gotham Rounded, sans-serif',
  color: '#111',
  marginBottom: '20px'
}}>
  House <span style={{
    display: 'inline-block',
    position: 'relative',
    fontWeight:'600'
  }}>
    Painting
    <img
      src={vectoricon}
      alt=""
      style={{
        position: 'absolute',
        bottom: '-14px', // adjust based on image
        left: 0,
        width: '100%',
        height: 'auto',
        pointerEvents: 'none'
      }}
    />
  </span>,<br />
  Cleaning, Shifting<br />
  & Interior Services
</h1>

        <p style={{
          fontFamily: 'Fasthand',
          fontSize: '30px',
          marginBottom: '30px',
          color: '#222'
        }}>
          Happy Home, Happy Family
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="" size="lg" style={{
            padding: '12px 30px',
            borderRadius: '30px',
            fontWeight: 600,
            backgroundColor:'red',
            color:'white',
            fontSize: '16px',
            boxShadow: '0 6px 20px rgba(255,0,0,0.3)'
          }}
          onClick={handleShow}>
            BOOK NOW
          </Button>
          <img src={arrow} alt="Arrow" style={{ height: '83px',width:'75px' }} />
        </div>
      </div>

      {/* RIGHT SIDE: VIDEO USING <video> TAG */}
      {/* <div
  style={{
    maxWidth: '620px',
    height: '882px', // ✅ Added height
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    marginTop: '-17%',
    zIndex: 1,
    backgroundImage: `url(${lineicon})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <video
    src={vediopainting}
    width="100%"
    height="360"

    autoPlay
    muted
    loop
    playsInline
    style={{
      borderRadius: '20px',
      width: '100%',
      objectFit: 'cover',
      marginTop:'38%'
    }}
  />
</div> */}

<div
  style={{
    maxWidth: '620px',
    height: '882px',
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    marginTop: '-17%',
    zIndex: 1,
  }}
>
  {/* Background image below video */}
  <img
    src={lineicon}
    alt="decorative lines"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '87%',
      objectFit: 'cover',
      zIndex: 0,
    }}
  />

  {/* Video on top */}
  <video
    src={vediopainting}
    width="100%"
    height="360"
    autoPlay
    muted
    loop
    playsInline
    style={{
      borderRadius: '20px',
      width: '100%',
      objectFit: 'cover',
      marginTop: '38%',
      zIndex: 1,
      position: 'relative',
    }}
  />
</div>




      {/* FLOATING ICONS */}
      {icons.map((icon, idx) => (
        <div key={idx} style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(255,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...icon.style,
          zIndex: 0
        }}>
          <img src={icon.src} alt={`Icon ${idx}`} style={{ width: '28px', height: '28px' }} />
        </div>
      ))}

    </div>
    </div>
    {/* Mobile View */}
<div className="d-block d-lg-none" style={{ padding: '20px', backgroundColor: '#fff', position: 'relative' }}>
    {/* Background Line Icon Image */}
    <img 
    src={lineicon} 
    alt="Background Line Icon" 
    style={{
      position: 'absolute',
      top: '183px',
      left: '70px',
      width: '442px',
      height: '361px',
      objectFit: 'cover',
      // opacity: 0.08,
      zIndex: 0,
      pointerEvents: 'none'
    }} 
  />
  {/* Top Label */}
  <div style={{
    backgroundColor: '#ffecec',
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '30px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#ff0000',
    marginBottom: '15px'
  }}>
    One Stop Solution For
  </div>

  {/* Heading */}
  <h1 style={{
    fontSize: '32px',
    lineHeight: '1.4',
    fontWeight: 700,
    fontFamily: 'Gotham Rounded, sans-serif',
    color: '#111',
    marginBottom: '20px'
  }}>
    House <span style={{ position: 'relative', display: 'inline-block', fontWeight:'600' }}>
      Painting
      <img 
        src={vectoricon} 
        alt="underline" 
        style={{
          position: 'absolute',
          bottom: '-7px',
          left: '0',
          width: '100%',
          height: 'auto',
          pointerEvents: 'none'
        }}
      />
    </span>,<br/>
    Cleaning, Shifting<br/>
    & Interior Services
  </h1>

  {/* Tagline */}
  <p style={{
    fontFamily: 'Fasthand',
    fontSize: '24px',
    marginBottom: '25px',
    color: '#222'
  }}>
    Happy Home, Happy Family
  </p>

  {/* Book Now Button */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
    <Button variant="danger" size="md" style={{
      padding: '10px 24px',
      borderRadius: '30px',
      fontWeight: 600,
      backgroundColor:'red',
      fontSize: '14px',
      boxShadow: '0 6px 20px rgba(255,0,0,0.3)'
    }}>
      BOOK NOW
    </Button>
    <img src={arrow} alt="Arrow" style={{ height: '60px', width: '55px', marginTop:'-8%' }} />
  </div>
 

  {/* Video Section */}
{/* Video Section with Background Image */}
<div style={{
  position: 'relative',
  borderRadius: '15px',
  overflow: 'hidden',
  marginBottom: '20px',
  marginTop:"-4%"
}}>


  {/* Video Overlay */}
  <video
    src={vediopainting}
    width="100%"
    height="240"
    autoPlay
    muted
    loop
    playsInline
    style={{ 
      borderRadius: '15px', 
      width: '100%', 
      objectFit: 'cover', 
      position: 'relative', 
      zIndex: 1 
    }}
  />
</div>


 {/* Mobile View Icons */}
{[
  { src: home, style: { top: '41%', right: '10%' } },
  { src: cleaning, style: { top: '0%', left: '57%' } },
  { src: setting, style: { top: '5%', left: '84%' } }
].map((icon, idx) => (
  <div key={idx} style={{
    position: 'absolute',
    width: '35px',
    height: '35px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 4px 10px rgba(255,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...icon.style,
    zIndex: 1
  }}>
    <img src={icon.src} alt={`Icon ${idx}`} style={{ width: '18px', height: '18px' }} />
  </div>
))}



</div>

{/* lets create */}
<div className='d-none d-lg-block'  >
  
<div
  style={{
    backgroundImage: `url(${bannerhome})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '30px',
    padding: '60px 90px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    position: 'relative',
    maxWidth: '1450px',
    margin: 'auto',
    marginTop:'-14%',
    boxSizing: 'border-box',
  }}
>
  {/* LEFT SIDE CONTENT */}
  <div style={{ maxWidth: '500px', color: '#fff', position: 'relative' }}>
    <p
      style={{
        fontFamily: 'Fasthand',
        fontSize: '50px',
        color: '#000',
        marginBottom: '0',
      }}
    >
      Let’s Create Beauty
    </p>
    <h2
      style={{
        fontSize: '70px',
        fontWeight: 'bold',
        margin: '10px 0',
        color: '#fff',
      }}
    >
      Your Home,<br /> Our Canvas
    </h2>
  </div>

  {/* RIGHT SIDE FORM */}
  <div
    style={{
      backgroundColor: '#fff',
      borderRadius: '25px',
      padding: '30px',
      boxShadow: '0 6px 30px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      width: '100%',
      zIndex: 2,
      marginTop: '20px',
    }}
  >
    <h3 style={{ marginBottom: '20px', fontSize: '22px', color: '#000' }}>
      Get a call back
    </h3>
    <input
      type="text"
      placeholder="Enter Name"
      style={{
        width: '100%',
        padding: '12px 15px',
        backgroundColor:'white',
        marginBottom: '15px',
        borderRadius: '12px',
        border: '1px solid #ccc',
        outline: 'none',
      }}
    />
    <input
      type="text"
      placeholder="Enter WhatsApp Phone Number"
      style={{
        width: '100%',
        backgroundColor:'white',
        padding: '12px 15px',
        marginBottom: '20px',
        borderRadius: '12px',
        border: '1px solid #ccc',
        outline: 'none',
      }}
    />
    <button
      style={{
        width: '100%',
        padding: '12px',
        background: '#fff',
        color: 'red',
        fontWeight: 'bold',
        border: '1px solid red',
        borderRadius: '30px',
        cursor: 'pointer',
      }}
    >
      SUBMIT
    </button>
  </div>

  {/* BOTTOM ICONS */}
  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '40px',
      gap: '50px',
      marginLeft:'54%',
      flexWrap: 'wrap',
    }}
  >
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <img src={iconQuality} alt="Best Quality" style={{ width: '60px' }} />
      <p style={{ marginTop: '10px', }}>Best Quality</p>
    </div>
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <img src={iconWarranty} alt="Warranty" style={{ width: '60px' }} />
      <p style={{ marginTop: '10px' }}>1 Year Warranty</p>
    </div>
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <img src={iconDelivery} alt="Delivery" style={{ width: '60px' }} />
      <p style={{ marginTop: '10px' }}>On Time Delivery</p>
    </div>
  </div>
</div>

    </div>
    {/* Mobile View */}
<div className="d-block d-lg-none" style={{ padding: '20px', position: 'relative', borderRadius: '30px', marginTop:'-12%' }}>
  
  {/* Top Section - Background Image and Text */}
  <div style={{
    backgroundImage: `url(${bannerhomemobile})`,
    width: '100%',
    height: '250px',
    borderRadius: '30px 30px 0 0',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px'
  }}>
    <p style={{
      fontFamily: 'Fasthand',
      fontSize: '20px',
      color: '#000',
      marginBottom: '5px',
    }}>
      Let's Create Beauty
    </p>
    <h2 style={{
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '10px',
      lineHeight: '1.2',
    }}>
      Your Home, Our Canvas
    </h2>

    {/* Circle Icon in Middle */}
    <img 
      src={circleicon} 
      alt="circle icon" 
      style={{
        width: '103px',
        height: '103px',
        borderRadius: '50%',
        marginTop: '0px',

      }} 
    />
  </div>

  {/* White Floating Card with 3 Icons */}
  <div style={{
    width: '80%',
    padding: '20px 10px',
    borderRadius: '20px',
    position: 'absolute',
    top: '210px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:'12px',
      whiteSpace:'nowrap',
      marginTop: '5%'
    }}>
      <div style={{ textAlign: 'center' }}>
        <img src={iconQuality} alt="Best Quality" style={{ width: '40px', marginBottom: '5px' }} />
        <p style={{ fontSize: '10px', margin: '0', fontWeight: '600' }}>Best Quality</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <img src={iconWarranty} alt="Warranty" style={{ width: '40px', marginBottom: '5px' }} />
        <p style={{ fontSize: '10px', margin: '0', fontWeight: '600' }}>1 Year Warranty</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <img src={iconDelivery} alt="Delivery" style={{ width: '40px', marginBottom: '5px' }} />
        <p style={{ fontSize: '10px', margin: '0', fontWeight: '600' }}>On Time Delivery</p>
      </div>
    </div>
  </div>

  {/* Gray Background Section */}
  <div style={{
    backgroundColor: '#D8D8D8',
    paddingTop: '120px',
    paddingBottom: '30px',
    borderRadius: '0 0 30px 30px'
  }}>
    {/* Form Section */}
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '25px 20px',
      width: '90%',  
      margin: 'auto',
      marginTop: '-70px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    }}>
      <h3 style={{
        fontSize: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '600',
        color: '#000'
      }}>
        Get a call back
      </h3>

      <input
        type="text"
        placeholder="Enter Name"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          backgroundColor:'white',
          borderRadius: '12px',
          border: '1px solid #ccc',
          outline: 'none',
          fontSize: '12px'
        }}
      />
      <input
        type="text"
        placeholder="Enter WhatsApp Phone Number"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '12px',
          backgroundColor:'white',
          border: '1px solid #ccc',
          outline: 'none',
          fontSize: '12px'
        }}
      />
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#fff',
        border: '1px solid red',
        color: 'red',
        // fontWeight: 'bold',
        borderRadius: '30px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>
        SUBMIT
      </button>
    </div>
  </div>

</div>
    <br />
{/* recent project */}
    <div className='d-none d-lg-block'>
    <div style={{ background: '#fff', padding: '60px 40px', textAlign: 'center', maxWidth:'1450px', margin:'auto' }}>
      {/* Heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' , maxWidth: '1350px',}}>
      <h2 style={{
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#111',
  position: 'relative',
  fontFamily: 'Poppins, sans-serif',
  display: 'inline-block'
}}>
  Our Recent Projects
  <img 
    src={vectoricon}
    alt=""
    style={{
      position: 'absolute',
      bottom: '-14px',
      left: '230px',
      width: '130px', 
      height: 'auto',
      borderRadius: '10px',
      pointerEvents: 'none'
    }}
  />
</h2>

        <Button
          variant="outline-danger"
          style={{
            fontWeight: 600,
            borderRadius: '30px',
            padding: '8px 24px',
            fontSize: '14px'
          }}
        >
          EXPLORE ALL
        </Button>
      </div>

      {/* Carousel */}
      <Carousel
        indicators={true}
        controls={true}
        interval={3000}
        className="recent-carousel"
        nextIcon={<span className="carousel-control-next-icon custom-icon" />}
        prevIcon={<span className="carousel-control-prev-icon custom-icon" />}
      >
        <Carousel.Item>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <img src={img1} alt="Project 1" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            <img src={img2} alt="Project 2" className="rounded" style={{ width: '350px', height: '504px', objectFit: 'cover' }} />
            <img src={img3} alt="Project 3" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <img src={img2} alt="Project 2" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            <img src={img3} alt="Project 3" className="rounded" style={{width: '350px', height: '504px', objectFit: 'cover' }} />
            <img src={img1} alt="Project 1" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <img src={img2} alt="Project 2" className="rounded" style={{width: '380px', height: '504px', objectFit: 'cover' }} />
            <img src={img3} alt="Project 3" className="rounded" style={{ width: '350px', height: '504px', objectFit: 'cover' }} />
            <img src={img1} alt="Project 1" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <img src={img1} alt="Project 1" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            <img src={img2} alt="Project 2" className="rounded" style={{ width: '350px', height: '504px', objectFit: 'cover' }} />
            <img src={img3} alt="Project 3" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <img src={img1} alt="Project 1" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            <img src={img2} alt="Project 2" className="rounded" style={{ width: '350px', height: '504px', objectFit: 'cover' }} />
            <img src={img3} alt="Project 3" className="rounded" style={{ width: '380px', height: '504px', objectFit: 'cover' }} />
            
          </div>
        </Carousel.Item>
      </Carousel>
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

    <div className="d-block d-lg-none" style={{ background: '#fff', padding: '30px 15px' }}>
  {/* Heading */}
  <div style={{ marginBottom: '30px', position: 'relative' }}>
    <h2 style={{
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111',
      fontFamily: 'Poppins, sans-serif',
      marginBottom: '25px',
      textAlign: 'left'
    }}>
      Our Recent Projects
    </h2>
    <img 
      src={vectoricon} 
      alt="underline"
      style={{
        position: 'absolute',
        bottom: '-11px',
        left: '140px',
        width: '100px',
        height: 'auto',
        pointerEvents: 'none'
      }}
    />
  </div>

  {/* Custom Scrollable Carousel */}
  <div className="custom-scroll-carousel"
  style={{
    overflowX: 'auto',
    display: 'flex',
    gap: '16px',
    paddingBottom: '8px',
    scrollSnapType: 'x mandatory',
    paddingLeft: '15px',
  }}
>
  {[img2, img2, img3].map((img, index) => (
    <div
      key={index}
      style={{
        minWidth: '80%',
        flexShrink: 0,
        scrollSnapAlign: 'start',
      }}
    >
      <img
        src={img}
        alt={`Project ${index + 1}`}
        style={{
          width: '100%',
          height: '300px', // Reduced height
          borderRadius: '20px',
          objectFit: 'cover',
        }}
      />
    </div>
  ))}
</div>




  {/* Indicators + Button Row */}
  <div className="d-flex justify-content-between align-items-center mt-3">
    <div className="d-flex gap-2" style={{marginLeft:'8%'}}>
      <div style={{ width: '14px', height: '4px', backgroundColor: '#ff0000', borderRadius: '4px' }}></div>
      <div style={{ width: '14px', height: '4px', backgroundColor: '#ccc', borderRadius: '4px' }}></div>
      <div style={{ width: '14px', height: '4px', backgroundColor: '#ccc', borderRadius: '4px' }}></div>
    </div>
    <Button
      variant="outline-danger"
      style={{
        fontWeight: 600,
        borderRadius: '30px',
        padding: '6px 16px',
        fontSize: '12px'
      }}
    >
      EXPLORE ALL
    </Button>
  </div>
</div>




{/* house painters */}
<div className='d-none d-lg-block'>
    <div style={{ background: '#fff', padding: '60px 40px' }}>
      {/* Section Heading */}
      <h2 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
        color: '#111',
        marginBottom: '20px',
        position: 'relative',
        display: 'inline-block'
      }}>
        Product <span style={{ color: '#000' }}>&</span> <span style={{ color: '#111' }}>Services</span>
        <img 
    src={vectoricon}
    alt=""
    style={{
      position: 'absolute',
      bottom: '-14px',
      left: '200px',
      width: '150px', 
      height: 'auto',
      borderRadius: '10px',
      pointerEvents: 'none'
    }}
  />
      </h2>

      {/* Services Card Section */}
      <div style={{
        background: '#fff5f1',
        padding: '40px',
        borderRadius: '30px',
        marginTop: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '0'
          }}>
            House Painters & Waterproofing
          </h3>
          <a href="/services" style={{
            fontWeight: 'bold',
            textDecoration: '',
            color: '#963600',
            fontSize: '16px'
          }}>
            See All
          </a>
        </div>

        {/* Carousel */}
        <Carousel
          indicators={false}
          controls={true}
          interval={3000}
          className="product-carousel"
          nextIcon={<span className="carousel-control-next-icon custom-icon-painters" />}
          prevIcon={<span className="carousel-control-prev-icon custom-icon-painters" />}
        >
          <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={interior} alt="Interior" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Interiors & exteriors</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Color Your Home Inside Out</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={falseceiling} alt="False Ceiling" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Pop false ceiling</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Elevate Your Style, Beyond The Ceiling, Beyond Expectations</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={stencil} alt="Stencil" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Texture and Stencils</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Elevate Your Space With Wall Beautification</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={interior} alt="Interior" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Waterproofing</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Seal, Shield, & Sustain Your Home</p>
              </div>
                <div style={{ width: '32%', padding: '10px' }}>
                <img src={falseceiling} alt="False Ceiling" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Pop false ceiling</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Elevate Your Style, Beyond The Ceiling, Beyond Expectations</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={stencil} alt="Stencil" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Texture and Stencils</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Elevate Your Space With Wall Beautification</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Carousel Styles */}
      <style>{`
        .product-carousel .carousel-control-prev,
        .product-carousel .carousel-control-next {
          width: 40px;
          height: 40px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          opacity: 1;
        }
        .product-carousel .carousel-control-prev {
          left: -20px;
          margin-top: -5%;
        }
        .product-carousel .carousel-control-next {
          right: -20px;
             margin-top: -5%;
        }
     /* Icon customization */
.custom-icon {
  background-color: #e60000; /* This defines the arrow color */
  width: 20px;
  height: 20px;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.carousel-control-prev-icon.custom-icon-painters {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
  width: 20px; 
    height: 20px;
}

.carousel-control-next-icon.custom-icon-painters {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
    height: 20px;
      width: 20px; 
}

.carousel-control-prev-icon.custom-icon-painters, 
.carousel-control-next-icon.custom-icon-painters {
  background-color: #B45835;
}

      `}</style>
    </div>
    </div>
    <div className="d-block d-lg-none" style={{ background: '#fff', padding: '30px 15px' }}>
  
  {/* Section Heading */}
  <div style={{ marginBottom: '20px', textAlign: '', position: 'relative' }}>
    <h2 style={{
      fontSize: '28px',
      fontWeight: 'bold',
      fontFamily: 'Poppins, sans-serif',
      color: '#111',
      marginBottom: '10px',
      display: 'inline-block',
      position: 'relative'
    }}>
      Product <span style={{ color: '#000' }}>&</span> Services
    </h2>
    <img 
      src={vectoricon} 
      alt="underline"
      style={{
        position: 'absolute',
        bottom: '1px',
        left: '60%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: 'auto',
        pointerEvents: 'none'
      }}
    />
  </div>

  {/* Services Card */}
  <div style={{
    background: '#fff5f1',
    padding: '20px',
    borderRadius: '20px',
    marginTop: '20px'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: 0,
        textAlign: 'left'

      }}>
        House Painters & Waterproofing
      </h3>
      <a href="services" style={{
        fontWeight: '',
        whiteSpace:'nowrap',
        textDecoration: '',
        color: '#B45835',
        fontSize: '14px'
      }}>
        See All
      </a>
    </div>

    {/* Services Cards - 2 Images */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      flexWrap: 'wrap'
    }}>
      <div style={{ width: '48%', textAlign: 'center' }}>
        <img 
          src={interior} 
          alt="Interiors & Exteriors" 
          style={{ width: '157px', height: '118px', borderRadius: '15px', objectFit: 'cover' }}
        />
        <h5 style={{ fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>Interiors & exteriors</h5>
      </div>
      <div style={{ width: '48%', textAlign: 'center' }}>
        <img 
          src={falseceiling} 
          alt="Pop False Ceiling" 
          style={{ width: '157px', height: '118px', borderRadius: '15px', objectFit: 'cover' }}
        />
        <h5 style={{ fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>Pop false ceiling</h5>
      </div>
    </div>

  </div>

</div>


{/* deepcleaning */}
<div className='d-none d-lg-block' >
    <div style={{ background: '#fff', padding: '60px 40px' , marginTop:'-4%'}}>
      <div style={{
        background: '#e7f6ff',
        padding: '40px',
        borderRadius: '30px'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Deep Cleaning Service
          </h3>
          <a href="/deepcleaning" style={{
            fontWeight: 'bold',
            textDecoration: '',
            color: '#0071bc',

            fontSize: '16px'
          }}>
            See All 
          </a>
        </div>

        {/* Carousel */}
        <Carousel
          indicators={false}
          controls={true}
          interval={3000}
          className="cleaning-carousel"
          nextIcon={<span className="carousel-control-next-icon custom-icon-cleaning" />}
          prevIcon={<span className="carousel-control-prev-icon custom-icon-cleaning" />}
        >
        
          <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={fullhome} alt="Full Home Cleaning" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Full Home Cleaning</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>For A Home That Looks Brand New</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={kitchen} alt="Kitchen Cleaning" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Kitchen Cleaning</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Say Goodbye To Tough Oil & Grease
</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={bathroom} alt="Bathroom Cleaning" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Bathroom Cleaning</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Hard Water Stains? Grout Grime? Gone!</p>
              </div>
            </div>
          </Carousel.Item>
            <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={fullhome} alt="Full Home Cleaning" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Sofa Cleaning</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>We Clean Where You Lounge</p>
              </div>
            <div style={{ width: '32%', padding: '10px' }}>
                <img src={kitchen} alt="Kitchen Cleaning" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Kitchen Cleaning</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Say Goodbye To Tough Oil & Grease
</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={bathroom} alt="Bathroom Cleaning" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Bathroom Cleaning</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Hard Water Stains? Grout Grime? Gone!</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        {/* Styles for arrows */}
        <style>{`
          .cleaning-carousel .carousel-control-prev,
          .cleaning-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            opacity: 1;
          }
          .cleaning-carousel .carousel-control-prev {
            left: -20px;
               margin-top: -5%;
          }
          .cleaning-carousel .carousel-control-next {
            right: -20px;
               margin-top: -5%;
          }
       /* Icon customization */
.custom-icon {
  background-color: #e60000; /* This defines the arrow color */
  width: 20px;
  height: 20px;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
 
}

.carousel-control-prev-icon.custom-icon-cleaning {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
  width: 20px; 
    height: 20px;
}

.carousel-control-next-icon.custom-icon-cleaning {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
    height: 20px;
      width: 20px; 
}

.carousel-control-prev-icon.custom-icon-cleaning, 
.carousel-control-next-icon.custom-icon-cleaning {
  background-color: #378FBD;
}
        `}</style>
      </div>
    </div>
    </div>

    <div className="d-block d-lg-none" style={{ background: '#fff', padding: '30px 15px' }}>
  {/* Light Blue Card */}
  <div style={{
    background: '#e7f6ff',
    padding: '25px',
    borderRadius: '20px'
  }}>
    
    {/* Section Header */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: 0,
        fontFamily: 'Poppins, sans-serif'
      }}>
        Deep Cleaning Service
      </h3>
      <a href="/deepcleaning" style={{
        color: '#378FBD',
        fontSize: '14px'
      }}>
        See All
      </a>
    </div>

    {/* Two Cards Side by Side */}
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'space-between'
    }}>
      <div style={{ flex: '1', textAlign: 'center' }}>
        <img 
          src={bathroom} 
          alt="Bathroom Cleaning" 
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '15px'
          }}
        />
        <h5 style={{
          fontWeight: 600,
          marginTop: '10px',
          fontSize: '14px'
        }}>
          Bathroom Cleaning
        </h5>
      </div>
      
      <div style={{ flex: '1', textAlign: 'center' }}>
        <img 
          src={kitchen} 
          alt="Kitchen Cleaning" 
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '15px'
          }}
        />
        <h5 style={{
          fontWeight: 600,
          marginTop: '10px',
          fontSize: '14px'
        }}>
          Kitchen Cleaning
        </h5>
      </div>
    </div>
  </div>
</div>





{/* home interior */}
<div className='d-none d-lg-block'>
    <div style={{ background: '#fff', padding: '60px 40px', marginTop:'-4%' }}>
      <div style={{
        background: '#f4e8ff',
        padding: '40px',
        borderRadius: '30px'
      }}>
        {/* Section Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Home Interior
          </h3>
          <a href="/home-interior" style={{
            fontWeight: 'bold',
            // textDecoration: 'none',
            color: '#6f2dbd',
            fontSize: '16px'
          }}>
            See All
          </a>
        </div>

        {/* Carousel */}
        <Carousel
          indicators={false}
          controls={true}
          interval={3000}
          className="interior-carousel"
          nextIcon={<span className="carousel-control-next-icon custom-icon-interior" />}
          prevIcon={<span className="carousel-control-prev-icon custom-icon-interior" />}
        >
       
          <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={fullinterior} alt="Full Interior" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Full Home Interior</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Dream Home Design, Where Imagination Meets Reality</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={modularkitchen} alt="Kitchen" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Modular Kitchen</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Smarter Kitchens, Where Functionality Meets Modern Design</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={makeover} alt="Bedroom" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Bedroom Makeover</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Wake Up To Inspiration: Create A Bedroom That Energies You</p>
              </div>
            </div>
          </Carousel.Item>
             <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={fullinterior} alt="Full Interior" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Bathroom Renovation</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Spa-Like Serenity, Design Your Bathroom Oasis</p>
              </div>
          <div style={{ width: '32%', padding: '10px' }}>
                <img src={modularkitchen} alt="Kitchen" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Modular Kitchen</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Smarter Kitchens, Where Functionality Meets Modern Design</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={makeover} alt="Bedroom" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Bedroom Makeover</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Wake Up To Inspiration: Create A Bedroom That Energies You</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        {/* Styles for Arrows */}
        <style>{`
          .interior-carousel .carousel-control-prev,
          .interior-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            opacity: 1;
          }
          .interior-carousel .carousel-control-prev {
            left: -20px;
               margin-top: -5%;
          }
          .interior-carousel .carousel-control-next {
            right: -20px;
               margin-top: -5%;
          }
       /* Icon customization */
.custom-icon {
  background-color: #e60000; /* This defines the arrow color */
  width: 20px;
  height: 20px;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.carousel-control-prev-icon.custom-icon-interior {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
  width: 20px; 
    height: 20px;
}

.carousel-control-next-icon.custom-icon-interior {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
    height: 20px;
      width: 20px; 
}

.carousel-control-prev-icon.custom-icon-interior, 
.carousel-control-next-icon.custom-icon-interior {
  background-color: #7E44AC;
}
        `}</style>
      </div>
    </div>
    </div>

    <div className="d-block d-lg-none" style={{ background: '#fff', padding: '30px 15px' }}>
  {/* Purple Background Card */}
  <div style={{
    background: '#f4e8ff',
    padding: '25px',
    borderRadius: '20px'
  }}>

    {/* Section Header */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: 0,
        fontFamily: 'Poppins, sans-serif'
      }}>
        Home Interior
      </h3>
      <a href="/home-interior" style={{
        color: '#6f2dbd',
        fontSize: '14px'
      }}>
        See All
      </a>
    </div>

    {/* Cards Grid */}
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      justifyContent: 'space-between'
    }}>
      {/* Card 1 */}
      <div style={{ width: '48%', textAlign: 'center' }}>
        <img 
          src={fullinterior} 
          alt="Full Home Interior" 
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '15px'
          }}
        />
        <h5 style={{
          fontWeight: '600',
          marginTop: '10px',
          fontSize: '14px'
        }}>Full Home Interior</h5>
      </div>

      {/* Card 2 */}
      <div style={{ width: '48%', textAlign: 'center' }}>
        <img 
          src={modularkitchen} 
          alt="Modular Kitchen" 
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '15px'
          }}
        />
        <h5 style={{
          fontWeight: '600',
          marginTop: '10px',
          fontSize: '14px'
        }}>Modular Kitchen</h5>
      </div>

    

    </div>
  </div>
</div>





{/* packers and movers */}
<div className='d-none d-lg-block'>
    <div style={{ background: '#fff', padding: '60px 40px', marginTop:'-4%' }}>
      <div style={{
        background: '#D7FFF6',
        padding: '40px',
        borderRadius: '30px'
      }}>
        {/* Section Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Packers & Movers
          </h3>
          <a href="/packers-movers" style={{
            fontWeight: 'bold',
            // textDecoration: 'none',
            color: '#6f2dbd',
            fontSize: '16px'
          }}>
            See All
          </a>
        </div>

        {/* Carousel */}
        <Carousel
          indicators={false}
          controls={true}
          interval={3000}
          className="interior-carousel"
          nextIcon={<span className="carousel-control-next-icon custom-icon-interior" />}
          prevIcon={<span className="carousel-control-prev-icon custom-icon-interior" />}
        >
        
          <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={fullinterior} alt="Full Interior" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Hire Vehicle</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Rent the perfect truck for your smooth, efficient move</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={modularkitchen} alt="Kitchen" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Packers & Movers</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>From packing to transport, we make shifting effortless and worry-free</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={makeover} alt="Bedroom" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Warehouse & Storage</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Secure, flexible storage for your goods
</p>
              </div>
            </div>
          </Carousel.Item>
            <Carousel.Item>
            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={fullinterior} alt="Full Interior" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Loading & Unloading</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Our experts ensure safe, efficient loading and unloading of all your items
</p>
              </div>
               <div style={{ width: '32%', padding: '10px' }}>
                <img src={modularkitchen} alt="Kitchen" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Packers & Movers</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>From packing to transport, we make shifting effortless and worry-free</p>
              </div>
              <div style={{ width: '32%', padding: '10px' }}>
                <img src={makeover} alt="Bedroom" style={{ width: '100%', height: '250px', borderRadius: '15px', objectFit: 'cover' }} />
                <h5 style={{ fontWeight: '700', marginTop: '15px' }}>Warehouse & Storage</h5>
                <p style={{ fontSize: '14px', color: '#444' }}>Secure, flexible storage for your goods
</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        {/* Styles for Arrows */}
        <style>{`
          .interior-carousel .carousel-control-prev,
          .interior-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            opacity: 1;
          }
          .interior-carousel .carousel-control-prev {
            left: -20px;
               margin-top: -5%;
          }
          .interior-carousel .carousel-control-next {
            right: -20px;
               margin-top: -5%;
          }
        /* Icon customization */
.custom-icon {
  background-color: #e60000; /* This defines the arrow color */
  width: 20px;
  height: 20px;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.carousel-control-prev-icon.custom-icon-interior {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
  width: 20px; 
    height: 20px;
}

.carousel-control-next-icon.custom-icon-interior {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>");
  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23B45835' stroke-width='2' fill='none'/></svg>\");
    height: 20px;
      width: 20px; 
}

.carousel-control-prev-icon.custom-icon-interior, 
.carousel-control-next-icon.custom-icon-interior {
  background-color: #7E44AC;
}
        `}</style>
      </div>
    </div>
    </div>
    <div className="d-block d-lg-none" style={{ background: '#fff', padding: '30px 15px' }}>
  {/* Greenish Blue Background Card */}
  <div style={{
    background: '#D7FFF6',
    padding: '25px',
    borderRadius: '20px'
  }}>

    {/* Section Header */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: 0,
        fontFamily: 'Poppins, sans-serif'
      }}>
        Packers & Movers
      </h3>
      <a href="/packers-movers" style={{
        color: '#7E44AC',
        fontSize: '14px',
        fontWeight: 600,
      
      }}>
        See All
      </a>
    </div>

    {/* Static Card Grid */}
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    }}>
      {/* Card 1 */}
      <div style={{ width: '48%', textAlign: 'center' }}>
        <img 
          src={makeover} 
          alt="Warehouse & Storage" 
          style={{ 
            width: '100%', 
            height: '150px', 
            objectFit: 'cover', 
            borderRadius: '15px' 
          }} 
        />
        <h5 style={{ 
          fontWeight: 600, 
          marginTop: '10px', 
          fontSize: '14px' ,
          whiteSpace:'nowrap'
        }}>
          Warehouse & Storage
        </h5>
      </div>

      {/* Card 2 */}
      <div style={{ width: '48%', textAlign: 'center' }}>
        <img 
          src={modularkitchen} 
          alt="Packers & Movers" 
          style={{ 
            width: '100%', 
            height: '150px', 
            objectFit: 'cover', 
            borderRadius: '15px' 
          }} 
        />
        <h5 style={{ 
          fontWeight: 600, 
          marginTop: '10px', 
          fontSize: '14px' 
        }}>
          Packers & Movers
        </h5>
      </div>
    </div>
  </div>
</div>




{/* how it works */}
  <div className='d-none d-lg-block'>
      <div style={{ background: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        {/* Main Heading */}
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          fontFamily: 'Poppins, sans-serif',
          color: '#111',
          marginBottom: '10px',
          position: 'relative',
          display: 'inline-block'
        }}>
          How It Work
          <img 
      src={vectoricon}
      alt=""
      style={{
        position: 'absolute',
        bottom: '-14px',
        left: '50px',
        width: '180px', 
        height: 'auto',
        borderRadius: '10px',
        pointerEvents: 'none'
      }}
    />
        </h2>

        <p style={{
          fontWeight: 600,
          fontSize: '26px',
          marginTop: '20px',
          marginBottom: '30px'
        }}>
          Just A Few Steps To Transform Your Home
        </p>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
        {['Painting', 'Cleaning', 'Shifting', 'Interiors'].map((item, idx) => (
    <button
      key={idx}
      onClick={() => setActiveCategory(item)}
      style={{
        padding: '6px 20px',
        borderRadius: '20px',
        fontWeight: 600,
        border: 'none',
        backgroundColor: activeCategory === item ? 'red' : '#f1f1f1',
        color: activeCategory === item ? 'white' : '#333',
        cursor: 'pointer'
      }}
    >
      {item}
    </button>
  ))}

        </div>

        {/* Section Title */}
        <h3 style={{
          fontWeight: 700,
          fontSize: '26px',
          marginBottom: '30px'
        }}>
          Our Smooth Process
        </h3>

        <div style={{ background: '#fff', padding: '60px 20px', textAlign: 'center' }}>

    {/* Carousel */}
<Carousel
  indicators={true}
  controls={true}
  interval={4000}
  className="how-carousel"
  nextIcon={<span className="carousel-control-next-icon custom-icon" />}
  prevIcon={<span className="carousel-control-prev-icon custom-icon" />}
>
  {chunkArray(serviceSteps[activeCategory] || [], 3).map((stepGroup, groupIndex) => (
    <Carousel.Item key={groupIndex}>
      <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ padding: '0 5%' }}>
        {stepGroup.map((step, stepIndex) => (
          <React.Fragment key={stepIndex}>
            <div
              style={{
                width: '25%',
                backgroundColor: (stepIndex + groupIndex * 3) % 2 === 0 ? 'red' : '#000',
                borderRadius: '25px',
                padding: '20px',
                color: '#fff',
                transform: (stepIndex + groupIndex * 3) % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
              }}
            >
              <img
                src={(stepIndex + groupIndex * 3) % 3 === 0 ? step1 : (stepIndex + groupIndex * 3) % 3 === 1 ? step2 : step3}
                alt={`Step ${stepIndex + 1}`}
                style={{ width: '100%', borderRadius: '15px' }}
              />
              <h5 style={{ marginTop: '20px', fontSize: '18px' }}>
                0{stepIndex + 1 + groupIndex * 3} <br />
                <strong>{step}</strong>
              </h5>
            </div>

            {/* Arrow between items (but not after last item in group) */}
            {stepIndex < stepGroup.length - 1 && (
              <img
                src={arrowicon}
                alt="arrow"
                style={{ width: '70px', margin: '0 15px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </Carousel.Item>
  ))}
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
    background-color: #e60000; /* This defines the arrow color */
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
    -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.5 2L4.5 8L10.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>\");
  }

  .carousel-control-next-icon.custom-icon {
    mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>");
    -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 2L11.5 8L5.5 14' stroke='%23e60000' stroke-width='2' fill='none'/></svg>\");
  }
      .carousel-indicators {
        bottom: -62px;
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

    <div className="d-block d-lg-none" style={{ background: '#fff', padding: '30px 15px', textAlign: 'center' }}>

  {/* Heading */}
  <h2 style={{
    fontSize: '28px',
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    color: '#111',
    marginBottom: '10px',
    position: 'relative',
    display: 'inline-block'
  }}>
    How It Work
    {/* <img 
      src={vectoricon} 
      alt=""
      style={{
        position: 'absolute',
        bottom: '-14px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: 'auto',
        borderRadius: '10px',
        pointerEvents: 'none'
      }}
    /> */}
  </h2>

  {/* Subtext */}
  <p style={{
    fontWeight: 600,
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '30px'
  }}>
    Just A Few Steps To Transform Your Home
  </p>

  {/* Filter Buttons */}
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '30px',
    backgroundColor:'#f1f1f1',
    borderRadius:'54px',
    flexWrap: 'wrap'
  }}>
    {['Painting', 'Cleaning', 'Shifting', 'Interiors'].map((item, idx) => (
      <button
        key={idx}
        onClick={() => setActiveCategory(item)}
        style={{
          padding: '5px 15px',
          borderRadius: '20px',
          fontWeight: 600,
          fontSize: '10px',
          border: 'none',
          backgroundColor: activeCategory === item ? 'red' : '#f1f1f1',
          color: activeCategory === item ? 'white' : '#333',
          cursor: 'pointer'
        }}
      >
        {item}
      </button>
    ))}
  </div>

  {/* Section Title */}
  <h3 style={{
    fontWeight: 700,
    fontSize: '20px',
    marginBottom: '20px'
  }}>
    Our Smooth Process
  </h3>

  <div
    style={{
      overflowX: 'auto',
      display: 'flex',
      gap: '16px',
      paddingLeft: '15px',
      scrollSnapType: 'x mandatory',
    }}
  >
    {[
      { img: step1, bg: 'red', label: '01', title: 'At Home Consult' },
      { img: step2, bg: '#000', label: '02', title: 'Measurements & Quotes' },
      { img: step3, bg: 'red', label: '03', title: 'Booking Confirmation' }
    ].map((item, idx) => (
      <div
        key={idx}
        style={{
          minWidth: '85%',
          flexShrink: 0,
          scrollSnapAlign: 'start',
          backgroundColor: item.bg,
          borderRadius: '25px',
          padding: '20px',
          color: '#fff',
        }}
      >
        <img
          src={item.img}
          alt={`Step ${item.label}`}
          style={{ width: '100%', borderRadius: '15px' }}
        />
   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px' }}>
  <span style={{ fontSize: '50px', fontWeight: 'bold' }}>{item.label}</span>
  <div style={{ fontSize: '20px', lineHeight: '1.4', marginLeft:'6%', marginTop:'4%',  }}>
    {item.title.split(' ').slice(0, 2).join(' ')}<br />
    {item.title.split(' ').slice(2).join(' ')}
  </div>
</div>


      </div>
    ))}
  </div>

  {/* Indicators (optional, static) */}
  <div className="d-flex gap-2 mt-3" style={{ justifyContent:'center' }}>
    <div style={{ width: '30px', height: '4px', backgroundColor: 'red', borderRadius: '4px' }}></div>
    <div style={{ width: '20px', height: '4px', backgroundColor: '#ccc', borderRadius: '4px' }}></div>
    <div style={{ width: '20px', height: '4px', backgroundColor: '#ccc', borderRadius: '4px' }}></div>
    <div style={{ width: '20px', height: '4px', backgroundColor: '#ccc', borderRadius: '4px' }}></div>
    <div style={{ width: '20px', height: '4px', backgroundColor: '#ccc', borderRadius: '4px' }}></div>
  </div>

</div>



{/* our promises */}
<div className='d-none d-lg-block'>
    <div style={{ background: '#fff', padding: '60px 20px', marginTop:'-4%' , }}>
      <div style={{
        background: '#f8f8f8',
        padding: '40px',
        textAlign: 'center',
        borderRadius: '40px',
        maxWidth: '1350px',
        margin: '0 auto'
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative',
          fontFamily: 'Poppins, sans-serif',
          display: 'inline-block'
        }}>
          Our Promises
          <img 
    src={vectoricon}
    alt=""
    style={{
      position: 'absolute',
      bottom: '-14px',
      left: '40px',
      width: '170px', 
      height: 'auto',
      borderRadius: '10px',
      pointerEvents: 'none'
    }}
  />
        </h2>

        {/* Grid */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginTop: '50px'
        }}>
          {promises.map((item, index) => (
            <div key={index} style={{
              flex: '1 1 22%',
              backgroundColor: item.bg,
              borderRadius: '20px',
              padding: '25px',
              textAlign: 'center',
              minWidth: '252px'
            }}>
              <img src={item.icon} alt={`Icon ${index + 1}`} style={{ height: '80px', marginBottom: '15px', width:'80px' }} />
              <p style={{ fontWeight: 700, whiteSpace: 'pre-line' }}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    <div className="d-block d-lg-none" style={{ background: '#f8f8f8', padding: '30px 15px', textAlign:'center' }}>

{/* Title */}
<h2 style={{
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '30px',
  fontFamily: 'Poppins, sans-serif',
  position: 'relative',
  display: 'inline-block'
}}>
  Our Promises
  <img 
    src={vectoricon}
    alt=""
    style={{
      position: 'absolute',
      bottom: '-14px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '120px',
      height: 'auto',
      borderRadius: '10px',
      pointerEvents: 'none'
    }}
  />
</h2>

{/* Cards Grid */}
<div style={{
  background: '#f8f8f8',
  padding: '30px 20px',
  borderRadius: '30px',
  display: 'grid',

  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginTop: 'px'
}}>
  {promises.map((item, index) => (
    <div key={index} style={{
      backgroundColor: item.bg,
      borderRadius: '20px',
      padding: '20px 10px',
      textAlign: 'center',
      height:'165px',
    }}>
      <img src={item.icon} alt={`Icon ${index + 1}`} style={{ height: '60px', marginBottom: '10px', width: '60px' }} />
      <p style={{ fontWeight: 700, fontSize: '13px', margin: 0, whiteSpace: 'pre-line' }}>
        {item.title}
      </p>
    </div>
  ))}
</div>

</div>


{/* what are you looking for */}
<div className='d-none d-lg-block'>
<div
  style={{
    backgroundColor: '#000',
    padding: '60px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    color: '#fff',
  }}
>
  {/* Left Side with Background Image */}
  <div
  style={{
    position: 'relative',
    maxWidth: '600px',
    maxHeight: '800px',
    margin: '0 auto',
    padding: '60px 30px',
    borderRadius: '20px',
    textAlign: 'center',
    overflow: 'hidden',
  }}
>
  {/* Background Image */}
  <img
    src={lineiconimage}
    alt="Background"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '800px',
      objectFit: 'cover', // or 'contain' depending on your image type
      zIndex: 0,
    }}
  />

  {/* Foreground Content */}
  <div style={{ position: 'relative', zIndex: 1 }}>
    <h3
      style={{
        fontSize: '35px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '10px',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'red', fontSize: '46px' }}>Hey!</span>{' '}
      <span role="img" aria-label="wave">👋</span>
    </h3>

    <h1
      style={{
        fontSize: '42px',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        margin: 0,
        lineHeight: '1.2',
        color: '#fff',
      }}
    >
      What are you looking for?
    </h1>

    <p
      style={{
        fontSize: '32px',
        fontWeight: 500,
        marginTop: '20px',
        color: '#fff',
        whiteSpace: 'nowrap',
      }}
    >
      We are here to help you
    </p>
  </div>
</div>

  {/* Right Image */}
  <div>
    <img
      src={lookingImage}
      alt="Looking For Help"
      style={{
        maxWidth: '400px',
        width: '100%',
        borderRadius: '20px',
        marginTop: '30px',
      }}
    />
  </div>
</div>

    </div>
    <div className="d-block d-lg-none" style={{
  backgroundColor: '#000',
  backgroundImage: `url(${lineicon})`, // Add this line
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover', // or 'contain' depending on your desired effect
  padding: '40px 20px',
  textAlign: 'center',
  color: '#fff',
}}>

  {/* Heading Section */}
  <h3 style={{
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px'
  }}>
    <span style={{ color: 'red', fontSize: '30px' }}>Hey!</span> <span role="img" aria-label="wave">👋</span>
  </h3>

  <h1 style={{
    fontSize: '24px',
    fontWeight: 800,
    margin: 0,
    lineHeight: '1.3',
    whiteSpace:'nowrap',
    position: 'relative',
    display: 'inline-block',
    marginBottom: '20px'
  }}>
    What Are You Looking For?
    <img 
      src={vectoricon}
      alt=""
      style={{
        position: 'absolute',
        bottom: '-10px',
        left: '70%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: 'auto',
        pointerEvents: 'none'
      }}
    />
  </h1>

  <p style={{
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '-8px',
    marginBottom: '30px'
  }}>
    We are here to help you
  </p>

  {/* Image Section */}
  <img 
    src={lookingImage}
    alt="Looking For Help"
    style={{
      width: '100%',
      height:'270px',
      borderRadius: '20px',
      maxWidth: '350px',
      margin: '0 auto',
      display: 'block'
    }}
  />

</div>

{/* testimonals */}
<div className='d-none d-lg-block'>
    <div style={{ background: '#fff', padding: '60px 20px', textAlign: 'center' }}>
  {/* Title Section */}
  <h2 style={{
    fontSize: '40px',
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '10px',
    position: 'relative',
    display: 'inline-block'
  }}>
    Testimonials
    <img 
    src={vectoricon}
    alt=""
    style={{
      position: 'absolute',
      bottom: '-14px',
      left: '35px',
      width: '180px', 
      height: 'auto',
      borderRadius: '10px',
      pointerEvents: 'none'
    }}
  />
  </h2>

  <p style={{ fontWeight: 600, fontSize: '20px', marginTop: '20px', marginBottom: '40px' }}>
    What People Say About Us
  </p>
  <div style={{ margin: '0 40px' }}>
  {/* Carousel */}
  <Carousel
  indicators={true}
  controls={false}
  interval={6000}
  className="testimonial-carousel"
  // style={{maxWidth:'1200x'}}
>
  <Carousel.Item>
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        padding: '0 5%',
        gap: '30px',
        flexWrap: 'nowrap', // prevents wrapping
        overflowX: 'hidden'    // allows horizontal scroll on smaller screens
      }}
    >
      {[...Array(3)].map((_, idx) => (
        <div key={idx}>
          <video
            src={testimonialVideo}
            width="644"
            height="312"
            controls
            muted
            preload="auto"
            style={{
              objectFit: 'cover',
              borderRadius: '20px',
              display: 'block',
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
        padding: '0 5%',
        gap: '30px',
        flexWrap: 'nowrap',
        overflowX: 'hidden',
      }}
    >
      {[...Array(3)].map((_, idx) => (
        <div key={idx}>
          <video
            src={testimonialVideo}
            width="644"
            height="312"
            controls
            muted
            preload="auto"
            style={{
              objectFit: 'cover',
              borderRadius: '20px',
              display: 'block',
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
<div className="d-block d-lg-none" style={{ background: '#fff', padding: '40px 20px', textAlign: 'center' }}>
  
  {/* Title Section */}
  <h2 style={{
    fontSize: '30px',
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '10px',
    position: 'relative',
    display: 'inline-block'
  }}>
    Testimonials
    <img 
      src={vectoricon}
      alt=""
      style={{
        position: 'absolute',
        bottom: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '130px',
        height: 'auto',
        pointerEvents: 'none'
      }}
    />
  </h2>

  <p style={{
    fontWeight: 600,
    fontSize: '16px',
    marginTop: '2px',
    // marginBottom: '30px'
  }}>
    What People Say About Us
  </p>
  <Swiper
        slidesPerView={1.2}
        spaceBetween={10}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        style={{ paddingLeft: '20px', marginBottom: '20px' }}
      >
        {videos.map((vid, index) => (
          <SwiperSlide key={index}>
            <video
              src={vid}
              height="220"
              controls
              muted
              style={{
                borderRadius: '15px',
                objectFit: 'cover',
                width: '100%',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Indicator Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {videos.map((_, index) => (
          <div
            key={index}
            style={{
              width: activeIndex === index ? '30px' : '20px',
              height: '4px',
              backgroundColor: activeIndex === index ? 'red' : '#ccc',
              borderRadius: '5px',
              transition: 'width 0.3s',
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

{/* experience what we offer */}
<div className='d-none d-lg-block'>
<div style={{ 
      backgroundColor: '#eadcf8', 
      borderRadius: '30px', 
      padding: '60px 20px', 
      width: '90%',
      maxWidth: '1300px',
      margin: '40px auto',
      marginTop: '40px', 
      textAlign: 'center' 
    }}>
      
      <h2 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative',
        display: 'inline-block',
        color: '#000'
      }}>
        Experience <span style={{ color: '#000' }}>We Offer</span>
        <img 
          src={vectoricon}
          alt="underline"
          style={{
            position: 'absolute',
            bottom: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: 'auto',
            pointerEvents: 'none'
          }}
        />
      </h2>

      <Carousel
        indicators={true}
        controls={false}
        interval={6000}
        className="experience-carousel"
      >
        <Carousel.Item>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            {testimonials.map((item, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                borderRadius: '25px',
                padding: '35px 30px',
                maxWidth: '300px',  // increased width
                minWidth: '300px',
                minHeight: '320px',  // increased height
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', // slightly deeper shadow
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={item.image} alt={item.name} style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      marginRight: '15px',
                      objectFit: 'cover'
                    }} />
                    <div>
                      <strong style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{item.name}</strong>
                      <div style={{ fontSize: '14px', color: '#777' }}>{item.role}</div>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '15px',
                    color: '#555',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    “{item.text}”
                  </p>
                </div>
                <div style={{ color: '#ffc107', fontSize: '18px' }}>
                  {'★'.repeat(item.rating)}
                </div>
              </div>
            ))}
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Styling for indicators */}
      <style>{`
        .experience-carousel .carousel-indicators {
          bottom: -60px;
        }
        .experience-carousel .carousel-indicators [data-bs-target] {
          width: 30px;
          height: 4px;
          border-radius: 5px;
          background-color: #ccc;
          margin: 0 5px;
          transition: all 0.3s;
        }
        .experience-carousel .carousel-indicators .active {
          background-color: red;
          width: 40px;
        }
      `}</style>

    </div>
    </div>
    <div className="d-block d-lg-none" style={{ backgroundColor: '#eadcf8', padding: '40px 20px', textAlign: 'center' }}>
      
      {/* Title */}
      <h2 style={{
        fontSize: '26px',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative',
        display: 'inline-block',
        color: '#000'
      }}>
        Experience <span style={{ color: '#000' }}>We Offer</span>
        <img 
          src={vectoricon}
          alt="underline"
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: 'auto',
            pointerEvents: 'none'
          }}
        />
      </h2>

      {/* Swiper Carousel */}
      <Swiper
        slidesPerView={1.1}
        spaceBetween={15}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        style={{ paddingLeft: '10px', paddingRight: '10px', marginBottom: '20px' }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '25px 20px',
              margin: '0 auto',
              textAlign: 'left',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <img src={item.image} alt={item.name} style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '10px',
                    objectFit: 'cover'
                  }} />
                  <div>
                    <strong style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{item.name}</strong>
                    <div style={{ fontSize: '13px', color: '#777' }}>{item.role}</div>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  “{item.text}”
                </p>
              </div>
              <div style={{ color: '#ffc107', fontSize: '18px' }}>
                {'★'.repeat(item.rating)}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Indicator Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {testimonials.map((_, index) => (
          <div
            key={index}
            style={{
              width: activeIndex === index ? '30px' : '20px',
              height: '4px',
              backgroundColor: activeIndex === index ? 'red' : '#ccc',
              borderRadius: '5px',
              transition: 'width 0.3s',
            }}
          />
        ))}
      </div>
    </div>


    {/* gallery */}
    <div className='d-none d-lg-block'>
  <div
    style={{
      padding: '60px 20px',
      backgroundColor: '#fff',
      textAlign: 'center',
      maxWidth: '1350px',
      margin: '40px auto',
      borderRadius: '30px', // optional for round outer box
    }}
  >
    {/* Title */}
    <h2
      style={{
        fontSize: '32px',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
        marginBottom: '60px',
        position: 'relative',
        display: 'inline-block',
      }}
    >
      INSPIRATION FROM OUR GALLERY
      <img
        src={vectoricon}
        alt=""
        style={{
          position: 'absolute',
          bottom: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '130px',
          height: 'auto',
          borderRadius: '10px',
          pointerEvents: 'none',
        }}
      />
    </h2>

    {/* Grid Layout */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '20px',
        padding: '0 20px', // <-- Added padding inside grid
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Left Big Image */}
      <img
        src={gallery1}
        alt="Gallery 1"
        style={{
          gridRow: '1 / span 2',
          width: '400px',
          height: '658px',
          objectFit: 'cover',
          borderRadius: '25px',
        }}
      />

      {/* Top Right Two Images */}
      <img
        src={gallery2}
        alt="Gallery 2"
        style={{
          width: '435px',
          height: '220px',
          objectFit: 'cover',
          borderRadius: '25px',
        }}
      />
      <img
        src={gallery4}
        alt="Gallery 4"
        style={{
          width: '300px',
          height: '414px',
          objectFit: 'cover',
          borderRadius: '25px',
        }}
      />

      {/* Bottom Right Image */}
      <img
        src={gallery3}
        alt="Gallery 3"
        style={{
          width: '431px',
          height: '414px',
          objectFit: 'cover',
          borderRadius: '25px',
          marginTop:'-45%'
        }}
      />

      {/* Last Grid Item With Overlay */}
      <div
  style={{
    position: 'relative',
    borderRadius: '25px',
    overflow: 'hidden',
    width: '100%',
    height: '220px',
  }}
>
  {/* Background Image */}
  <img
    src={gallery5}
    alt="Gallery"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '25px',
    }}
  />

  {/* Overlay with left and right content */}
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      marginTop:'40%',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 25px',
    }}
  >
    {/* Left Text Block */}
    <div style={{ textAlign: 'left' }}>
      <div style={{ fontSize: '42px', fontWeight: 700 }}>3000+</div>
      <div style={{ fontSize: '18px' }}>Happy Homes</div>
    </div>

    {/* Right Link */}
    <a
      href="#"
      style={{
        fontSize: '18px',
        fontWeight: 500,
        textDecoration: 'underline',
        color: '#fff',
      }}
    >
      See All
    </a>
  </div>
</div>

    </div>
  </div>
</div>
    <div className="d-block d-lg-none" style={{ padding: '40px 15px', backgroundColor: '#fff', textAlign: 'center' }}>

  {/* Title */}
  <h2 style={{
    fontSize: '26px',
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '30px',
    position: 'relative',
    display: 'inline-block',
    textAlign:'left'
  }}>
    INSPIRATION FROM OUR GALLERY
    <img 
      src={vectoricon}
      alt=""
      style={{
        position: 'absolute',
        bottom: '-10px',
        left: '15%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: 'auto',
        pointerEvents: 'none'
      }}
    />
  </h2>

  {/* Gallery Grid for Mobile */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    {/* Left Big Image */}
    <img src={gallery1} alt="Gallery 1" style={{
      gridRow: '1/3',
      width: '100%',
      height: '270px',
      objectFit: 'cover',
      borderRadius: '20px'
    }} />

    {/* Top Right Small Images */}
    <img src={gallery2} alt="Gallery 2" style={{
      width: '171px',
      height: '150px',

      objectFit: 'cover',
      borderRadius: '20px'
    }} />
     <div
  style={{
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    width: '100%',         // You can fix width if needed, e.g., '320px'
    height: '114px',       // Adjust height to match your layout

  }}
>
  <img
    src={gallery5}
    alt="Gallery"
    style={{
      width: '171px',
      borderRadius:'10px',
      height: '105px',
      objectFit: 'cover',
    }}
  />

  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '15px 20px',
      color: '#fff',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'39%' }}>
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0 , textAlign:'left'}}>3000+</h3>
        <p style={{ fontSize: '10px', margin: 0, whiteSpace:'nowrap', textAlign:'left' }}>Happy Homes</p>
      </div>
      <a
        href="#"
        style={{
          fontSize: '13px',
          fontWeight: '600',
          whiteSpace:'nowrap',
          color: '#fff',
          // marginTop:'-20px',
          textDecoration: 'underline',
        }}
      >
        See All
      </a>
    </div>
  </div>
</div>

    
  </div>

</div>

{/* your home */}
<div  className='d-none d-lg-block'>
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 100px',
        // borderRadius: '50px',
        display: 'flex',
        marginTop:'-16%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* LEFT SIDE TEXT */}
      <div style={{ maxWidth: '500px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: 1.2,
          marginBottom: '20px'
        }}>
          Your Home, Our Canvas
        </h1>
        <p style={{
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.6
        }}>
          Please Enter Your Name And WhatsApp Phone Number To Receive A Call Back From Us
        </p>
      </div>

      {/* RIGHT SIDE FORM */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '25px',
        padding: '30px',
        maxWidth: '360px',
        width: '100%',
        color: '#fff'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Get a call back</h3>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input
    type="text"
    placeholder="Enter Name"
    className="white-placeholder"
    style={{
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.4)',
      background: 'transparent',
      color: '#fff',
      fontSize: '15px',
      outline: 'none',
    }}
  />

  {/* Inline style block to handle placeholder */}
  <style>
    {`
      .white-placeholder::placeholder {
        color: #fff;
        opacity: 1;
      }
    `}
  </style>
          <input
            type="text"
             className="white-placeholder"
            placeholder="Enter WhatsApp Phone Number"
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'transparent',
              color: '#fff',
              fontSize: '15px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '40px',
              border: 'none',
              background: 'linear-gradient(to right, #fff, #f0f0f0)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
    </div>

<div className="d-block d-lg-none" style={{ padding: '20px' }}>
  <div
    className="d-block d-lg-none"
    style={{
      backgroundImage: `url(${backgroundhome})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '25px',
      overflow: 'hidden', // 🔥 Makes border radius actually clip the background
      padding: '60px 20px 40px',
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#fff',
      textAlign: 'center',
    }}
  >
    {/* Header Section */}
    <div>
      <h1
        style={{
          fontSize: '36px',
          fontWeight: '600',
          textAlign:'left',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: '1.3',
          marginBottom: '16px',
        }}
      >
        Your Home, Our <br /> Canvas
      </h1>
      <p
        style={{
          fontSize: '15px',
          lineHeight: '1.6',
          textAlign:'left',
          maxWidth: '320px',
          margin: '0 auto 30px',
        }}
      >
        Please Enter Your Name And WhatsApp <br/>Phone Number To Receive A Call Back  <br/>From Us
      </p>
    </div>

    {/* Frosted Glass Form */}
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        padding: '30px 20px',
        maxWidth: '381px',
        // width: '100%',
        margin: '0 auto',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign:'left',
        }}
      >
        Get a call back
      </h3>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input
          type="text"
          placeholder="Enter Name"
          className="white-placeholder"
          style={{
            padding: '14px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.5)',
            background: 'transparent',
            color: '#fff',
            fontSize: '12px',
            outline: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Enter WhatsApp Phone Number"
          className="white-placeholder"
          style={{
            padding: '14px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.5)',
            background: 'transparent',
            color: '#fff',
            fontSize: '12px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(to right, #ffffff, #e6e6e6)',
            color: '#000',
            fontWeight: '600',
            fontSize: '13px',
            marginTop: '10px',
          }}
        >
          SUBMIT
        </button>
      </form>
    </div>

    {/* Placeholder Color Styling */}
    <style>{`
      .white-placeholder::placeholder {
        color: #ffffff;
        opacity: 1;
      }
    `}</style>
  </div>
</div>





    <br/>

    </div>
  );
};

export default Home;
