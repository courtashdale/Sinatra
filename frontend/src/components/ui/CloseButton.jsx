import React from 'react';

function CloseButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      className={`w-full py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition ${className}`}
    >
      Close
    </button>
  );
}

export default CloseButton;
