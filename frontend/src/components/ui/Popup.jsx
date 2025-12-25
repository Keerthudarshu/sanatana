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
          className="ml-auto px-3 py-1 rounded bg-muted hover:bg-muted/70 text-sm font-medium border border-gray-300"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
