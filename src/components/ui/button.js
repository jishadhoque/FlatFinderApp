// src/components/ui/button.js
import React from 'react';

export const Button = ({ type, onClick, children, className }) => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

