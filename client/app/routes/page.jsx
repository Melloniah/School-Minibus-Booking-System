
// combines everything

'use client';
import { useState, useEffect } from 'react';
import { routes } from '../../lib/routes';
import InteractiveMap from '../../components/InteractiveMap';
import RouteSearchBar from '../../components/RouteSearchBar';
import RouteList from '../../components/RouteList';
import RouteBookingForm from '../../components/RouteBookingForm';
import {useAuth} from '../../context/AuthContext'

export default function RouteMapPage() {
  const {user}= useAuth(); //confirming the user logged in
  const userId= user?.id;


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    const featured = routes.find(route => route.featured);
    setSelectedRoute(featured); // finds popular routes
  }, []);

  const filteredRoutes = searchTerm
    ? routes.filter(route => route.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : routes.filter(route => route.featured);

  return (
    <section className="flex flex-col lg:flex-row gap-6 px-4 py-6 min-h-screen bg-gray-50">
      {/* Left: Route Cards and Search */}
      <div className="w-full lg:w-1/4">
        <RouteSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          routes={routes}
          onSelectSuggestion={(route) => {
            setSelectedRoute(route);
            setSearchTerm(route.name);
          }}
        />
        <RouteList
          routes={filteredRoutes}
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
        />
      </div>

      {/* middle: Map */}
      <div className="w-full lg:w-2/4 h-[400px] lg:h-auto">
        <InteractiveMap
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          selectedRoute={selectedRoute}
        />
      </div>

       {/* Right: Booking Form */}
        <div className="w-full lg:w-1/4">
        <RouteBookingForm selectedRoute={selectedRoute} />
        </div>
    </section>
  );
}
