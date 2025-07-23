

// for individual individual route card
export default function RouteCard({ route, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(route)}
      className={`cursor-pointer border-2 rounded-lg p-4 transition duration-200 ease-in-out transform ${
        isSelected ? 'border-purple-600 bg-purple-50 shadow-lg scale-102' : 'border-gray-300 bg-white'
      }`}
    >
      <div className="flex justify-between items-center mb-2 text-base font-semibold">
        <span className="text-xl">{route.emoji}</span>
        <span>{route.name}</span>
      </div>
      <div className="text-xs text-gray-600 mb-2">Stops: {route.stops.join(' → ')}</div>
      <div
        className={`mt-3 text-center rounded-md py-1 text-sm font-medium ${
          route.status === 'Full'
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 cursor-pointer'
        }`}
      >
        {route.status === 'Full' ? 'Route Full' : 'Select Route'}
      </div>
    </div>
  );
}