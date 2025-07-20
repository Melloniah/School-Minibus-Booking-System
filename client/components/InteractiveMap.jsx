'use client';

import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 1.2860, // Kencom
  lng: 36.8257,
};

export default function InteractiveMap({ selectedRoute }) {
  const [activeStopIndex, setActiveStopIndex] = useState(null);

  const polylineOptions = {
    strokeColor: '#8b5cf6', // purple
    strokeOpacity: 1,
    strokeWeight: 4,
    icons: [
      {
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4,
        },
        offset: '0',
        repeat: '20px',
      },
    ],
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {selectedRoute && selectedRoute.coordinates.length > 0 && (
          <>
            {/* Polyline */}
            <Polyline
              path={selectedRoute.coordinates}
              options={polylineOptions}
            />

            {/* Markers */}
            {selectedRoute.coordinates.map((coord, idx) => (
              <Marker
                key={idx}
                position={coord}
                onClick={() => setActiveStopIndex(idx)}
              />
            ))}

            {/* InfoWindows */}
            {activeStopIndex !== null && (
              <InfoWindow
                position={selectedRoute.coordinates[activeStopIndex]}
                onCloseClick={() => setActiveStopIndex(null)}
              >
                <div>
                  {selectedRoute.stops[activeStopIndex] || `Stop ${activeStopIndex + 1}`}
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
