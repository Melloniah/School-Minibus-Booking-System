'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, searchDate, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  const filterBookings = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = bookings.filter((b) => {
      const matchesRoute = b.route_name?.toLowerCase().includes(lowerSearchTerm);
      const matchesDate = searchDate ? b.date === searchDate : true;
      return matchesRoute && matchesDate;
    });

    setFilteredBookings(filtered);
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
      setShowModal(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error(err.message);
      alert('Error cancelling booking');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by route name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p><strong>Route:</strong> {booking.route_name}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Pickup:</strong> {booking.pickup}</p>
                <p><strong>Drop-off:</strong> {booking.dropoff}</p>
                <p><strong>Seats:</strong> {booking.seats}</p>
                <p><strong>Price:</strong> KES {booking.price}</p>
              </div>
              <button
                onClick={() => handleCancel(booking)}
                className="mt-4 md:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cancel Modal */}
      {showModal && (
        <ConfirmationModal
          title="Cancel Booking"
          message={`Are you sure you want to cancel the booking for route "${selectedBooking?.route_name}" on ${selectedBooking?.date}?`}
          onCancel={() => setShowModal(false)}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
}
