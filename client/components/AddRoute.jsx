'use client';
import { useState } from 'react';
import LocationSearch from '../components/LocationSearch';


export default function AddRoute({ onRouteAdded }) {
  const [routeData, setRouteData] = useState({
    route_name: '',
    locations: [{ name_location: '', latitude: '', longitude: '' }],
  });

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending route data:", routeData); 
    try {
      console.log("Payload being sent:", JSON.stringify(routeData, null, 2));
      const res = await fetch('http://localhost:5000/routes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(routeData),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Route added!');
        setRouteData({ route_name: '', locations: [{ name_location: ''}] });
        onRouteAdded && onRouteAdded(result);
      } else {
        alert(result.error || 'Failed to add route');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  
  const handleLocationChange = (index, field, value) => {
  const updatedLocations = [...routeData.locations];
  updatedLocations[index][field] = value;
  setRouteData({ ...routeData, locations: updatedLocations });
};


  const addLocationField = () => {
  setRouteData((prevData) => ({
    ...prevData,
    locations: [...prevData.locations, { name_location: '', latitude: '', longitude: '' }],
  }));
};


  return (
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
      {routeData.locations.map((loc, index) => (
        <div key={index} className="mb-4">
          {/* <input
            type="text"
            placeholder="Location Name"
            value={loc.name_location}
            onChange={(e) => handleLocationChange(index, 'name_location', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          /> */}
          
        <LocationSearch 
  onSelect={({ name, latitude, longitude }) => {
    handleLocationChange(index, 'name_location', name);
    handleLocationChange(index, 'latitude', latitude);
    handleLocationChange(index, 'longitude', longitude);
  }}
/>

          {/* <input
            type="text"
            placeholder="Latitude"
            value={loc.latitude}
            onChange={(e) => handleLocationChange(index, 'latitude', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Longitude"
            value={loc.longitude}
            onChange={(e) => handleLocationChange(index, 'longitude', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          /> */}
        </div>
      ))}
      <button type="button" onClick={addLocationField} className="mb-4 text-blue-600 hover:underline">
        + Add Another Location
      </button>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Add Route
      </button>
    </form>
  );
}
