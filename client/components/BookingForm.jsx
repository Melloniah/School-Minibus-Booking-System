'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


// API utilities
const API_BASE = 'http://localhost:5000';

const getRoutes = () =>
  axios.get(`${API_BASE}/routes/`, { withCredentials: true });

const getBusesByRoute = (routeId) =>
  axios.get(`${API_BASE}/buses?route_id=${routeId}`, { withCredentials: true });

const getStopsByRoute = (routeId) =>
  axios.get(`${API_BASE}/location/by-route?route_id=${routeId}`, { withCredentials: true});

const createBooking = (data) =>
  axios.post(`${API_BASE}/bookings/`, data, {
    withCredentials: true,
    validateStatus: () => true,
  });

const estimatePriceAPI = (data) =>
  axios.post(`${API_BASE}/bookings/estimate-price`, data, {
    withCredentials: true,
  });

export default function BookingForm({ onRouteSelect }) {
  const { user: currentUser, loading } = useAuth();
  const router = useRouter();

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [bus, setBus] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch available routes on mount
  useEffect(() => {
    if (!loading && currentUser) {
      getRoutes()
        .then(res => setRoutes(res.data))
        .catch(err => console.error('Failed to fetch routes:', err));
    } else if (!loading && !currentUser) {
      setRoutes([]);
    }
  }, [loading, currentUser]);

  // Fetch buses & stops when a route is selected
  useEffect(() => {
    if (selectedRoute && selectedRoute.id) {
      console.log('Fetching stops for route:', selectedRoute.id);
      
      getStopsByRoute(selectedRoute.id)
        .then(res => {
          console.log('Stops received:', res.data);
          setStops(res.data);
        })
        .catch(err => {
          console.error('Failed to fetch stops:', err);
          setStops([]);
          toast.error('Failed to load stops for this route');
        });

      getBusesByRoute(selectedRoute.id)
        .then(res => {
          console.log('Buses received:', res.data);
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
      setCalculatedPrice(null);
    } else {
      setStops([]);
      setBuses([]);
      setPickup('');
      setDropoff('');
      setBus('');
      setCalculatedPrice(null);
    }
  }, [selectedRoute]);

  const handleRouteChange = (e) => {
    const routeId = parseInt(e.target.value);
    const route = routes.find(r => r.id === routeId);
    setSelectedRoute(route || null);
    
    // Notify booking page component about route selection
    if (onRouteSelect) {
      onRouteSelect(route || null);
    }
  };

  const handleReverseTrip = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
    setCalculatedPrice(null); // Reset price after reverse
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
        toast.success(`Price: KES ${priceResponse.data.estimated_price} (${priceResponse.data.distance} km)`);
      } else {
        toast.error('Failed to calculate price');
        setCalculatedPrice(null);
      }
    } catch (err) {
      console.error('Price calculation error:', err);
      toast.error('Failed to calculate price. Please try again.');
    } finally {
      setCalculatingPrice(false);
    }
  };

   // Auto-calculate price when pickup, dropoff, or seats change
   useEffect(() => {
   if (pickup && dropoff && seats) {
    calculatePrice();
  } else {
    setCalculatedPrice(null);
  }
  }, [pickup, dropoff, seats]);

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

    if (!currentUser) {
      toast.error('Please log in to make a booking.');
      return;
    }

    try {
      setLoadingBooking(true);

      const bookingPayload = {
        user_email: currentUser.email,
        bus_id: parseInt(bus),
        pickup_location: pickup,
        dropoff_location: dropoff,
        seats_booked: seats,
        booking_date: date,
        price: 0, // Let backend calculate
      };

      console.log('🔍 Submitting booking...');
      const res = await createBooking(bookingPayload);

      if (res.status === 201) {
        
        setBookingSuccess(true);
        toast.success('Booking created successfully!');
      } else {
        toast.error(res.data?.error || 'Booking failed.');
      }
    } catch (err) {
      console.error('❌ Booking error:', err);
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

  const resetForm = () => {
    setSelectedRoute(null);
    setPickup('');
    setDropoff('');
    setBus('');
    setDate('');
    setSeats(1);
    setBuses([]);
    setStops([]);
    setCalculatedPrice(null);
    setBookingSuccess(false);
    
    // Notify parent component about route reset
    if (onRouteSelect) {
      onRouteSelect(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-4 max-w-md mx-auto">
        {/* Success Message */}
        {bookingSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded mb-4">
            <h3 className="text-green-800 font-bold mb-2">Booking Successful! ✅</h3>
            <p className="text-green-700 mb-3">Your booking has been confirmed and saved.</p>
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
        )}

        {/* Booking Form */}
        {!bookingSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={!pickup || !dropoff}
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

            {/* Price Display - Show automatically */}
{calculatingPrice && pickup && dropoff && seats && (
  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
    <p className="text-yellow-700 text-center">
      Calculating price...
    </p>
  </div>
)}

{calculatedPrice && !calculatingPrice && (
  <div className="p-3 bg-green-50 border border-green-200 rounded">
    <p className="text-green-700 font-bold text-center">
      Estimated Price: KES {calculatedPrice}
    </p>
  </div>
)}

{/* Show error if price calculation failed */}
{!calculatedPrice && !calculatingPrice && pickup && dropoff && seats && (
  <div className="p-3 bg-red-50 border border-red-200 rounded">
    <p className="text-red-700 text-center">
      Unable to calculate price. Please check your selections.
    </p>
  </div>
)}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loadingBooking}
            >
              {loadingBooking ? 'Processing...' : 'Book Minibus Now'}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}