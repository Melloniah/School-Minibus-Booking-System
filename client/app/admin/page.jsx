'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddBusForm from '../../components/AddBus';
import AddRouteForm from '../../components/AddRoute';
import BookingsTable from '../../components/VeiwBooking';

// ─────────────────────────────────────────────
// 🔐 Admin Login Form Component
function AdminLoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5000'; // Define API_BASE here for the login form

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true, // Important: send cookies (JWT) with the request
      });

      if (response.status === 200) {
        // Assuming your backend returns a user object with a role
        if (response.data.user && response.data.user.role === 'admin') {
          onLogin(); // Call the parent's onLogin to set authorized state
        } else {
          setError('Login successful, but only admin access is allowed here.');
        }
      } else {
        setError(response.data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.error || 'Login failed. Invalid credentials.');
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please try again later.');
      } else {
        // Something else happened
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Admin Login</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
// 📊 Stat Card Component
function StatCard({ title, value, color, onClick }) {
  return (
    <div
      className={`p-4 rounded-lg text-white shadow-lg flex flex-col justify-between items-start cursor-pointer ${color}`}
      onClick={onClick}
    >
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 👥 Users Modal Component
function UsersModal({ users, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-3">Registered Users</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light"
          aria-label="Close"
        >
          &times;
        </button>
        {users.length === 0 ? (
          <p className="text-gray-600">No registered users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{user.id}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{user.name}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{user.email}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 🚌 Buses Modal Component (NEW COMPONENT)
function BusesModal({ buses, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-3">Available Buses</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light"
          aria-label="Close"
        >
          &times;
        </button>
        {buses.length === 0 ? (
          <p className="text-gray-600">No buses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Number Plate</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Capacity</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">Route ID</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{bus.id}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{bus.numberplate}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{bus.capacity}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{bus.routeid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🧠 Main Component
export default function ItineraryDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]); // New state for buses
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showBusesModal, setShowBusesModal] = useState(false); // New state for bus modal visibility
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

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/users`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log('Users data:', response.data);
        setUsers(response.data);
      } else {
        console.error('Failed to fetch users', response.status, response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [API_BASE]);

  // New function to fetch buses
  const getBuses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/buses`, { // Assuming /buses endpoint returns all buses
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log('Buses data:', response.data);
        setBuses(response.data);
      } else {
        console.error('Failed to fetch buses', response.status, response.data);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (authorized) {
      getRoutes();
      getBookings();
      getUsers(); // Fetch users on initial load
      getBuses(); // Fetch buses on initial load
    }
  }, [authorized, getRoutes, getBookings, getUsers, getBuses]);

  // 🔒 Show login form if not authorized
  if (!authorized) {
    return <AdminLoginForm onLogin={() => setAuthorized(true)} />;
  }

  // 📈 Dashboard Stats
  const totalBookings = bookings.length;
  const activeRoutes = routes.length;
  const registeredParents = users.length;
  const availableBuses = buses.length; // Now reflects the count of fetched buses

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
              <StatCard
                title="Total Bookings"
                value={totalBookings}
                color="bg-green-500"
                onClick={() => setActiveComponent('viewBookings')}
              />
              <StatCard title="Active Routes" value={activeRoutes} color="bg-blue-500" />
              <StatCard
                title="Registered Parents"
                value={registeredParents}
                color="bg-yellow-500"
                onClick={async () => {
                  await getUsers();
                  setShowUsersModal(true);
                }}
              />
              <StatCard
                title="Available Buses" // Changed title
                value={availableBuses} // Uses the count of fetched buses
                color="bg-purple-500"
                onClick={async () => {
                  await getBuses(); // Fetch buses when clicked
                  setShowBusesModal(true); // Show the bus modal
                }}
              />
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

      {/* Render Modals conditionally */}
      {showUsersModal && (
        <UsersModal users={users} onClose={() => setShowUsersModal(false)} />
      )}
      {showBusesModal && ( // New conditional rendering for BusesModal
        <BusesModal buses={buses} onClose={() => setShowBusesModal(false)} />
      )}
    </div>
  );
}
