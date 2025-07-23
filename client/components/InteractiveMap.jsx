'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -1.2860,
  lng: 36.8257,
};

export default function InteractiveMap({ apiKey, selectedRoute }) {
  const [activeStopIndex, setActiveStopIndex] = useState(null);
  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (selectedRoute?.coordinates?.length && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      selectedRoute.coordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds);
    }
  }, [selectedRoute]);

  const polylineOptions = {
    strokeColor: '#8b5cf6',
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

  return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={13}
            onLoad={onLoad}
        >
          {selectedRoute?.coordinates?.length > 0 && (
              <>
                <Polyline path={selectedRoute.coordinates} options={polylineOptions} />
                {selectedRoute.coordinates.map((coord, idx) => (
                    <Marker
                        key={idx}
                        position={coord}
                        onClick={() => setActiveStopIndex(idx)}
                        icon={{
                          url: '/school-busIcon-32.png', // Bus icon URL
                          scaledSize: new window.google.maps.Size(32, 32),      
                          }}
                    />
                ))}
                {activeStopIndex !== null && (
                    <InfoWindow
                        position={selectedRoute.coordinates[activeStopIndex]}
                        onCloseClick={() => setActiveStopIndex(null)}
                    >
                      <div>
                        {selectedRoute.stops?.[activeStopIndex] || `Stop ${activeStopIndex + 1}`}
                      </div>
                    </InfoWindow>
                )}
              </>
          )}
        </GoogleMap>
  );
}