"use client";
import { useState } from 'react';
import { routes } from '../../lib/routes';
import InteractiveMap from '../../components/InteractiveMap';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`border border-gray-300 rounded-lg shadow-sm p-4 cursor-pointer transition hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default function RouteMapPage() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Left: Route List */}
      <div className="w-1/3 p-6 overflow-y-auto bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Available Routes</h1>
        {routes.map((route) => (
          <Card
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            className={selectedRoute?.id === route.id ? 'bg-blue-200' : 'bg-white'}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>{route.emoji}</span> {route.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{route.description}</p>
          </Card>
        ))}
      </div>

      {/* Right: Interactive Map */}
      <div className="w-2/3">
        <InteractiveMap selectedRoute={selectedRoute} />
      </div>
    </div>
  );
}
