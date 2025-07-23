'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function RouteBookingForm({ allRoutes }) {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');

  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    if (selectedRouteId) {
      const route = allRoutes.find((r) => r.id === parseInt(selectedRouteId));
      setSelectedRoute(route);
      setStops(route?.stops || []);
      setBuses(route?.buses || []);
      setPickup('');
      setDropoff('');
      setSelectedBusId('');
    }
  }, [selectedRouteId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedRouteId || !pickup || !dropoff || !selectedBusId) {
      toast.error('Please select a route, pickup, dropoff, and bus.');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id, // server should re-validate
          pickup_location: pickup,
          dropoff_location: dropoff,
          bus_id: selectedBusId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Booking confirmed!');
        router.push('/my-bookings'); // Make sure this page exists
      } else {
        toast.error(data?.message || 'Booking failed');
      }
    } catch (err) {
      toast.error('Error connecting to server');
    }
  };

  return (
    <form onSubmit={handleBooking} className="bg-white shadow-md rounded p-4 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Book Your Child a Bus</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Route</label>
        <select
          className="w-full border rounded p-2"
          value={selectedRouteId}
          onChange={(e) => setSelectedRouteId(e.target.value)}
        >
          <option value="">Choose a route</option>
          {allRoutes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name || `Route #${route.id}`}
            </option>
          ))}
        </select>
      </div>

      {selectedRoute && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pickup Point</label>
            <select
              className="w-full border rounded p-2"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            >
              <option value="">Select pickup</option>
              {stops.map((stop) => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Dropoff Point</label>
            <select
              className="w-full border rounded p-2"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            >
              <option value="">Select dropoff</option>
              {stops.map((stop) => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Choose a Bus</label>
            <select
              className="w-full border rounded p-2"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
            >
              <option value="">Choose a bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.name || `Bus #${bus.id}`}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </form>
  );
}
