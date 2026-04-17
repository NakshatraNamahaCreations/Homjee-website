import React, { useState, useEffect } from 'react';
import { Button, Nav, Modal } from 'react-bootstrap';
import { BsTelephoneFill } from 'react-icons/bs';
import logo from '../assets/logohomjee.svg'; 
import houseIcon from '../assets/house.png'; 
import cleanIcon from '../assets/clean.png';
import interiorIcon from '../assets/interior-icon.png';
import moverIcon from '../assets/mover.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaPhone } from 'react-icons/fa'; 
import { Menu } from 'lucide-react';
import { NavDropdown } from 'react-bootstrap';


const Header = ({ onShowModal }) => {
  const [show, setShow] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const handleClose = () => setShow(false);
  const navigate = useNavigate(); 

  const handleShow = () => {
    setShow(true);
  };

  

  useEffect(() => {
    if (onShowModal) {
      onShowModal(handleShow);
    }
  }, [onShowModal]);

  // const handleServiceClick = (service) => {
  //   setSelectedService(service);
  // };

  const handleServiceClick = (service) => {
    console.log('Service clicked:', service);
    setSelectedService(service);
  
    const routes = {
      'House Painters & Waterproofing': '/services',
      'Deep Cleaning Service': '/deepcleaning',
      'Home Interior': '/home-interior',
      'Packers & Movers': '/packers-movers',
    };
  
    if (routes[service]) {
      navigate(routes[service]);
      handleClose();
      window.location.reload(); 
    } else {
      console.warn('No route defined for selected service.');
    }
  };
  
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle the booking confirmation (i.e., sending selected service)
  const handleBooking = () => {
    if (selectedService) {
      // Send selectedService to backend or handle it here
      console.log('Booking confirmed for:', selectedService);
      handleClose();
    } else {
      alert('Please select a service before booking!');
    }
  };

  
  const handleLinkClick = () => {
    setIsMenuOpen(false); 
  };


  return (
    <div style={{overflow:'hidden'}}>
      <div className='d-none d-lg-block'>
      <div
        style={{  
          
          top: 0,
          left: 0,
          width: '100vw',
          backgroundColor: '#fff',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          padding: '12px 32px',
          overflowX: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div className="d-flex align-items-center">
          <Link to="/"   onClick={(e) => {
    if (location.pathname === '/') {
      e.preventDefault(); // Prevent default SPA behavior
      window.location.reload(); // Force reload
    }
  }}>
            <img src={logo} alt="Logo" style={{ height: '53px', marginRight: '10px', width: '138px' }} />
          </Link>
        </div>

        {/* Navigation */}
        <Nav className="d-flex align-items-center gap-1" style={{marginLeft:'10%'}}>
          <Nav.Link href="/aboutus" style={{ fontWeight: 500, color: '#000', fontSize:'14px' }}>About Us</Nav.Link>
          <Nav.Link href="" style={{ fontWeight: 500, color: '#000',fontSize:'14px'  }}>Recent Projects</Nav.Link>
          
<NavDropdown
  title={<span style={{ color: '#000', fontWeight: 500, fontSize: '14px' }}>Our Services</span>}
  id="services-dropdown"
  className="custom-service-dropdown"
  style={{ color: 'black' }}
>
  <NavDropdown.Item as={Link} to="/services" onClick={() => handleServiceClick('House Painters & Waterproofing')}>
    House Painters & Waterproofing
  </NavDropdown.Item>
  <NavDropdown.Item as={Link} to="/deepcleaning" onClick={() => handleServiceClick('Deep Cleaning Service')}>
    Deep Cleaning
  </NavDropdown.Item>
  <NavDropdown.Item as={Link} to="/home-interior" onClick={() => handleServiceClick('Home Interior')}>
    Home Interior
  </NavDropdown.Item>
  <NavDropdown.Item as={Link} to="/packers-movers" onClick={() => handleServiceClick('Packers & Movers')}>
    Packers & Movers
  </NavDropdown.Item>
  <style>{`
   nav .custom-service-dropdown .dropdown-toggle {
      color: #000 !important; /* Black color for dropdown title */
      font-weight: 500;
      font-size: 14px;
      text-decoration: none !important; /* Remove underline */
    }
  
    nav .custom-service-dropdown .dropdown-toggle::after {
    border-top-color: #000 !important;
    }



    .custom-service-dropdown .dropdown-toggle:hover,
    .custom-service-dropdown .dropdown-toggle:focus,
    .custom-service-dropdown .dropdown-toggle:active {
      color: #000 !important; /* Ensure black on hover, focus, and active */
      background-color: transparent !important; /* Prevent background changes */
      outline: none !important; /* Remove blue focus outline */
    }

    .custom-service-dropdown .dropdown-toggle::after {
      color: #000 !important; /* Black color for dropdown arrow */
    }

    .custom-service-dropdown .dropdown-menu {
      background-color: #fff !important; /* White background for dropdown */
      border-radius: 10px;
      margin-top: 0px;
      z-index: 1001;
      position: fixed !important;
      top: 80px !important;
      margin-left: 46% !important;
      transform: none !important;
    }

    .custom-service-dropdown .dropdown-item {
      color: #000 !important; /* Black text for items */
      font-weight: 500;
      padding: 10px 20px;
    }

    .custom-service-dropdown .dropdown-toggle,
  .custom-service-dropdown .dropdown-toggle:visited {
    color: #000 !important;
  }

    .custom-service-dropdown .dropdown-item:hover {
      background-color: red !important; /* Red on hover */
      color: #fff !important; /* White text on hover */
    }

    .custom-service-dropdown .dropdown-item:active,
    .custom-service-dropdown .dropdown-item:focus {
      background-color: red !important; /* Red on click/focus */
      color: #fff !important; /* White text on click/focus */
      outline: none !important; /* Remove blue outline */
    }

    .dropdown-menu.show {
      display: block;
      position: fixed !important;
      top: 80px !important;
      margin-left: 46% !important;
      z-index: 1001;
      transform: none !important;
      background-color: #fff !important; /* White when shown */
    }
  `}</style>
</NavDropdown>

          <Nav.Link href="" style={{ fontWeight: 500, color: '#000', fontSize:'14px'  }}>Reviews</Nav.Link>
          <Nav.Link href="" style={{ fontWeight: 500, color: '#000', fontSize:'14px'  }}>FAQ</Nav.Link>
          <div
            style={{
              border: '1px solid red',
              borderRadius: '30px',
              padding: '6px 18px',
              display: 'flex',
              cursor: 'pointer',
              fontSize:'16px',
              alignItems: 'center',
              color: 'black',
              fontWeight: 600,
            }}
          >
            <BsTelephoneFill style={{ marginRight: '8px', color: 'red', }} />
            95 95 95 1104
          </div>
        </Nav>

        {/* Call and Button */}
        <div className="d-flex align-items-center gap-3">
        

          <Button
            variant=""
            style={{
              padding: '8px 18px',
              borderRadius: '30px',
              fontWeight: 500,
              backgroundColor:'red',
              fontSize:'16px',
              color:'white',
              boxShadow: '0 4px 8px rgba(255, 0, 0, 0.3)',
            }}
            onClick={handleShow}
          >
            BOOK NOW
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Body style={{ padding: '30px' }}>
          <h4 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>
            Kindly select the service that you are looking for:
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              textAlign: 'center',
            }}
          >
             {[{ icon: houseIcon, label: 'House Painters & Waterproofing', service: 'House Painters & Waterproofing', route: '/services/house-painters' },
              { icon: cleanIcon, label: 'Deep Cleaning Service', service: 'Deep Cleaning Service' },
              { icon: interiorIcon, label: 'Home Interior', service: 'Home Interior' },
              { icon: moverIcon, label: 'Packers & Movers', service: 'Packers & Movers' }]
              .map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleServiceClick(item.service)}
                  style={{
                    borderRadius: '20px',
                    border: selectedService === item.service ? '2px solid red' : '1px solid #eee',
                    padding: '30px 10px',
                    backgroundColor: selectedService === item.service ? '#fff5f5' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <img src={item.icon} alt={item.label} style={{ height: '60px', marginBottom: '16px' }} />
                  <h6 style={{ fontWeight: 600 }}>{item.label}</h6>
                </div>
              ))}
          </div>
        </Modal.Body>
      </Modal>
</div>


<div className="mobile-navbar d-block d-lg-none">
      
      {/* Top Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 999,
      }}>
        
        {/* Hamburger Icon */}
        <Menu 
  size={24} 
  onClick={handleToggleMenu} 
  style={{ cursor: 'pointer', color: '#111' }} 
/>

        {/* Logo */}
        <img src={logo} alt="Logo" style={{ height: '53px', width:'138px' }} />

        {/* Phone */}
        <div style={{ display: 'flex', alignItems: 'center', color: '#000', fontWeight: '450', fontSize: '16px' }}>
          <BsTelephoneFill color="#e60000" style={{ marginRight: '6px' }} />
          95 95 95 1104
        </div>

      </div>

      {/* Mobile Menu List */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '0',
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '20px',
          zIndex: 998,
          textAlign: 'left'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <Link to="/" style={linkStyle} onClick={handleLinkClick}>Home</Link>
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <Link to="/aboutus" style={linkStyle} onClick={handleLinkClick}>About</Link>
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <Link to="/services" style={linkStyle} onClick={handleLinkClick}>Services</Link>
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <Link to="/projects" style={linkStyle} onClick={handleLinkClick}>Projects</Link>
            </li>
            <li style={{ padding: '10px 0' }}>
            <Link to="/contact" style={linkStyle} onClick={handleLinkClick}>Contact</Link>
            </li>
          </ul>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-navbar {
            display: block;
          }
        }
      `}</style>
    </div>
    </div>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: '#111',
  fontSize: '16px',
  fontWeight: '500'
};



export default Header;
