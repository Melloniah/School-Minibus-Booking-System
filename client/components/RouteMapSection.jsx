'use client';

import { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import RouteBookingForm from './RouteBookingForm';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// API utilities
const API_BASE = 'http://localhost:5000';

const getRoutes = () =>
  axios.get(`${API_BASE}/routes/`, { withCredentials: true });

export default function RouteMapSection() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  // Fetch routes from API on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const response = await getRoutes();
      
      if (response.status === 200) {
        setRoutes(response.data);
        // Set first route as default selected if available
        if (response.data.length > 0) {
          setSelectedRoute(response.data[0]);
        }
        toast.success('Routes loaded successfully');
      } else {
        toast.error('Failed to fetch routes');
        setRoutes([]);
      }
    } catch (err) {
      console.error('Failed to fetch routes:', err);
      toast.error('Error loading routes');
      setRoutes([]);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  // Filter routes based on search term
  const filteredRoutes = searchTerm
    ? routes.filter(route =>
        (route.route_name || route.name)?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : routes;

  if (loadingRoutes) {
    return (
      <section className="w-full min-h-screen py-12 md:py-24 bg-gradient-to-br from-blue-150 via-purple-150 to-pink-150">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading routes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen py-12 md:py-24 bg-gradient-to-br from-blue-150 via-purple-150 to-pink-150">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Route & Book Your Trip!
          </h2>
          <p className="mt-1 text-gray-700 max-w-md mx-auto text-sm sm:text-base">
            Select a route, view it on the map, and book your journey. ✨
          </p>
        </div>

        <input
          type="text"
          placeholder="Search a route..."
          className="mb-6 p-2 w-full border rounded text-black bg-white dark:text-white dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[600px]">
          {/* Route Cards Section - Left */}
          <div className="flex-[2] flex flex-col gap-4">
            <h3 className="text-lg font-bold text-left text-purple-700 mb-2">Available Routes</h3>
            {filteredRoutes.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                {searchTerm ? 'No routes match your search.' : 'No routes available.'}
              </p>
            ) : (
              <div className="max-h-[500px] overflow-y-auto space-y-3">
                {filteredRoutes.map(route => (
                  <div
                    key={route.id}
                    onClick={() => handleRouteSelect(route)}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition duration-200 ease-in-out transform ${
                      selectedRoute?.id === route.id
                        ? 'border-purple-600 bg-purple-50 shadow-lg scale-102'
                        : 'border-gray-300 bg-white scale-100 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">
                        {route.route_name || route.name}
                      </span>
                      {selectedRoute?.id === route.id && (
                        <span className="text-purple-600 text-sm">✓ Selected</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {route.description || 'Route available for booking'}
                    </div>
                    {/* Show route status if available */}
                    <div className={`mt-3 text-center rounded-md py-1 text-sm font-medium ${
                      route.status === 'Full'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : selectedRoute?.id === route.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    }`}>
                      {route.status === 'Full' 
                        ? 'Route Full' 
                        : selectedRoute?.id === route.id 
                        ? 'Selected' 
                        : 'Select Route'
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map Section - Middle */}
          <div className="flex-[3] h-[400px] xl:h-auto xl:min-h-full rounded-lg shadow-xl overflow-hidden">
            <InteractiveMap
              apiKey={process.env.GOOGLE_MAPS_API_KEY}
              selectedRoute={selectedRoute}
            />
          </div>

          {/* Booking Form Section - Right */}
          <div className="flex-[2]">
            <RouteBookingForm selectedRoute={selectedRoute} />
          </div>
        </div>

        {/* Route Info Display */}
        {selectedRoute && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-purple-700 mb-4">Route Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Route Name:</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedRoute.route_name || selectedRoute.name}
                </p>
              </div>
              {selectedRoute.description && (
                <div>
                  <p className="font-semibold">Description:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedRoute.description}</p>
                </div>
              )}
              {selectedRoute.distance && (
                <div>
                  <p className="font-semibold">Distance:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedRoute.distance} km</p>
                </div>
              )}
              {selectedRoute.estimated_duration && (
                <div>
                  <p className="font-semibold">Estimated Duration:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedRoute.estimated_duration} minutes</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Routes Available State */}
        {!loadingRoutes && routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No routes are currently available.</p>
            <button
              onClick={fetchRoutes}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Refresh Routes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}