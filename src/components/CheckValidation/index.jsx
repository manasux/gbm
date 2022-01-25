import React from 'react';

const CheckValidation = ({ show, fallback, children }) => {
  return (
    <>
      {show && children}
      {!show && fallback}
    </>
  );
};

export default CheckValidation;
