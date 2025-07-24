'use client';

import { useState } from 'react';
import BookingForm from '../../components/BookingForm';
import InteractiveMap from '../../components/InteractiveMap';

export default function BookSeatPage() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Handler to pass down to BookingForm so it can update selectedRoute here
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 gap-6 max-w-7xl mx-auto">
      {/* Left: Booking Form */}
      <div className="md:w-1/2">
        <BookingForm onRouteSelect={handleRouteSelect} />
      </div>

      {/* Right: Interactive Map */}
      <div className="md:w-1/2 h-[600px] rounded-lg overflow-hidden shadow-lg">
        <InteractiveMap route={selectedRoute} />
      </div>
    </div>
  );
}
