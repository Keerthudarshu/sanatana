import React from 'react';

/**
 * Simple popup component for notifications.
 * @param {string} message - The message to display.
 * @param {boolean} open - Whether the popup is visible.
 * @param {function} onClose - Called when the popup is dismissed.
 * @param {string} [type] - Optional type: 'success', 'error', etc.
 */
export default function Popup({ message, open, onClose, type = 'info' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 py-8 pointer-events-none">
      <div
        className={`pointer-events-auto bg-white border rounded-lg shadow-lg p-4 min-w-[280px] max-w-sm flex items-center space-x-3 ${
          type === 'success' ? 'border-green-400' : type === 'error' ? 'border-red-400' : 'border-gray-300'
        }`}
        role="alert"
      >
        <span className={`text-lg ${type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-gray-800'}`}> 
          {message}
        </span>
        <button
          className="ml-auto p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={onClose}
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
