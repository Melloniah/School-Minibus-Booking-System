
// combines everything

'use client';
import { useState, useEffect } from 'react';
import { routes } from '../../lib/routes';
import InteractiveMap from '../../components/InteractiveMap';
import RouteSearchBar from '../../components/RouteSearchBar';
import RouteList from '../../components/RouteList';

export default function RouteMapPage() {
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
    <section className="min-h-screen flex flex-col p-6 lg:flex-row gap-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Left: Route Cards and Search */}
      <div className="flex-[2]">
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

      {/* Right: Map */}
      <div className="flex-[3] h-[400px] lg:h-auto lg:min-h-full rounded-lg shadow-xl overflow-hidden">
        <InteractiveMap
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          selectedRoute={selectedRoute}
        />
      </div>
    </section>
  );
}
