'use client';

import { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useRouter } from 'next/navigation';

export default function BookingForm({ onRouteSelect }) {

   const router = useRouter();
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [bus, setBus] = useState('');

  const [isReturn, setIsReturn] = useState(false);
  const [returnPickup, setReturnPickup] = useState('');
  const [returnDropoff, setReturnDropoff] = useState('');

  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch routes on mount
  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error('Failed to fetch routes', err));
  }, []);

  // Fetch buses and stops when route changes
  useEffect(() => {
    if (selectedRoute) {
      setStops(selectedRoute.stops);
      fetch(`/api/buses?route_id=${selectedRoute.id}`)
        .then(res => res.json())
        .then(data => setBuses(data))
        .catch(err => console.error('Failed to fetch buses', err));
    } else {
      setStops([]);
      setBuses([]);
    }
    // Reset stops & buses related inputs on route change
    setPickup('');
    setDropoff('');
    setBus('');
    setReturnPickup('');
    setReturnDropoff('');
  }, [selectedRoute]);

  // Handle route select and notify parent if needed
  const handleRouteChange = (e) => {
    const route = routes.find(r => r.id === parseInt(e.target.value));
    setSelectedRoute(route || null);
    if (onRouteSelect) onRouteSelect(route || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedRoute || !bus || !pickup || !dropoff || !date || !seats) {
      alert('Please fill in all required fields.');
      return;
    }
    if (pickup === dropoff) {
      alert('Pick-up and drop-off stops cannot be the same.');
      return;
    }
    if (isReturn) {
      if (!returnPickup || !returnDropoff) {
        alert('Please fill in return trip stops.');
        return;
      }
      if (returnPickup === returnDropoff) {
        alert('Return pick-up and drop-off cannot be the same.');
        return;
      }
    }

    // Prepare price fetch payload
    const priceRequestData = {
      routeId: selectedRoute.id,
      busId: bus,
      seats,
      pickup,
      dropoff,
      isReturn,
      returnPickup,
      returnDropoff,
      date,
    };

    try {
      setLoadingPrice(true);
      const priceResponse = await fetch('/api/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceRequestData),
      });

      if (!priceResponse.ok) {
        throw new Error('Failed to fetch price.');
      }

      const priceData = await priceResponse.json();

      // Show confirmation modal with details + price
      setBookingDetails({
        ...priceRequestData,
        routeName: selectedRoute.name,
        busName: buses.find(b => b.id === bus)?.name || '',
        price: priceData.price,
      });

      setIsModalOpen(true);
    } catch (err) {
      alert(err.message);
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
    setIsReturn(false);
    setReturnPickup('');
    setReturnDropoff('');
    setSeats(1);
    setDate('');
    setBookingDetails(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">

        {/* Route Selector */}
        <div>
          <label className="block font-medium mb-1">Select Route</label>
          <select
            value={selectedRoute?.id || ''}
            onChange={handleRouteChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Route --</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
        </div>

        {/* Pick-up Stop */}
        <div>
          <label className="block font-medium mb-1">Pick-up Stop</label>
          <select
            value={pickup}
            onChange={e => setPickup(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedRoute}
          >
            <option value="">{selectedRoute ? '-- Select Pick-up --' : 'Select a route first'}</option>
            {stops.map((stop, i) => (
              <option key={i} value={stop}>{stop}</option>
            ))}
          </select>
        </div>

        {/* Drop-off Stop */}
        <div>
          <label className="block font-medium mb-1">Drop-off Stop</label>
          <select
            value={dropoff}
            onChange={e => setDropoff(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedRoute}
          >
            <option value="">{selectedRoute ? '-- Select Drop-off --' : 'Select a route first'}</option>
            {stops.map((stop, i) => (
              <option key={i} value={stop}>{stop}</option>
            ))}
          </select>
        </div>

        {/* Bus Select */}
        <div>
          <label className="block font-medium mb-1">Select Bus</label>
          <select
            value={bus}
            onChange={e => setBus(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedRoute}
          >
            <option value="">-- Select Bus --</option>
            {buses.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium mb-1">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedRoute}
          />
        </div>

        {/* Seats */}
        <div>
          <label className="block font-medium mb-1">Number of Seats</label>
          <input
            type="number"
            min={1}
            max={10}
            value={seats}
            onChange={e => setSeats(parseInt(e.target.value) || 1)}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedRoute}
          />
        </div>

        {/* Return Trip Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="returnTrip"
            checked={isReturn}
            onChange={e => setIsReturn(e.target.checked)}
            disabled={!selectedRoute}
          />
          <label htmlFor="returnTrip">Book return trip</label>
        </div>

        {/* Return Pick-up Stop */}
        <div>
          <label className="block font-medium mb-1">Return Pick-up Stop</label>
          <select
            value={returnPickup}
            onChange={e => setReturnPickup(e.target.value)}
            className="w-full p-2 border rounded"
            required={isReturn}
            disabled={!selectedRoute || !isReturn}
          >
            <option value="">{isReturn ? '-- Select Return Pick-up --' : 'Select return trip'}</option>
            {stops.map((stop, i) => (
              <option key={i} value={stop}>{stop}</option>
            ))}
          </select>
        </div>

        {/* Return Drop-off Stop */}
        <div>
          <label className="block font-medium mb-1">Return Drop-off Stop</label>
          <select
            value={returnDropoff}
            onChange={e => setReturnDropoff(e.target.value)}
            className="w-full p-2 border rounded"
            required={isReturn}
            disabled={!selectedRoute || !isReturn}
          >
            <option value="">{isReturn ? '-- Select Return Drop-off --' : 'Select return trip'}</option>
            {stops.map((stop, i) => (
              <option key={i} value={stop}>{stop}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loadingPrice || !selectedRoute}
          className={`w-full py-2 rounded text-white ${loadingPrice ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loadingPrice ? 'Calculating Price...' : 'Book Seat'}
        </button>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingDetails={bookingDetails}
        onConfirmed={() => {
          resetForm();
          setIsModalOpen(false);
          toast.success("Booking confirmed!");
        }}
      />
    </>
  );
}
