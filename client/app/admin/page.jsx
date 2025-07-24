'use client';
import { useState, useEffect } from 'react';

export default function ItineraryDashboard() {
  const [authorized, setAuthorized] = useState(true); // Simulated auth
  const [busData, setBusData] = useState({ numberplate: '', capacity: '', routeid: '' });
  const [routeData, setRouteData] = useState({ route_name: '',
  locations: [{ name_location: '', GPSystem: '' }]
});
  const [routes, setRoutes] = useState([])
  const [bookings, setBookings] = useState([]);


  const API_BASE = 'http://127.0.0.1:5000';

  useEffect(() => {
    // Simulate auth check or fetching user role
    setTimeout(() => {
      setAuthorized(true);
    }, 500);

    const fetchRoutes = fetch(`${API_BASE}/routes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then(res => res.json()).then(data => {
    if (Array.isArray(data)) setRoutes(data);
  }).catch(err => console.error('Failed to load routes:', err));

  const fetchBookings = fetch(`${API_BASE}/bookings`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) setBookings(data);
  })
  .catch(err => console.error('Failed to load bookings:', err));

  Promise.all([fetchRoutes, fetchBookings]);
}, []);


  const handleBusSubmit = async(e) => {
    e.preventDefault();
    console.log('New Bus:', busData);
    try {
      const res = await fetch(`${API_BASE}/buses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(busData),
      });
      const result = await res.json()
      if (res.ok) {
        alert('Bus added!');
        setBusData({numberplate: '', capacity:'', routeid: ''});
      }else {
        alert(result.error || 'Failed to add bus');
      }
    }catch (error) {
      console.error('Error adding bus:', error),
      alert('Server error')
    }
  };

  const handleRouteSubmit = async(e) => {
    e.preventDefault();
    console.log('New Route:', routeData);
    try {
      const res = await fetch(`${API_BASE}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(routeData),
      });

      const result = await res.json()
      if (res.ok) {
        alert('Route added!');
        setRouteData({ route_name: '', locations: [{ name_location: '', GPSystem: '' }] });
        setRoutes(prev => [...prev, result]); // Optimistic update
      } else {
        alert(result.error || 'Failed to add route');
      }
    }catch (error) {
      console.error('Error adding route:', error);
      alert('Server error');
    }
  };

  const handleLocationChange = (index, field, value) => {
  const newLocations = [...routeData.locations];
  newLocations[index][field] = value;
  setRouteData({ ...routeData, locations: newLocations });
};

const addLocationField = () => {
  setRouteData({
    ...routeData,
    locations: [...routeData.locations, { name_location: '', GPSystem: '' }]
  });
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
            value={busData.numberplate}
            onChange={(e) => setBusData({ ...busData, numberplate: e.target.value })}
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
          <select
            value={busData.routeid}
            onChange={(e) => setBusData({ ...busData, routeid: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.route_name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Add Bus
          </button>
        </form>
{/* Route Form */}
        <form onSubmit={handleRouteSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Add New Route</h2>
           <input
    type="text"
    placeholder="Route Name"
    value={routeData.route_name}
    onChange={(e) => setRouteData({ ...routeData, route_name: e.target.value })}
    className="w-full p-2 mb-4 border rounded"
    required
  />

  <h3 className="text-lg font-medium mb-2">Pickup/Dropoff Locations</h3>

  {routeData.locations.map((loc, index) => (
    <div key={index} className="mb-4">
      <input
        type="text"
        placeholder="Location Name"
        value={loc.name_location}
        onChange={(e) => handleLocationChange(index, 'name_location', e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="GPS (optional)"
        value={loc.GPSystem}
        onChange={(e) => handleLocationChange(index, 'GPSystem', e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
    </div>
  ))}

  <button
    type="button"
    onClick={addLocationField}
    className="mb-4 text-blue-600 hover:underline"
  >
    + Add Another Location
  </button>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Add Route
          </button>
        </form>
      </div>

      {/* Recent Bookings */}
      {/* All Bookings (Admin View) Table */}
<div className="bg-white shadow-md rounded-lg p-6 mt-10">
  <h2 className="text-xl font-semibold text-indigo-700 mb-4">All Bookings</h2>
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-100 text-gray-700 uppercase">
      <tr>
        <th className="px-4 py-2">User ID</th>
        <th className="px-4 py-2">Bus ID</th>
        <th className="px-4 py-2">Pickup</th>
        <th className="px-4 py-2">Dropoff</th>
        <th className="px-4 py-2">Seats</th>
        <th className="px-4 py-2">Price</th>
        <th className="px-4 py-2">Date</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map((b, idx) => (
        <tr key={idx} className="border-b">
          <td className="px-4 py-2">{b.user_id}</td>
          <td className="px-4 py-2">{b.bus_id}</td>
          <td className="px-4 py-2">{b.pickup_location}</td>
          <td className="px-4 py-2">{b.dropoff_location}</td>
          <td className="px-4 py-2">{b.seats_booked}</td>
          <td className="px-4 py-2">KES {b.price}</td>
          <td className="px-4 py-2">{b.booking_date}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
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