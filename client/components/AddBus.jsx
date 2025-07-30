'use client';
import { useState } from 'react';
import axios from 'axios';

import { API_BASE } from '../lib/api';

export default function AddBus({ routes }) {
  const [busData, setBusData] = useState({ numberplate: '', capacity: '', routeid: '' });

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/buses/`,
        {
          numberplate: busData.numberplate,
          capacity: Number(busData.capacity),
          routeid: Number(busData.routeid),
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        alert('Bus added!');
        setBusData({ numberplate: '', capacity: '', routeid: '' });
      }
    } catch (error) {
      alert('Error adding bus');
    }
  };

  return (
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
  );
}
