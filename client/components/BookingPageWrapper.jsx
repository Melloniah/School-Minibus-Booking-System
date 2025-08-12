'use client';

import {  useState } from 'react';
import BookingForm from './BookingForm';
import InteractiveMap from './InteractiveMap';

export default function BookingPageWrapper() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[700px]">
      <div className="col-span-1 p-4 border rounded shadow overflow-auto">
      <BookingForm
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
        stops={stops}
        setStops={setStops}
      />
      </div>
      <div className="col-span-1 md:col-span-2 rounded overflow-hidden border shadow pr-0 md:pr-8 h-[400px] md:h-full">
      <InteractiveMap
        selectedRoute={selectedRoute}
        stops={stops}
      />
    </div>
    </div>
  );
}
