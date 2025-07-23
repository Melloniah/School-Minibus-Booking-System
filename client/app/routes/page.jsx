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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoutes= searchTerm? 
  routes.filter(route=> route.name.toLowerCase(searchTerm.toLowerCase())
): routes;

  return (
    <div className="flex h-screen">
      {/* Left: Route List */}
      <div className="w-1/3 p-6 overflow-y-auto bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Available Routes</h1>
        <input
        type="text"
        placeholder='Search a route ...'
        className="mb-6 p-2 w-full border rounded"
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}

        />
        {filteredRoutes.map((route) => (
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
         <InteractiveMap
         apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
         selectedRoute={selectedRoute}
         />
      </div>
    </div>
  );
}
