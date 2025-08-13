export default function RouteCard({ route, isSelected, onSelect }) {
  const routeName = route.name || route.route_name || 'Unnamed Route';
  const routeEmoji = route.emoji || '🚌';
  const routeStatus = route.status || 'Available';
  const routeStops = route.pickup_dropoff_locations? route.pickup_dropoff_locations.map(loc=>loc.name_location) :[];
  const availableSeats = route.available_seats_today || 0;
  const totalBuses = route.total_buses || 0;
  const nextAvailable = route.next_available_slot || 'Unknown';

  const isBookable = !['Full', 'No Service'].includes(routeStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700';
      case 'Filling Up':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700';
      case 'Limited':
        return 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700';
      case 'Full':
        return 'bg-gray-400 cursor-not-allowed';
      case 'No Service':
        return 'bg-gray-300 cursor-not-allowed';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Available':
        return 'Book Now';
      case 'Filling Up':
        return 'Book Soon';
      case 'Limited':
        return 'Few Seats Left';
      case 'Full':
        return 'Fully Booked';
      case 'No Service':
        return 'No Service';
      default:
        return 'Select Route';
    }
  };

  return (
    <div
      onClick={() => isBookable && onSelect(route)}
      className={`border-2 rounded-lg p-4 transition duration-200 ease-in-out transform ${
        isSelected 
          ? 'border-purple-600 bg-purple-50 shadow-lg scale-102' 
          : 'border-gray-300 bg-white hover:shadow-md'
      } ${isBookable ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
    >
      <div className="flex justify-between items-center mb-2 text-base font-semibold">
        <span className="text-xl">{routeEmoji}</span>
        <div className="text-right">
          <div className="text-lg font-semibold">{routeName}</div>
          <div className="text-xs text-gray-500">{totalBuses} buses</div>
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-3">
        <div className="mb-1">Stops: {routeStops.length > 0 ? routeStops.join(' → ') : 'No stops available'}</div>
        <div className="flex justify-between items-center">
          <span>Available today: {availableSeats} seats</span>
          <span className="text-blue-600 font-medium">{nextAvailable}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          routeStatus === 'Available' ? 'bg-green-100 text-green-800' :
          routeStatus === 'Filling Up' ? 'bg-yellow-100 text-yellow-800' :
          routeStatus === 'Limited' ? 'bg-orange-100 text-orange-800' :
          routeStatus === 'Full' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {routeStatus}
        </span>

        {availableSeats > 0 && availableSeats <= 10 && (
          <span className="text-xs text-amber-600 font-medium">
            Only {availableSeats} left!
          </span>
        )}
      </div>

      <div
        className={`text-center rounded-md py-2 text-sm font-medium transition-colors ${
          getStatusColor(routeStatus)
        } ${isBookable ? 'text-white' : 'text-gray-500'}`}
      >
        {getStatusText(routeStatus)}
      </div>
    </div>
  );
}
