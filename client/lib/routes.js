'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function InteractiveMap({ selectedRoute }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map only once
      mapRef.current = L.map('map', {
        center: [-1.2841, 36.8235], // Moi Avenue Primary center
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Clear previous layers (markers, polylines)
    mapRef.current.eachLayer((layer) => {
      if (layer.options && (layer.options.pane === 'markerPane' || layer instanceof L.Polyline)) {
        mapRef.current.removeLayer(layer);
      }
    });

    if (selectedRoute && selectedRoute.coordinates.length > 0) {
      // Add markers for each stop with popups showing stop names
      selectedRoute.coordinates.forEach((coord, idx) => {
        const marker = L.marker([coord.lat, coord.lng]).addTo(mapRef.current);
        marker.bindPopup(selectedRoute.stops[idx] || `Stop ${idx + 1}`);
      });

      // Draw polyline connecting all stops
      const latlngs = selectedRoute.coordinates.map(({ lat, lng }) => [lat, lng]);
      L.polyline(latlngs, { color: 'purple', weight: 4, dashArray: '6 10' }).addTo(mapRef.current);

      // Adjust map view to fit the route bounds nicely
      const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [selectedRoute]);

  return (
    <div id="map" style={{ height: '100vh', width: '100%' }} />
  );
}
