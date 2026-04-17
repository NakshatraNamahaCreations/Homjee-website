
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const ServiceModal = ({ pkgGroup, modalImages, closeModal }) => {
  const { updateCartItem, getQuantity } = useContext(CartContext);

  if (!pkgGroup) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          width: '450px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#333',
          }}
        >
          ✕
        </button>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
          {pkgGroup[0].name.split(' - ')[0]} cleaning
        </h3>
        {pkgGroup.map((pkg, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: getQuantity(pkg.name) > 0 ? '#f0f0f0' : '#fff',
            }}
            onClick={() => {
              if (getQuantity(pkg.name) === 0) {
                updateCartItem(pkg.name, pkg.price, 1);
              }
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
              {pkg.name.split(' - ')[1]} Package
            </h4>
            <p style={{ margin: '0 0 5px', color: '#333', fontSize: '14px' }}>
              ₹{pkg.price}
            </p>
            <p style={{ fontSize: '13px', color: '#333', marginBottom: '5px' }}>
              <strong>Details:</strong> {pkg.details}
            </p>
            <p style={{ fontSize: '13px', color: '#333', marginBottom: '10px' }}>
              <strong>Extras:</strong> {pkg.extras}
            </p>
            {getQuantity(pkg.name) > 0 && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid red',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  marginTop: '10px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCartItem(pkg.name, pkg.price, -1);
                  }}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#fff',
                    border: 'none',
                    fontSize: '16px',
                    color: 'red',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span style={{ padding: '5px 15px', fontSize: '14px' }}>
                  {getQuantity(pkg.name)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCartItem(pkg.name, pkg.price, 1);
                  }}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: 'red',
                    color: '#fff',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
        {pkgGroup.some((pkg) => getQuantity(pkg.name) === 0) && modalImages && Object.keys(modalImages).length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            {modalImages.typesofcleaning && (
              <img
                src={modalImages.typesofcleaning}
                alt="Types of cleaning"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.whatweclean && (
              <img
                src={modalImages.whatweclean}
                alt="What we clean"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.kitchen && (
              <img
                src={modalImages.kitchen}
                alt="Kitchen"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.bathroom && (
              <img
                src={modalImages.bathroom}
                alt="Bathroom"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.bolcany && (
              <img
                src={modalImages.bolcany}
                alt="Balcony"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.floor && (
              <img
                src={modalImages.floor}
                alt="Floor"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.includes && (
              <img
                src={modalImages.includes}
                alt="Includes"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.Excludes && (
              <img
                src={modalImages.Excludes}
                alt="Excludes"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
            {modalImages.whatwedo && (
              <img
                src={modalImages.whatwedo}
                alt="What we do"
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;
