'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// API utilities
import { API_BASE } from '../lib/api';

const getBusesByRoute = (routeId) =>
  axios.get(`${API_BASE}/buses?route_id=${routeId}`, { withCredentials: true });

const getStopsByRoute = (routeId) =>
  axios.get(`${API_BASE}/location/by-route?route_id=${routeId}`, { withCredentials: true });

const createBooking = (data) =>
  axios.post(`${API_BASE}/bookings/`, data, {
    withCredentials: true,
    validateStatus: () => true,
  });

const estimatePriceAPI = (data) =>
  axios.post(`${API_BASE}/bookings/estimate-price`, data, {
    withCredentials: true,
  });

export default function RouteBookingForm({ selectedRoute }) {
  const { user } = useAuth();
  const router = useRouter();
  
  // Form states
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);
  const [selectedBusId, setSelectedBusId] = useState('');
  
  // Data states
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Price and booking states
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch buses and stops when selectedRoute changes
  useEffect(() => {
    if (selectedRoute && selectedRoute.id) {
      fetchRouteData(selectedRoute.id);
      // Reset form when route changes
      resetForm();
    } else {
      // Clear data when no route selected
      setBuses([]);
      setStops([]);
      resetForm();
    }
  }, [selectedRoute]);

  // Auto-calculate price when pickup, dropoff, or seats change
  useEffect(() => {
    if (pickup && dropoff && seats) {
      calculatePrice();
    } else {
      setCalculatedPrice(null);
    }
  }, [pickup, dropoff, seats]);

  const fetchRouteData = async (routeId) => {
    try {
      setLoadingData(true);
      
      // Fetch both buses and stops for the selected route
      const [busesResponse, stopsResponse] = await Promise.all([
        getBusesByRoute(routeId),
        getStopsByRoute(routeId)
      ]);

      if (busesResponse.status === 200) {
        setBuses(busesResponse.data);
      } else {
        setBuses([]);
        toast.error('Failed to load buses for this route');
      }

      if (stopsResponse.status === 200) {
        setStops(stopsResponse.data);
      } else {
        setStops([]);
        toast.error('Failed to load stops for this route');
      }

    } catch (err) {
      console.error('Failed to fetch route data:', err);
      setBuses([]);
      setStops([]);
      toast.error('Error loading route information');
    } finally {
      setLoadingData(false);
    }
  };

  const calculatePrice = async () => {
    if (!pickup || !dropoff || !seats) {
      setCalculatedPrice(null);
      return;
    }

    try {
      setCalculatingPrice(true);
      const pricePayload = {
        pickup_location: pickup,
        dropoff_location: dropoff,
        seats_booked: seats,
      };

      const priceResponse = await estimatePriceAPI(pricePayload);

      if (priceResponse.status === 200) {
        setCalculatedPrice(priceResponse.data.estimated_price);
      } else {
        setCalculatedPrice(null);
      }
    } catch (err) {
      console.error('Price calculation error:', err);
      setCalculatedPrice(null);
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handleReverseTrip = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
    setCalculatedPrice(null);
  };

  const resetForm = () => {
    setPickup('');
    setDropoff('');
    setDate('');
    setSeats(1);
    setSelectedBusId('');
    setCalculatedPrice(null);
    setBookingSuccess(false);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedRoute || !pickup || !dropoff || !selectedBusId || !date || !seats) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (pickup === dropoff) {
      toast.error('Pick-up and drop-off cannot be the same.');
      return;
    }

    if (!user) {
      toast.error('Please log in to make a booking.');
      return;
    }

    try {
      setLoadingBooking(true);

      const bookingPayload = {
        user_email: user.email,
        bus_id: parseInt(selectedBusId),
        pickup_location: pickup,
        dropoff_location: dropoff,
        seats_booked: seats,
        booking_date: date,
        price: 0, // Let backend calculate
      };

      const response = await createBooking(bookingPayload);

      if (response.status === 201) {
        setBookingSuccess(true);
        toast.success('Booking created successfully!');
      } else {
        toast.error(response.data?.error || 'Booking failed.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      if (err.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check your connection.');
      } else if (err.response) {
        toast.error(err.response.data?.error || 'Server error occurred.');
      } else {
        toast.error('Error submitting booking.');
      }
    } finally {
      setLoadingBooking(false);
    }
  };

  // Don't render form if no route selected
  if (!selectedRoute) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Book Your Trip</h2>
        <p className="text-gray-500 text-center py-8">
          Select a route to start booking
        </p>
      </div>
    );
  }

  // Show success state
  if (bookingSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="p-4 bg-green-50 border border-green-200 rounded mb-4">
          <h3 className="text-green-800 font-bold mb-2">Booking Successful! ✅</h3>
          <p className="text-green-700 mb-3">Your booking has been confirmed.</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push('/mybookings')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View My Bookings
            </button>
            <button
              onClick={resetForm}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Book Another Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Book Your Trip</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Please log in to make a booking</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBooking} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Book Your Trip</h2>

      {/* Selected Route Display */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded mb-4">
        <p className="text-blue-700 dark:text-blue-300 font-medium text-sm">
          Route: {selectedRoute.route_name}
        </p>
      </div>

      {loadingData ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading route information...</p>
        </div>
      ) : (
        <>
          {/* Pickup Point */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Pickup Point
            </label>
            <select
              className="w-full border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-700"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
            >
              <option value="">Select pickup location</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.name_location}>
                  {stop.name_location}
                </option>
              ))}
            </select>
          </div>

          {/* Reverse Button */}
          <button
            type="button"
            onClick={handleReverseTrip}
            className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300 mb-4"
            disabled={!pickup || !dropoff}
          >
            ⇅ Reverse Trip Direction
          </button>

          {/* Dropoff Point */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Dropoff Point
            </label>
            <select
              className="w-full border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-700"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              required
            >
              <option value="">Select dropoff location</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.name_location}>
                  {stop.name_location}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Travel Date
            </label>
            <input
              type="date"
              className="w-full border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Number of Seats */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Number of Seats
            </label>
            <input
              type="number"
              className="w-full border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-700"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
              min={1}
              required
            />
          </div>

          {/* Choose a Bus */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Choose a Bus
            </label>
            <select
              className="w-full border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-700"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              required
            >
              <option value="">Choose a bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.numberplate} ({bus.capacity - (bus.current_bookings || 0)} seats available)
                </option>
              ))}
            </select>
          </div>

          {/* Price Display */}
          {calculatingPrice && pickup && dropoff && seats && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded mb-4">
              <p className="text-yellow-700 text-center text-sm">Calculating price...</p>
            </div>
          )}

          {calculatedPrice && !calculatingPrice && (
            <div className="p-3 bg-green-50 border border-green-200 rounded mb-4">
              <p className="text-green-700 font-bold text-center">
                Estimated Price: KES {calculatedPrice}
              </p>
            </div>
          )}

          {!calculatedPrice && !calculatingPrice && pickup && dropoff && seats && (
            <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
              <p className="text-red-700 text-center text-sm">
                Unable to calculate price. Please check your selections.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
            disabled={loadingBooking || buses.length === 0}
          >
            {loadingBooking ? 'Processing...' : 'Confirm Booking'}
          </button>

          {buses.length === 0 && !loadingData && (
            <p className="text-amber-600 text-sm text-center mt-2">
              No buses available for this route at the moment.
            </p>
          )}
        </>
      )}
    </form>
  );
}