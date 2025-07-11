import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import homjeeLogo from '../assets/homjee-logo.png'; 
import locationIcon from '../assets/location.png';
import chat from '../assets/sms.png'
import Phone from '../assets/call.png';
import facebook from '../assets/facebook.png';
import Instagram from '../assets/instagram.png';
import youtube from '../assets/youtube.png'
import { Link, useNavigate } from 'react-router-dom';


const Footer = () => {

  const navigate = useNavigate();

    const [isServicesExpanded, setIsServicesExpanded] = useState(false);

 
  const toggleServices = () => {
    setIsServicesExpanded(!isServicesExpanded);
  };

  

  return (
    <>
    <footer className='d-none d-lg-block' style={{ background: '#0d0d0d', color: '#fff', padding: '60px 114px 30px', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '40px',
        maxWidth: '1200px',
        // paddingLeft:'87px',
        margin: '0 auto'
      }}>
        {/* Address + Contact */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <img src={homjeeLogo} alt="Homjee Logo" style={{ height: '51px', marginBottom: '20px' }} />
          <p style={{ fontSize: '14px', margin: '10px 0', lineHeight: '1.6' }}>
          <img 
    src={locationIcon} 
    alt="Location" 
    style={{ width: '18px', height: '18px', marginRight: '8px' }} 
  />
            B-101, Esquire Vastukalp, Pimple Nilakh,<br /> Pune - 411027
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
          <img 
    src={chat} 
    alt="Location" 
    style={{ width: '18px', height: '18px', marginRight: '8px' }} 
  />
            hello@homjee.com
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
          <img 
    src={Phone} 
    alt="Location" 
    style={{ width: '18px', height: '18px', marginRight: '8px' }} 
  />
            95 95 95 1104
          </p>
        </div>

        {/* Quick Links */}
         <div style={{ flex: '1', minWidth: '200px' }}>
          <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
            <li>
              <a href="/aboutus" style={{ color: '#ccc', textDecoration: 'none' }}>
                About Us
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                Recent Projects
              </a>
            </li>
            {/* Expandable Services Section */}
            <li>
              <span
                onClick={toggleServices}
                style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Our Services
                <span style={{ marginLeft: '5px' }}>{isServicesExpanded ? '' : ''}</span>
              </span>
              {isServicesExpanded && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px', lineHeight: '2' }}>
                  <li>
                    <a href="/services" style={{ color: '#ccc', textDecoration: 'none', whiteSpace:'nowrap' }}>

                      House Painters & Waterproofing
                    </a>
                  </li>
                  <li>
                    <a href="/deepcleaning" style={{ color: '#ccc', textDecoration: 'none' }}>
                      Deep Cleaning
                    </a>
                  </li>
                  <li>
                    <a href="/home-interior" style={{ color: '#ccc', textDecoration: 'none' }}>
                      Home Interior
                    </a>
                  </li>
                  <li>
                    <a href="/packers-movers" style={{ color: '#ccc', textDecoration: 'none' }}>
                      Packers & Movers
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                Reviews
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                FAQ
              </a>
            </li>
          </ul>
        </div>

       

        {/* Social Links */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h4 style={{ marginBottom: '20px' }}>Social Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' , fontSize:"16px",}}>
            <li><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}><img 
    src={facebook} 
    alt="Location" 
    style={{ width: '18px', height: '18px', marginRight: '8px' }} 
  /> Facebook</a></li>
            <li><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}><img 
    src={Instagram} 
    alt="Location" 
    style={{ width: '18px', height: '18px', marginRight: '8px' }} 
  /> Instagram</a></li>
            <li><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}><img 
    src={youtube} 
    alt="Location" 
    style={{ width: '18px', height: '18px', marginRight: '8px' }} 
  /> Youtube</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
 <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '13px', color: '#999' }}>
          <span 
            onClick={() => { navigate('/terms'); window.location.reload(); }} 
            style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}
          >
            Terms & Conditions
          </span> | 
          <span 
            onClick={() => { navigate('/privacy-policy'); window.location.reload(); }} 
            style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}
          >
            Privacy Policy
          </span> 
          © Copyright 2024 Homjee Services Pvt. Ltd. All Rights Reserved.
        </div>
    </footer>
      <footer
      className="d-block d-lg-none"
      style={{
        background: '#0d0d0d',
        color: '#fff',
        padding: '60px 30px 30px',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Address + Contact */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <img src={homjeeLogo} alt="Homjee Logo" style={{ height: '40px', marginBottom: '20px' }} />
          <p style={{ fontSize: '14px', margin: '10px 0', lineHeight: '1.6' }}>
            <img
              src={locationIcon}
              alt="Location"
              style={{ width: '20px', height: '20px', marginRight: '8px' }}
            />
            B-101, Esquire Vastukalp, Pimple Nilakh,<br /> Pune - 411027
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <img src={chat} alt="Chat" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            hello@homjee.com
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <img src={Phone} alt="Phone" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            95 95 95 1104
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
            <li>
              <a href="/aboutus" style={{ color: '#ccc', textDecoration: 'none' }}>
                About Us
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                Recent Projects
              </a>
            </li>
            {/* Expandable Services Section */}
            <li>
              <span
                onClick={toggleServices}
                style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Our Services
                <span style={{ marginLeft: '5px' }}>{isServicesExpanded ? '▲' : '▼'}</span>
              </span>
              {isServicesExpanded && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px', lineHeight: '2' }}>
                  <li>
                    <a href="/services" style={{ color: '#ccc', textDecoration: 'none' }}>
                      House Painters & Waterproofing
                    </a>
                  </li>
                  <li>
                    <a href="/deepcleaning" style={{ color: '#ccc', textDecoration: 'none' }}>
                      Deep Cleaning
                    </a>
                  </li>
                  <li>
                    <a href="/home-interior" style={{ color: '#ccc', textDecoration: 'none' }}>
                      Home Interior
                    </a>
                  </li>
                  <li>
                    <a href="/packers-movers" style={{ color: '#ccc', textDecoration: 'none' }}>
                      Packers & Movers
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                Reviews
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Policies */}
        

        {/* Social Links */}
        <div style={{ flex: '1', minWidth: '200px', lineHeight: '3' }}>
          <h4 style={{ marginBottom: '20px' }}>Social Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2', fontSize: '16px' }}>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                <img
                  src={facebook}
                  alt="Facebook"
                  style={{ width: '20px', height: '18px', marginRight: '8px' }}
                />
                Facebook
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                <img
                  src={Instagram}
                  alt="Instagram"
                  style={{ width: '20px', height: '18px', marginRight: '8px' }}
                />
                Instagram
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>
                <img
                  src={youtube}
                  alt="Youtube"
                  style={{ width: '20px', height: '18px', marginRight: '8px' }}
                />
                Youtube
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
       <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '13px', color: '#999' }}>
          <span 
            onClick={() => { navigate('/terms'); window.location.reload(); }} 
            style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}
          >
            Terms & Conditions
          </span> | 
          <span 
            onClick={() => { navigate('/privacy-policy'); window.location.reload(); }} 
            style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}
          >
            Privacy Policy
          </span> 
          © Copyright 2024 Homjee Services Pvt. Ltd. All Rights Reserved.
        </div>
    </footer>
    </>
  );
};

export default Footer;
