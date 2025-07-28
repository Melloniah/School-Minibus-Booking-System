// app/admin/page.jsx
'use client'; // This directive is necessary for Next.js 13+ to make this a Client Component

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Import the new components
import AddBusForm from '../../components/AddBus';
import AddRouteForm from '../../components/AddRoute';
import BookingsTable from '../../components/VeiwBooking';
import { GoogleMapsProvider } from '../../components/GoogleMapsProvider';
// StatCards component is no longer imported here as its logic is moved directly into this file

// StatCard sub-component for displaying individual statistics - MOVED HERE
function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg text-white shadow-lg flex flex-col justify-between items-start ${color}`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}


export default function ItineraryDashboard() {
  // State for authorization status (simulated)
  const [authorized, setAuthorized] = useState(false);
  // State to hold route data fetched from the API
  const [routes, setRoutes] = useState([]);
  // State to hold booking data fetched from the API
  const [bookings, setBookings] = useState([]);
  // State to control which component is currently displayed
  const [activeComponent, setActiveComponent] = useState('dashboard'); // 'dashboard', 'addBus', 'addRoute', 'viewBookings'

  // Base URL for the API
  const API_BASE = 'http://localhost:5000';

  // Function to fetch routes from the backend
  const getRoutes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/routes`, {
        withCredentials: true, // Include cookies for session management
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
  }, [API_BASE]); // Dependency array for useCallback

  // Function to fetch bookings from the backend
  const getBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/bookings`, {
        withCredentials: true, // Include cookies for session management
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
  }, [API_BASE]); // Dependency array for useCallback

  // useEffect hook to run on component mount
  useEffect(() => {
    // Simulate authentication check
    setTimeout(() => {
      setAuthorized(true); // Set authorized to true after a delay
    }, 500);

    // Fetch initial data
    getRoutes();
    getBookings();
  }, [getRoutes, getBookings]); // Dependencies ensure these functions are stable

  // If not authorized, display a loading message
  if (!authorized) {
    return <p className="p-4 text-gray-700">Checking access...</p>;
  }

  // Calculate stats for StatCards (mock data for now, replace with real calculations if available)
  const totalBookings = bookings.length;
  const activeRoutes = routes.length;
  const registeredParents = 34; // Placeholder
  const availableSeats = 65; // Placeholder

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-800 text-center">Itinerary Operator Dashboard</h1>

      {/* Navigation Buttons */}
      <nav className="mb-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setActiveComponent('dashboard')}
          className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ease-in-out
            ${activeComponent === 'dashboard' ? 'bg-indigo-700 text-white shadow-lg' : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400'}`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveComponent('addBus')}
          className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ease-in-out
            ${activeComponent === 'addBus' ? 'bg-indigo-700 text-white shadow-lg' : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400'}`}
        >
          Add New Bus
        </button>
        <button
          onClick={() => setActiveComponent('addRoute')}
          className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ease-in-out
            ${activeComponent === 'addRoute' ? 'bg-indigo-700 text-white shadow-lg' : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400'}`}
        >
          Add New Route
        </button>
        <button
          onClick={() => setActiveComponent('viewBookings')}
          className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ease-in-out
            ${activeComponent === 'viewBookings' ? 'bg-indigo-700 text-white shadow-lg' : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400'}`}
        >
          View All Bookings
        </button>
      </nav>

      {/* Conditional Rendering of Components */}
      <div className="max-w-6xl mx-auto">
        {activeComponent === 'dashboard' && (
          <>
            {/* Stat Cards - MOVED HERE */}
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
