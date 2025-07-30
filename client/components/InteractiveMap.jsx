'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

// API utilities
const API_BASE = 'https://school-minibus-booking-system.onrender.com';

const getStopsByRoute = (routeId) =>
  axios.get(`${API_BASE}/location/by-route?route_id=${routeId}`, { withCredentials: true });

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -1.2860, // Nairobi coordinates
  lng: 36.8257,
};

export default function InteractiveMap({ apiKey, selectedRoute }) {
  const [activeStopIndex, setActiveStopIndex] = useState(null);
  const [stops, setStops] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  // Fetch stops when selectedRoute changes
  useEffect(() => {
    if (selectedRoute && selectedRoute.id) {
      fetchRouteStops(selectedRoute.id);
    } else {
      setStops([]);
      setRouteCoordinates([]);
    }
  }, [selectedRoute]);

  // Update map bounds when coordinates change
  useEffect(() => {
    if (routeCoordinates.length && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      routeCoordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds);
    }
  }, [routeCoordinates]);

  const fetchRouteStops = async (routeId) => {
    try {
      setLoadingStops(true);
      const response = await getStopsByRoute(routeId);
      
      if (response.status === 200) {
        setStops(response.data);
        
        // Generate coordinates from stops if they have lat/lng
        const coordinates = response.data
          .filter(stop => stop.latitude && stop.longitude)
          .map(stop => ({
            lat: parseFloat(stop.latitude),
            lng: parseFloat(stop.longitude)
          }));
        
        setRouteCoordinates(coordinates);
      } else {
        console.error('Failed to fetch stops');
        setStops([]);
        setRouteCoordinates([]);
      }
    } catch (err) {
      console.error('Error fetching stops:', err);
      setStops([]);
      setRouteCoordinates([]);
    } finally {
      setLoadingStops(false);
    }
  };

  const polylineOptions = {
    strokeColor: '#8b5cf6', // Purple color
    strokeOpacity: 1,
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

  // Use API coordinates if available, otherwise fallback to selectedRoute coordinates
  const displayCoordinates = routeCoordinates.length > 0 
    ? routeCoordinates 
    : selectedRoute?.coordinates || [];

  // Use API stops if available, otherwise fallback to selectedRoute stops
  const displayStops = stops.length > 0 
    ? stops.map(stop => stop.name_location)
    : selectedRoute?.stops || [];

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={displayCoordinates.length > 0 ? displayCoordinates[0] : defaultCenter}
        zoom={13}
        onLoad={onLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Show route polyline if coordinates available */}
        {displayCoordinates.length > 1 && (
          <Polyline 
            path={displayCoordinates} 
            options={polylineOptions} 
          />
        )}

        {/* Show markers for each stop */}
        {displayCoordinates.map((coord, idx) => (
          <Marker
            key={`stop-${idx}`}
            position={coord}
            onClick={() => setActiveStopIndex(idx)}
            icon={{
              url: '/school-busIcon-32.png', // Bus icon URL
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            title={
              stops[idx]?.name_location || 
              selectedRoute?.stops?.[idx] || 
              `Stop ${idx + 1}`
            }
          />
        ))}

        {/* Info window for active stop */}
        {activeStopIndex !== null && displayCoordinates[activeStopIndex] && (
          <InfoWindow
            position={displayCoordinates[activeStopIndex]}
            onCloseClick={() => setActiveStopIndex(null)}
          >
            <div className="p-2">
              <h4 className="font-semibold text-sm">
                {stops[activeStopIndex]?.name_location || 
                 selectedRoute?.stops?.[activeStopIndex] || 
                 `Stop ${activeStopIndex + 1}`}
              </h4>
              {stops[activeStopIndex]?.description && (
                <p className="text-xs text-gray-600 mt-1">
                  {stops[activeStopIndex].description}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Loading overlay */}
      {loadingStops && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading route...</p>
          </div>
        </div>
      )}


      {/* No coordinates available state */}
      {selectedRoute && displayCoordinates.length === 0 && !loadingStops && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">🗺️</p>
            <p>Route coordinates not available</p>
            <p className="text-sm">Route: {selectedRoute.route_name}</p>
          </div>
        </div>
      )}
    </div>
  );
}