import React, { useContext } from 'react';
import { CartContext } from '../CartContext';

// Placeholder for image imports (uncomment and update with actual paths if needed)
// import mini_service_image1 from '../../../public/media/mini_service1.webp';
// import mini_service_image2 from '../../../public/media/mini_service2.webp';

const MiniServicesModal = ({ pkgGroup, closeModal }) => {
  const { updateCartItem, getQuantity } = useContext(CartContext);

  if (!pkgGroup) {
    return null;
  }
   const serviceName = 'Mini Services'; 

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
          borderRadius: '10px',
          width: '450px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
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
        <div
          style={{
            overflowY: 'auto',
            padding: '20px',
            flex: 1,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
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
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>
            {serviceName} - {pkgGroup[0].name.split(' - ')[0]}
          </h2>
          {/* <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            {pkgGroup[0].name.split(' - ')[0]} cleaning
          </h3> */}
          {pkgGroup.map((pkg, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
              onClick={() => {
                if (getQuantity(pkg.name) === 0) {
                  updateCartItem(pkg.name, pkg.price, 1);
                }
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>
                  {pkg.name.split(' - ')[1]}
                </h4>
                <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '8px' }}>
                  ₹{pkg.price} • {pkg.name.includes("Premium") ? '6 hrs' : '5 hrs'}
                </p>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', marginBottom: '8px', color: '#333' }}>
                  <li>{pkg.details}</li>
                  <li>{pkg.extras}</li>
                </ul>
              </div>
              <div style={{ marginLeft: '15px', marginTop: '8px' }}>
                {getQuantity(pkg.name) > 0 ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid red',
                      borderRadius: '20px',
                      overflow: 'hidden',
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
                ) : (
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      color: 'red',
                      border: '1px solid red',
                      padding: '8px 18px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
          {/* Placeholder for images (uncomment and update with actual images if needed) */}
          {/* <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <img
              src={mini_service_image1}
              alt="Mini Service 1"
              style={{
                width: '400px',
                height: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '15px',
              }}
            />
            <img
              src={mini_service_image2}
              alt="Mini Service 2"
              style={{
                width: '400px',
                height: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '15px',
              }}
            />
          </div> */}
        </div>
        {pkgGroup.some((pkg) => getQuantity(pkg.name) > 0) && (
          <div
            style={{
              borderTop: '1px solid #ddd',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {pkgGroup.reduce((total, pkg) => total + getQuantity(pkg.name), 0)} × ₹
              {pkgGroup.reduce((total, pkg) => total + getQuantity(pkg.name) * pkg.price, 0)}
            </div>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: 'red',
                color: '#fff',
                border: 'none',
                padding: '10px 25px',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniServicesModal;