import React, { useState } from 'react';
import axios from 'axios'; // Assuming axios is used for API calls

// ─────────────────────────────────────────────
// ❗ Custom Confirmation Modal Component (Moved here for BookingsTable)
function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Action</h3>
        <p className="text-gray-700 mb-6 text-center">{message}</p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// BookingsTable component to display a list of bookings
function BookingsTable({ bookings, onDeleteBooking, API_BASE }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      onDeleteBooking(bookingToDelete.id);
    }
    setShowConfirm(false);
    setBookingToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setBookingToDelete(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto"> {/* Enable horizontal scrolling for small screens */}
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200">User ID</th>
                <th className="px-4 py-3 border-b border-gray-200">Bus ID</th>
                <th className="px-4 py-3 border-b border-gray-200">Pickup</th>
                <th className="px-4 py-3 border-b border-gray-200">Dropoff</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Seats</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">Price</th>
                <th className="px-4 py-3 border-b border-gray-200">Date</th>
                <th className="px-4 py-3 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3">{b.user_id}</td>
                  <td className="px-4 py-3">{b.bus_id}</td>
                  <td className="px-4 py-3">{b.pickup_location}</td>
                  <td className="px-4 py-3">{b.dropoff_location}</td>
                  <td className="px-4 py-3 text-center">{b.seats_booked}</td>
                  <td className="px-4 py-3 text-right">KES {b.price}</td>
                  <td className="px-4 py-3">{b.booking_date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteClick(b)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showConfirm && (
        <ConfirmationModal
          message={`Are you sure you want to delete this booking for ${bookingToDelete?.seats_booked} seats on ${bookingToDelete?.booking_date}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default BookingsTable;
