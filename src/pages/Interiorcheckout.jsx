import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaMapMarkerAlt, FaClock, FaEdit } from 'react-icons/fa';
import AddressModal from './AddressModal';

const Interiorcheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber: initialPhoneNumber } = location.state || { phoneNumber: '' };
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    houseNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Automatically open address modal on mount
  useEffect(() => {
    setShowAddressModal(true);
  }, []);

  // Function to handle opening the address modal
  const handleOpenAddressModal = () => {
    setShowAddressModal(true);
  };

  // Function to handle closing the address modal
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
  };

  // Function to handle new address form input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle saving a new address
  const handleSaveAddress = () => {
    setSelectedAddress(newAddress);
    setShowAddressModal(false);
    setShowSuccessModal(true); // Show success modal after saving address
    // Hide success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  // Function to handle selecting a predefined address
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    setShowSuccessModal(true); // Show success modal after selecting address
    // Hide success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  // Predefined addresses for demonstration
  const savedAddresses = [
    {
      houseNumber: '123',
      street: 'Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
    },
    {
      houseNumber: '456',
      street: 'Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
    },
  ];

  return (
    <div className='d-none d-lg-block'>
      <div
        style={{
          width: '1200px',
          margin: '40px auto',
          display: 'flex',
          gap: '20px',
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            flex: '1',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #e0e0e0',
              color: '#333',
            }}
          >
            Checkout
          </h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <FaPhoneAlt style={{ marginRight: '8px', fontSize: '14px', color: '#666' }} />
              <span style={{ fontSize: '14px', color: '#666' }}>Send booking details to</span>
            </div>
            {isEditingPhone ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                />
                <button
                  onClick={() => setIsEditingPhone(false)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#FF0000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>+91 {phoneNumber}</p>
                <FaEdit
                  style={{ color: '#FF0000', cursor: 'pointer' }}
                  onClick={() => setIsEditingPhone(true)}
                />
              </div>
            )}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <FaMapMarkerAlt style={{ marginRight: '8px', fontSize: '14px', color: '#666' }} />
              <span style={{ fontSize: '14px', color: '#666' }}>Address</span>
            </div>
            {!selectedAddress && (
              <button
                onClick={handleOpenAddressModal}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: 'red',
                  border: '1px solid red',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Select an address
              </button>
            )}
            {selectedAddress && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontSize: '14px', marginTop: '8px', color: '#333' }}>
                  {selectedAddress.houseNumber}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                </p>
                <FaEdit
                  style={{ color: '#FF0000', cursor: 'pointer' }}
                  onClick={handleOpenAddressModal}
                />
              </div>
            )}
          </div>
          {/* <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <FaClock style={{ marginRight: '8px', fontSize: '14px', color: '#666' }} />
              <span style={{ fontSize: '14px', color: '#666' }}>Slot</span>
            </div>
            <div
              style={{
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#888',
                backgroundColor: '#f5f5f5',
              }}
            >
              Slot selection is not available for this booking
            </div>
          </div> */}
        </div>
      </div>

      <AddressModal
        show={showAddressModal}
        handleClose={handleCloseAddressModal}
        savedAddresses={savedAddresses}
        selectedAddress={selectedAddress}
        handleSelectAddress={handleSelectAddress}
        newAddress={newAddress}
        handleAddressChange={handleAddressChange}
        handleSaveAddress={handleSaveAddress}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            textAlign: 'center',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <p style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>
            Enquiry added successfully, we will get back to you
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            style={{
              padding: '8px 15px',
              backgroundColor: '#FF0000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Interiorcheckout;