'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// API utilities
import { API_BASE } from '../lib/api';


const getMyBookings = () =>
  axios.get(`${API_BASE}/bookings/`, { withCredentials: true });

const cancelBooking = (bookingId) =>
  axios.delete(`${API_BASE}/bookings/${bookingId}`, { withCredentials: true });

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Filter bookings when search terms or bookings change
  useEffect(() => {
    filterBookings();
  }, [searchTerm, searchDate, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      
      if (response.status === 200) {
        setBookings(response.data);
        // toast.success('Bookings loaded successfully');
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Error loading bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (!bookings.length) {
      setFilteredBookings([]);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = bookings.filter((booking) => {
      const routeMatch = booking.route_name?.toLowerCase().includes(lowerSearchTerm) ||
                         booking.pickup_location?.toLowerCase().includes(lowerSearchTerm) ||
                         booking.dropoff_location?.toLowerCase().includes(lowerSearchTerm);
      
      const dateMatch = searchDate ? booking.booking_date === searchDate : true;
      
      return routeMatch && dateMatch;
    });

    setFilteredBookings(filtered);
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);
      const response = await cancelBooking(selectedBooking.id);
      
      if (response.status === 200 || response.status === 204) {
        // Remove the cancelled booking from state
        setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
        toast.success('Booking cancelled successfully');
        setShowModal(false);
        setSelectedBooking(null);
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Error cancelling booking');
    } finally {
      setCancelling(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <p>Loading your bookings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {/* Search Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by route, pickup, or drop-off location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2 text-black bg-white dark:text-white dark:bg-gray-800"
            autoComplete="on"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2 text-black bg-white dark:text-white dark:bg-gray-800"
          />
        </div>

        {/* Clear Filters */}
        {(searchTerm || searchDate) && (
          <div className="mb-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchDate('');
              }}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Booking List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
              <button
                onClick={() => window.location.href = '/book-seat'}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Make Your First Booking
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings match your search criteria.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <p><strong>Booking ID:</strong> #{booking.id}</p>
                      <p><strong>Date:</strong> {booking.booking_date || 'N/A'}</p>
                      <p><strong>Pickup:</strong> {booking.pickup_location || 'N/A'}</p>
                      <p><strong>Drop-off:</strong> {booking.dropoff_location || 'N/A'}</p>
                      <p><strong>Seats:</strong> {booking.seats_booked || 'N/A'}</p>
                      <p><strong>Price:</strong> KES {booking.price || 'N/A'}</p>
                    </div>
                    
                    {/* Show bus info if available */}
                    {booking.bus_numberplate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Bus:</strong> {booking.bus_numberplate}
                      </p>
                    )}
                    
                    {/* Show booking status if available */}
                    {booking.status && (
                      <p className="text-sm">
                        <strong>Status:</strong> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => handleCancel(booking)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      disabled={booking.status === 'cancelled'}
                    >
                      {booking.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show total bookings count */}
        {bookings.length > 0 && (
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            <p>
              Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
              <p className="mb-4">
                Are you sure you want to cancel this booking?
              </p>
              
              {selectedBooking && (
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4 text-sm">
                  <p><strong>Booking ID:</strong> #{selectedBooking.id}</p>
                  <p><strong>Route:</strong> {selectedBooking.pickup_location} → {selectedBooking.dropoff_location}</p>
                  <p><strong>Date:</strong> {selectedBooking.booking_date}</p>
                  <p><strong>Price:</strong> KES {selectedBooking.price}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
                </button>
                <button
                  onClick={closeModal}
                  disabled={cancelling}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}