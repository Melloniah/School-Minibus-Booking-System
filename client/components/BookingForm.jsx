'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import { toast } from 'react-hot-toast';

// API utilities
const API_BASE = 'http://localhost:5000';

const getRoutes = () =>
  axios.get(`${API_BASE}/routes/`, { withCredentials: true });

const getBusesByRoute = (routeId) =>
  axios.get(`${API_BASE}/buses?route_id=${routeId}`, { withCredentials: true });

const getStopsByRoute = (routeId) =>
  axios.get(`${API_BASE}/location/by-route?route_id=${routeId}`, { withCredentials: true});


const createBooking = (data) =>
  axios.post(`${API_BASE}/bookings`, data, {
    withCredentials: true,
    validateStatus: () => true,
  });

export default function BookingForm() {
  const { user: currentUser, loading } = useAuth();

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [bus, setBus] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch available routes on mount
useEffect(() => {
  if (!loading && currentUser) {
    getRoutes()
      .then(res => setRoutes(res.data))
      .catch(err => console.error('Failed to fetch routes:', err));
  } else if (!loading && !currentUser) {
    setRoutes([]);  // Clear routes or show message: please log in
  }
}, [loading, currentUser]);


  // Fetch buses & stops when a route is selected
 // Updated useEffect for fetching stops and buses
useEffect(() => {
  if (selectedRoute && selectedRoute.id) {
    console.log('Fetching stops for route:', selectedRoute.id); // Debug log
    
    getStopsByRoute(selectedRoute.id)
      .then(res => {
        console.log('Stops received:', res.data); // Debug log
        setStops(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch stops:', err);
        setStops([]);
        // Optional: show user-friendly error
        toast.error('Failed to load stops for this route');
      });

    getBusesByRoute(selectedRoute.id)
      .then(res => {
        console.log('Buses received:', res.data); // Debug log
        setBuses(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch buses:', err);
        setBuses([]);
        toast.error('Failed to load buses for this route');
      });

    // Reset selections when route changes
    setPickup('');
    setDropoff('');
    setBus('');
  } else {
    // Clear stops and buses when no route is selected
    setStops([]);
    setBuses([]);
    setPickup('');
    setDropoff('');
    setBus('');
  }
}, [selectedRoute]);

  const handleRouteChange = (e) => {
    const routeId = parseInt(e.target.value);
    const route = routes.find(r => r.id === routeId);
    setSelectedRoute(route || null);
  };

  const handleReverseTrip = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  // Update your handleSubmit function with more debugging:

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('🔍 Starting booking submission...');
  console.log('🔍 Current user:', currentUser);
  console.log('🔍 Selected route:', selectedRoute);
  console.log('🔍 Selected bus:', bus);
  console.log('🔍 Pickup:', pickup);
  console.log('🔍 Dropoff:', dropoff);

  if (!selectedRoute || !bus || !pickup || !dropoff || !date || !seats) {
    toast.error('Please fill in all required fields.');
    return;
  }

  if (pickup === dropoff) {
    toast.error('Pick-up and drop-off cannot be the same.');
    return;
  }

  if (!currentUser) {
    toast.error('Please log in to make a booking.');
    return;
  }

  try {
    setLoadingPrice(true);

    const bookingPayload = {
      user_id: currentUser.id,
      bus_id: parseInt(bus), 
      pickup_location: pickup,
      dropoff_location: dropoff,
      seats_booked: seats,
      booking_date: date,
      price: 0, // Let backend calculate
    };

    console.log('🔍 Booking payload:', bookingPayload);
    console.log('🔍 API URL:', `${API_BASE}/bookings`);

    // Test if the server is reachable
    console.log('🔍 Testing server connection...');
    await axios.get(`${API_BASE}/routes/`, { withCredentials: true });
    console.log('✅ Server is reachable');

    console.log('🔍 Submitting booking...');
    const res = await createBooking(bookingPayload);

    console.log('✅ Booking response:', res);

    if (res.status === 201) {
      const booking = res.data;

      setBookingDetails({
        ...bookingPayload,
        routeName: selectedRoute.route_name,
        busName: buses.find(b => b.id === parseInt(bus))?.numberplate || '',
        price: booking.price,
      });
      setIsModalOpen(true);
    } else {
      console.error('❌ Booking failed with status:', res.status);
      toast.error(res.data?.error || 'Booking failed.');
    }
  } catch (err) {
    console.error('❌ Full error object:', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error code:', err.code);
    console.error('❌ Request config:', err.config);
    console.error('❌ Response:', err.response);
    
    // Check if it's a network error vs server error
    if (err.code === 'ERR_NETWORK') {
      console.error('🚨 Network Error - Server might be down or endpoint unreachable');
      toast.error('Cannot connect to server. Please check your connection.');
    } else if (err.response) {
      console.error('🚨 Server Error:', err.response.status, err.response.data);
      toast.error(err.response.data?.error || 'Server error occurred.');
    } else {
      console.error('🚨 Unknown Error');
      toast.error('Error submitting booking.');
    }
  } finally {
    setLoadingPrice(false);
  }
};


  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
        {/* Route */}
        <div>
          <label className="block mb-1 font-medium">Route</label>
          <select
            value={selectedRoute?.id || ''}
            onChange={handleRouteChange}
            className="w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-gray-800"
            required
          >
            <option value="">-- Select Route --</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.route_name}</option>
            ))}
          </select>
        </div>

        {/* Pick-up */}
        <div>
          <label className="block mb-1 font-medium">Pick-up</label>
          <select
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-gray-800"
            required
            disabled={!selectedRoute}
          >
            <option value="">-- Select Pick-up --</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.name_location}>{stop.name_location}</option>
            ))}
          </select>
        </div>

        {/* Reverse Button */}
        <button
          type="button"
          onClick={handleReverseTrip}
          className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
        >
          Reverse Trip Direction
        </button>

        {/* Drop-off */}
        <div>
          <label className="block mb-1 font-medium">Drop-off</label>
          <select
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-gray-800"
            required
            disabled={!selectedRoute}
          >
            <option value="">-- Select Drop-off --</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.name_location}>{stop.name_location}</option>
            ))}
          </select>
        </div>

        {/* Bus */}
        <div>
          <label className="block mb-1 font-medium">Bus</label>
          <select
            value={bus}
            onChange={(e) => setBus(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-gray-800"
            required
            disabled={!selectedRoute}
          >
            <option value="">-- Select Bus --</option>
            {buses.map((b) => (
              <option key={b.id} value={b.id}>{b.numberplate}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedRoute}
          />
        </div>

        {/* Seats */}
        <div>
          <label className="block mb-1 font-medium">Seats</label>
          <input
            type="number"
            min={1}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loadingPrice}
        >
          {loadingPrice ? 'Processing...' : 'Book Now'}
        </button>
      </form>

      {/* Confirmation Modal */}
      {isModalOpen && bookingDetails && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bookingDetails={bookingDetails}
          onReset={resetForm}
        />
      )}
    </>
  );
}
