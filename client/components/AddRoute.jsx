// components/AddRouteForm.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider'; // Import the custom hook

// Default map center (Nairobi)
const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya latitude
  lng: 36.817223, // Nairobi, Kenya longitude
};

// AddRouteForm component for adding new route details with map integration
function AddRouteForm({ API_BASE, onRouteAdded }) {
  // Use the Google Maps context to check if the API is loaded
  const { isLoaded, loadError } = useGoogleMaps();

  // State to manage route form data, including an array for locations
  const [routeData, setRouteData] = useState({
    route_name: '',
    locations: [{ name_location: '', latitude: '', longitude: '' }]
  });
  // State for displaying messages to the user
  const [message, setMessage] = useState('');
  // State for message type (success or error)
  const [messageType, setMessageType] = useState('');

  // Refs for Autocomplete instances to get place details
  const autocompleteRefs = useRef([]);
  // State for the map's center, updates dynamically
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  // State for map zoom level
  const [mapZoom, setMapZoom] = useState(10); // Start with a broader view

  // Update map center and zoom when locations change
  useEffect(() => {
    if (routeData.locations.length > 0 && routeData.locations[0].latitude && routeData.locations[0].longitude) {
      // Set map center to the first valid location
      setMapCenter({
        lat: parseFloat(routeData.locations[0].latitude),
        lng: parseFloat(routeData.locations[0].longitude),
      });
      setMapZoom(12); // Zoom in a bit when locations are present
    } else {
      setMapCenter(defaultCenter);
      setMapZoom(10);
    }
  }, [routeData.locations]);

  // Handler for route form submission
  const handleRouteSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(''); // Clear previous messages
    setMessageType(''); // Clear previous message type

    // Basic validation for route name
    if (!routeData.route_name.trim()) {
      setMessage('Route name cannot be empty.');
      setMessageType('error');
      return;
    }

    // Basic validation for locations
    const isValidLocations = routeData.locations.every(loc =>
      loc.name_location && loc.latitude && loc.longitude
    );

    if (!isValidLocations) {
      setMessage('All location fields (name, latitude, longitude) must be filled.');
      setMessageType('error');
      return;
    }

    try {
      // Send a POST request to add a new route
      const res = await fetch(`${API_BASE}/routes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        credentials: 'include', // Include cookies in the request for authentication
        body: JSON.stringify(routeData), // Send route data as JSON string
      });

      const result = await res.json(); // Parse the JSON response
      // Check if the request was successful
      if (res.ok) {
        setMessage('Route added successfully!'); // Set success message
        setMessageType('success');
        setRouteData({ route_name: '', locations: [{ name_location: '', latitude: '', longitude: '' }] }); // Reset form fields
        onRouteAdded(); // Callback to refresh data in parent component
      } else {
        setMessage(result.error || 'Failed to add route.'); // Set error message from response or default
        setMessageType('error');
        console.error('Route add failed:', result); // Log error details
      }
    } catch (error) {
      setMessage('Server error. Please try again.'); // Set generic server error message
      setMessageType('error');
      console.error('Error adding route:', error); // Log detailed error
    }
  };

  // Handler for changes in location input fields (for manual input or after autocomplete)
  const handleLocationChange = (index, field, value) => {
    const newLocations = [...routeData.locations]; // Create a copy of the locations array
    newLocations[index][field] = value; // Update the specific field of the location
    setRouteData({ ...routeData, locations: newLocations }); // Update routeData state
  };

  // Handler for when a place is selected from Autocomplete suggestions
  const onPlaceChanged = (index) => {
    if (autocompleteRefs.current[index] !== null) {
      const place = autocompleteRefs.current[index].getPlace();

      if (place.geometry && place.geometry.location) {
        const newLocations = [...routeData.locations];
        newLocations[index] = {
          name_location: place.formatted_address || place.name,
          latitude: place.geometry.location.lat().toString(),
          longitude: place.geometry.location.lng().toString(),
        };
        setRouteData({ ...routeData, locations: newLocations });
      } else {
        setMessage('No details available for input: ' + place.name);
        setMessageType('error');
      }
    }
  };

  // Handler to add a new location input field
  const addLocationField = () => {
    setRouteData({
      ...routeData,
      locations: [...routeData.locations, { name_location: '', latitude: '', longitude: '' }] // Add a new empty location object
    });
  };

  // Polyline options for the route path on the map
  const polylineOptions = {
    strokeColor: '#8b5cf6', // Purple color
    strokeOpacity: 0.8,
    strokeWeight: 4,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4,
      },
      offset: '0',
      repeat: '20px',
    }],
  };

  // Prepare coordinates for the Polyline
  const pathCoordinates = routeData.locations
    .filter(loc => loc.latitude && loc.longitude)
    .map(loc => ({
      lat: parseFloat(loc.latitude),
      lng: parseFloat(loc.longitude),
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Route Form */}
      <form onSubmit={handleRouteSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Add New Route</h2>
        {message && (
          <div className={`p-3 mb-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <input
          type="text"
          placeholder="Route Name"
          value={routeData.route_name}
          onChange={(e) => setRouteData({ ...routeData, route_name: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        />

        <h3 className="text-lg font-medium mb-2 text-gray-700">Pickup/Dropoff Locations</h3>

        {/* Render Autocomplete inputs only when API is loaded */}
        {loadError && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {loadError}
          </div>
        )}
        {routeData.locations.map((loc, index) => (
          <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
            {isLoaded ? (
              <Autocomplete
                onLoad={autocomplete => autocompleteRefs.current[index] = autocomplete}
                onPlaceChanged={() => onPlaceChanged(index)}
              >
                <input
                  type="text"
                  placeholder="Location Name (Type to search)"
                  value={loc.name_location}
                  onChange={(e) => handleLocationChange(index, 'name_location', e.target.value)}
                  className="w-full p-2 mb-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                placeholder="Location Name (Maps loading...)"
                value={loc.name_location}
                onChange={(e) => handleLocationChange(index, 'name_location', e.target.value)}
                className="w-full p-2 mb-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={!isLoaded}
              />
            )}
            <input
              type="text"
              placeholder="Latitude (Auto-filled)"
              value={loc.latitude}
              onChange={(e) => handleLocationChange(index, 'latitude', e.target.value)}
              className="w-full p-2 mb-2 border rounded-md bg-gray-100"
              readOnly // Make it read-only as it's auto-filled
              required
            />
            <input
              type="text"
              placeholder="Longitude (Auto-filled)"
              value={loc.longitude}
              onChange={(e) => handleLocationChange(index, 'longitude', e.target.value)}
              className="w-full p-2 mb-2 border rounded-md bg-gray-100"
              readOnly // Make it read-only as it's auto-filled
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addLocationField}
          className="mb-6 text-blue-600 hover:underline flex items-center space-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add Another Location</span>
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Add Route
        </button>
      </form>

      {/* Map Preview */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Route Map Preview</h2>
        {loadError && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {loadError}
          </div>
        )}
        {!isLoaded && !loadError && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading Google Maps...
          </div>
        )}
        {isLoaded && !loadError && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '8px' }}
            center={mapCenter}
            zoom={mapZoom}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {/* Markers for each location */}
            {routeData.locations.map((loc, index) => (
              loc.latitude && loc.longitude && (
                <Marker
                  key={`marker-${index}`}
                  position={{ lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude) }}
                  label={`${index + 1}`} // Label markers with numbers
                />
              )
            ))}
            {/* Polyline connecting locations */}
            {pathCoordinates.length > 1 && (
              <Polyline
                path={pathCoordinates}
                options={polylineOptions}
              />
            )}
          </GoogleMap>
        )}
        <div className="mt-4 text-sm text-gray-600">
          Locations added: {routeData.locations.filter(loc => loc.name_location).length}
          {routeData.locations.filter(loc => loc.name_location).map((loc, index) => (
            <p key={index} className="text-xs text-gray-500 mt-1">
              {index + 1}. {loc.name_location}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddRouteForm;
