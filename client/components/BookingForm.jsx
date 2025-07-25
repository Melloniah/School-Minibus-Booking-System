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
  axios.get(`${API_BASE}/pickup_dropoff?route_id=${routeId}`, {
    withCredentials: true,
  });


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

  const [isReturn, setIsReturn] = useState(false);
  const [returnPickup, setReturnPickup] = useState('');
  const [returnDropoff, setReturnDropoff] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Load routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getRoutes();
        setRoutes(res.data);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
      }
    };

    fetchRoutes();
  }, []);

  // Load buses and stops when route changes
  useEffect(() => {
    if (selectedRoute) {
      getStopsByRoute(selectedRoute.id)
    .then(res => {
     setStops(res.data);
      })
    .catch(err => {
    console.error('Failed to fetch stops:', err);
    setStops([]);
  });

      getBusesByRoute(selectedRoute.id)
        .then(res => setBuses(res.data))
        .catch(err => console.error('Failed to fetch buses:', err));

      // Reset dependent fields
      setPickup('');
      setDropoff('');
      setBus('');
      setReturnPickup('');
      setReturnDropoff('');
    } else {
      setStops([]);
      setBuses([]);
    }
  }, [selectedRoute]);

  const handleRouteChange = (e) => {
    const routeId = parseInt(e.target.value);
    const route = routes.find(r => r.id === routeId);
    setSelectedRoute(route || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRoute || !bus || !pickup || !dropoff || !date || !seats) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (pickup === dropoff) {
      toast.error('Pick-up and drop-off cannot be the same.');
      return;
    }

    if (isReturn) {
      if (!returnPickup || !returnDropoff) {
        toast.error('Please fill in return trip stops.');
        return;
      }
      if (returnPickup === returnDropoff) {
        toast.error('Return pick-up and drop-off cannot be the same.');
        return;
      }
    }

    if (loading) return;
    if (!currentUser) {
      toast.error('Please log in to make a booking.');
      return;
    }

    try {
      setLoadingPrice(true);

      const bookingPayload = {
        user_id: currentUser.id,
        bus_id: bus,
        pickup_location: pickup,
        dropoff_location: dropoff,
        seats_booked: seats,
        booking_date: date,
        price: 0, // Backend-calculated
      };

      const res = await createBooking(bookingPayload);

      if (res.status === 201) {
        const booking = res.data;
        setBookingDetails({
          ...bookingPayload,
          routeName: selectedRoute.name,
          busName: buses.find(b => b.id === parseInt(bus))?.name || '',
          price: booking.price,
        });
        setIsModalOpen(true);
      } else {
        toast.error(res.data?.error || 'Booking failed.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Error submitting booking.');
    } finally {
      setLoadingPrice(false);
    }
  };

  const resetForm = () => {
    setSelectedRoute(null);
    setBuses([]);
    setStops([]);
    setPickup('');
    setDropoff('');
    setBus('');
    setDate('');
    setSeats(1);
    setIsReturn(false);
    setReturnPickup('');
    setReturnDropoff('');
    setBookingDetails(null);
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
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
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
               <option key={stop.id} value={stop.name_location}>
                {stop.name_location}
               </option>
               ))}

            
          </select>
        </div>

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
            {stops.map((stop, i) => (
              <option key={i} value={stop}>{stop}</option>
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
              <option key={b.id} value={b.id}>{b.name}</option>
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
            max={10}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Return trip checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="returnTrip"
            checked={isReturn}
            onChange={(e) => setIsReturn(e.target.checked)}
          />
          <label htmlFor="returnTrip">Book return trip</label>
        </div>

        {/* Return pick-up */}
        {isReturn && (
          <div>
            <label className="block mb-1 font-medium">Return Pick-up</label>
            <select
              value={returnPickup}
              onChange={(e) => setReturnPickup(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-gray-800"
              required
            >
              <option value="">-- Select Return Pick-up --</option>
              {stops.map((stop, i) => (
                <option key={i} value={stop}>{stop}</option>
              ))}
            </select>
          </div>
        )}

        {/* Return drop-off */}
        {isReturn && (
          <div>
            <label className="block mb-1 font-medium">Return Drop-off</label>
            <select
              value={returnDropoff}
              onChange={(e) => setReturnDropoff(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-gray-800"
              required
            >
              <option value="">-- Select Return Drop-off --</option>
              {stops.map((stop, i) => (
                <option key={i} value={stop}>{stop}</option>
              ))}
            </select>
          </div>
        )}

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
