'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function RouteBookingForm({ selectedRoute }) {
  const { user } = useAuth();
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');

  const [stops, setStops] = useState([]);

  useEffect(() => {
    if (selectedRoute) {
      setStops(selectedRoute.stops);
      setBuses(selectedRoute.buses || []);
    }
  }, [selectedRoute]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!pickup || !dropoff || !selectedBusId) {
      toast.error('Please select pickup, dropoff, and bus.');
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
        router.push('/my-bookings');// needs to be created
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

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </form>
  );
}
