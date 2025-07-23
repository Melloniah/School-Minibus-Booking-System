'use client';
import { useEffect, useState } from 'react';

export default function OperatorDashboard() {
  const [authorized, setAuthorized] = useState(true); // Simulated auth check

  useEffect(() => {
    // Simulate access validation
    setTimeout(() => {
      setAuthorized(true);
    }, 500);
  }, []);

  if (!authorized) {
    return <p className="p-4">Validating access...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        Welcome, Route Manager
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bookings" value="128" color="bg-green-500" />
        <StatCard title="Active Routes" value="7" color="bg-blue-500" />
        <StatCard title="Registered Parents" value="34" color="bg-yellow-500" />
        <StatCard title="Available Seats" value="65" color="bg-purple-500" />
      </div>

      {/* Placeholder Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Today's Route Logs</h2>
        <p className="text-gray-600">Pickup and drop-off status will appear here.</p>
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