import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-red-700 hover:text-red-900">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
