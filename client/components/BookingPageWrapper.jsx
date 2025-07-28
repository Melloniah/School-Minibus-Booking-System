'use client';

import {  useState } from 'react';
import BookingForm from './BookingForm';
import InteractiveMap from './InteractiveMap';

export default function BookingPageWrapper() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BookingForm
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
        stops={stops}
        setStops={setStops}
      />
      <InteractiveMap
        selectedRoute={selectedRoute}
        stops={stops}
      />
    </div>
  );
}
