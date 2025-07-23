'use client';
import { useState, useEffect } from 'react';

export default function ItineraryDashboard() {
  const [authorized, setAuthorized] = useState(true); // Simulated auth
  const [busData, setBusData] = useState({ plate: '', capacity: '' });
  const [routeData, setRouteData] = useState({ from: '', to: '', time: '' });

  useEffect(() => {
    // Simulate auth check or fetching user role
    setTimeout(() => {
      setAuthorized(true);
    }, 500);
  }, []);

  const handleBusSubmit = (e) => {
    e.preventDefault();
    console.log('New Bus:', busData);
    // TODO: Post to backend
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    console.log('New Route:', routeData);
    // TODO: Post to backend
  };

  if (!authorized) {
    return <p className="p-4">Checking access...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Welcome, Itinerary Operator</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bookings" value="128" color="bg-green-500" />
        <StatCard title="Active Routes" value="7" color="bg-blue-500" />
        <StatCard title="Registered Parents" value="34" color="bg-yellow-500" />
        <StatCard title="Available Seats" value="65" color="bg-purple-500" />
      </div>

      {/* Side-by-side forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <form onSubmit={handleBusSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Add New Bus</h2>
          <input
            type="text"
            placeholder="Bus Plate Number"
            value={busData.plate}
            onChange={(e) => setBusData({ ...busData, plate: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Seating Capacity"
            value={busData.capacity}
            onChange={(e) => setBusData({ ...busData, capacity: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Add Bus
          </button>
        </form>

        <form onSubmit={handleRouteSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Add New Route</h2>
          <input
            type="text"
            placeholder="From"
            value={routeData.from}
            onChange={(e) => setRouteData({ ...routeData, from: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="To"
            value={routeData.to}
            onChange={(e) => setRouteData({ ...routeData, to: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="time"
            placeholder="Departure Time"
            value={routeData.time}
            onChange={(e) => setRouteData({ ...routeData, time: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Add Route
          </button>
        </form>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Recent Bookings</h2>
        <ul className="text-gray-700">
          <li className="border-b py-2">Mary Mwamburi - Route A - 7:00 AM</li>
          <li className="border-b py-2">Samuel Kariuki - Route B - 7:30 AM</li>
          <li className="border-b py-2">Ann Mbithe - Route A - 8:00 AM</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg text-white shadow ${color}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}