'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddBusForm from '../../components/AddBus';
import AddRouteForm from '../../components/AddRoute';
import BookingsTable from '../../components/VeiwBooking';

// ─────────────────────────────────────────────
// 🔐 Admin Login Form Component
function AdminLoginForm({ onLogin }) {
  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login, replace with real auth later
    onLogin();
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Admin Login</h2>
      <input type="text" placeholder="Username" className="w-full mb-4 p-2 border border-gray-300 rounded" required />
      <input type="password" placeholder="Password" className="w-full mb-4 p-2 border border-gray-300 rounded" required />
      <button type="submit" className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 transition">
        Login
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
// 📊 Stat Card Component
function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg text-white shadow-lg flex flex-col justify-between items-start ${color}`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🧠 Main Component
export default function ItineraryDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const API_BASE = 'http://localhost:5000';

  const getRoutes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/routes`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log('Routes data:', response.data);
        setRoutes(response.data);
      } else {
        console.error('Failed to fetch routes', response.status, response.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  }, [API_BASE]);

  const getBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/bookings`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log('Booking data:', response.data);
        setBookings(response.data);
      } else {
        console.error('Failed to fetch bookings', response.status, response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (authorized) {
      getRoutes();
      getBookings();
    }
  }, [authorized, getRoutes, getBookings]);

  // 🔒 Show login form if not authorized
  if (!authorized) {
    return <AdminLoginForm onLogin={() => setAuthorized(true)} />;
  }

  // 📈 Dashboard Stats
  const totalBookings = bookings.length;
  const activeRoutes = routes.length;
  const registeredParents = 34; // Placeholder
  const availableSeats = 65; // Placeholder

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* 🔁 Toggle Button to Parent Dashboard */}
      <div className="flex justify-end mb-4">
        <a
          href="/"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded shadow text-sm transition"
        >
          Switch to Parent Dashboard
        </a>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-indigo-800 text-center">Itinerary Operator Dashboard</h1>

      {/* 🚀 Navigation Buttons */}
      <nav className="mb-8 flex flex-wrap justify-center gap-4">
        {[
          ['dashboard', 'Dashboard Overview'],
          ['addBus', 'Add New Bus'],
          ['addRoute', 'Add New Route'],
          ['viewBookings', 'View All Bookings'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveComponent(key)}
            className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ease-in-out
              ${activeComponent === key
                ? 'bg-indigo-700 text-white shadow-lg'
                : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400'
              }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* 🎯 Conditional Rendering */}
      <div className="max-w-6xl mx-auto">
        {activeComponent === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Bookings" value={totalBookings} color="bg-green-500" />
              <StatCard title="Active Routes" value={activeRoutes} color="bg-blue-500" />
              <StatCard title="Registered Parents" value={registeredParents} color="bg-yellow-500" />
              <StatCard title="Available Seats" value={availableSeats} color="bg-purple-500" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Dashboard Summary</h2>
              <p className="text-gray-700">
                This overview provides a quick glance at key metrics. Use the navigation buttons above to manage buses, routes, and view detailed booking information.
              </p>
            </div>
          </>
        )}

        {activeComponent === 'addBus' && (
          <AddBusForm routes={routes} API_BASE={API_BASE} onBusAdded={getRoutes} />
        )}

        {activeComponent === 'addRoute' && (
          <AddRouteForm API_BASE={API_BASE} onRouteAdded={getRoutes} />
        )}

        {activeComponent === 'viewBookings' && (
          <BookingsTable bookings={bookings} />
        )}
      </div>
    </div>
  );
}