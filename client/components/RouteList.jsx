

// brings all cards, filtered)

import RouteCard from './RouteCard'; 

export default function RouteList({ routes, selectedRoute, onSelectRoute }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-left text-purple-700 mb-2"> Popular Routes</h3>
      {routes.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          We currently do not offer services to that area.
        </p>
      ) : (
        routes.map(route => (
          <RouteCard
            key={route.id}
            route={route}
            isSelected={selectedRoute?.id === route.id}
            onSelect={onSelectRoute}
          />
        ))
      )}
    </div>
  );
}