import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/30"
      onClick={(e) => e.stopPropagation()} // Prevent backtap
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{message}</h2>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
