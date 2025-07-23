'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAuthorized(true);
    }, 500);
  }, []);

  if (!authorized) {
    return <p className="p-4">Checking access...</p>;
  }

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#3A3D98]">Welcome, Itinerary Operator</h1>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-[#3A3D98] text-white px-4 py-2 rounded hover:bg-[#2f2e8c]"
        >
          Switch to Parent Dashboard
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bookings" value="128" bg="bg-[#EEF3FF]" textColor="text-[#3A3D98]" />
        <StatCard title="Routes Active" value="7" bg="bg-[#FFF4E6]" textColor="text-[#B97816]" />
        <StatCard title="Registered Parents" value="34" bg="bg-[#F0FAF4]" textColor="text-[#3F8C52]" />
        <StatCard title="Available Seats" value="65" bg="bg-[#FCEBF3]" textColor="text-[#C23678]" />
      </div>

      {/* Add Bus Section */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#3A3D98]">Add New Bus</h2>
        <form className="grid gap-4 sm:grid-cols-2">
          <input type="text" placeholder="Bus Plate Number" className="border p-2 rounded" />
          <input type="number" placeholder="Seating Capacity" className="border p-2 rounded" />
          <input type="text" placeholder="Driver Name" className="border p-2 rounded" />
          <button className="bg-[#3A3D98] text-white p-2 rounded col-span-full sm:col-span-1 hover:bg-[#2f2e8c]">
            Add Bus
          </button>
        </form>
      </div>

      {/* Add Route Section */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#3A3D98]">Add New Route</h2>
        <form className="grid gap-4 sm:grid-cols-2">
          <input type="text" placeholder="From (Location)" className="border p-2 rounded" />
          <input type="text" placeholder="To (Location)" className="border p-2 rounded" />
          <input type="time" className="border p-2 rounded" />
          <button className="bg-[#3A3D98] text-white p-2 rounded col-span-full sm:col-span-1 hover:bg-[#2f2e8c]">
            Add Route
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ title, value, bg, textColor }) {
  return (
    <div className={`${bg} ${textColor} p-4 rounded-lg shadow-sm`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}