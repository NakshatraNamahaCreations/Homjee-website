import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import unfurnished_typesofcleaning from '../../../public/media/bookbyroomtypeofclening.webp';
import unfurnished_whatweclean from '../../../public/media/bookbyroomwhatweclean.webp';
import unfurnished_includes from '../../../public/media/unfurnishedinclued.webp';
import unfurnished_Excludes from '../../../public/media/unfurnishedexclude.webp';
import furnished_kitchen from '/media/kitchen.jpeg';
import furnished_floor from '../../../public/media/spotlessbook.webp';
import floor from '/media/floor.jpeg';
import furnished_bathroom from '../../../public/media/bathroom.webp';
import furnished_bolcany from '/media/bolcany.jpeg';
import furnished_whatwedo from '/media/whatwedo.jpeg';
import kitcheninclude from '../../../public/media/kitcheninclude.webp';
import kitchenexclude from '../../../public/media/kitchenexclude.webp';
import bathroombook from '../../../public/media/bathroombook.webp';
import bathroomexcludesbook from '../../../public/media/bathroomexcludesbook.webp';
import bathroombookmychoose from '../../../public/media/bathroombookmychoose.webp';

const UnfurnishedApartmentModal = ({ pkgGroup, closeModal }) => {
  const { updateCartItem, getQuantity } = useContext(CartContext);

  const serviceName = 'Book by room'; 

  if (!pkgGroup) {
    return null;
  }

  const getImagesForPackage = (pkgName) => {
    if (pkgName.startsWith("Bedroom Cleaning")) {
      return [
        unfurnished_typesofcleaning,
        unfurnished_whatweclean,
        furnished_floor,
        unfurnished_includes,
        unfurnished_Excludes
      ];
    } else if (pkgName.startsWith("Living Room Cleaning")) {
      return [
        unfurnished_typesofcleaning,
        unfurnished_whatweclean,
        furnished_floor,
        unfurnished_Excludes
      ];
    } else if (pkgName.startsWith("Kitchen Cleaning")) {
      return [
        furnished_kitchen,
        floor,
        kitcheninclude,
        kitchenexclude,
        furnished_whatwedo
      ];
    } else if (pkgName.startsWith("Bathroom Cleaning")) {
      return [
        bathroombook,
        bathroomexcludesbook,
        bathroombookmychoose,
      ];
    } else if (pkgName.startsWith("Balcony Cleaning")) {
      return [
        bathroombook,
        bathroomexcludesbook,
        bathroombookmychoose,
      ];
    } else {
      return [unfurnished_includes, unfurnished_Excludes];
    }
  };

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
            {pkgGroup[0].name.split(' - ')[0]} 
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
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            {getImagesForPackage(pkgGroup[0].name).map((imgSrc, i) => (
              <img
                key={i}
                src={imgSrc}
                alt={`${pkgGroup[0].name} detail ${i}`}
                style={{
                  width: '400px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            ))}
          </div>
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

export default UnfurnishedApartmentModal;