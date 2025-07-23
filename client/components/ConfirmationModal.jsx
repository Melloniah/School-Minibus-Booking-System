'use client';

import { useState } from 'react';

export default function ConfirmationModal({ isOpen, onClose, bookingDetails, onConfirmed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !bookingDetails) return null;

  const {
    seats,
    date,
    pickup,
    dropoff,
    returnPickup,
    returnDropoff,
    price,
    routeName,
    busName,
  } = bookingDetails;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to complete booking.');
      }

      onClose();
      if (onConfirmed) onConfirmed();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Confirm Booking</h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <p><strong>Route:</strong> {routeName}</p>
          <p><strong>Bus:</strong> {busName}</p>
          <p><strong>Seats:</strong> {seats}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>From:</strong> {pickup}</p>
          <p><strong>To:</strong> {dropoff}</p>
          {returnPickup && <p><strong>Return From:</strong> {returnPickup}</p>}
          {returnDropoff && <p><strong>Return To:</strong> {returnDropoff}</p>}
          <p><strong>Total Price:</strong> KES {price}</p>
        </div>

        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Submitting...' : 'Confirm'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
           <button
            onClick={() => {
              router.push('/mybookings');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
