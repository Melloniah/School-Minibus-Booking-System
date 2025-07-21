'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(true); // Simulate auth check

  useEffect(() => {
    // Simulate auth check or fetch
    setTimeout(() => {
      setAuthorized(true);
    }, 500);
  }, []);

  if (!authorized) {
    return <p className="p-4">Checking access...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Welcome, Admin</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bookings" value="128" color="bg-green-500" />
        <StatCard title="Routes Active" value="7" color="bg-blue-500" />
        <StatCard title="Registered Parents" value="34" color="bg-yellow-500" />
        <StatCard title="Available Seats" value="65" color="bg-purple-500" />
      </div>

      {/* Placeholder for more */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Recent Bookings</h2>
        <p className="text-gray-600">Booking data coming soon...</p>
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