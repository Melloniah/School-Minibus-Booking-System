from flask import request, jsonify
from models.route import Route
from middleware.authMiddleware import jwt_protected
from models.bus import Bus  
from models import db

@jwt_protected(role='admin')
def create_bus(current_admin):
    data = request.json
    if not Route.query.get(data['routeid']):
        return jsonify({'error': 'Route not found'}), 400
    bus = Bus(routeid=data['routeid'], numberplate=data['numberplate'], capacity=data['capacity'])
    db.session.add(bus)
    db.session.commit()
    return jsonify({'id': bus.id, 'routeid': bus.routeid, 'numberplate': bus.numberplate, 'capacity': bus.capacity}), 201

# @jwt_protected()  # Both users and admins can access
def get_buses(current_user_or_admin):
    routeid = request.args.get('route_id')
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    query = Bus.query
    if routeid:
        query = query.filter_by(routeid=routeid)
    if origin or destination:
        query = query.join(Route)
        if origin:
            query = query.filter(Route.origin == origin)
        if destination:
            query = query.filter(Route.destination == destination)
    buses = query.all()
    return jsonify([
        {'id': b.id, 'routeid': b.routeid, 'numberplate': b.numberplate, 'capacity': b.capacity}
        for b in buses
    ])

# @jwt_protected()  # Both users and admins can access
def get_bus(current_user_or_admin, id):
    bus = Bus.query.get_or_404(id)
    return jsonify({'id': bus.id, 'routeid': bus.routeid, 'numberplate': bus.numberplate, 'capacity': bus.capacity})

@jwt_protected(role='admin')
def update_bus(current_admin, id):
    bus = Bus.query.get_or_404(id)
    data = request.json
    if 'routeid' in data:
        if not Route.query.get(data['routeid']):
            return jsonify({'error': 'Route not found'}), 400
        bus.routeid = data['routeid']
    if 'numberplate' in data:
        bus.numberplate = data['numberplate']
    if 'capacity' in data:
        bus.capacity = data['capacity']
    db.session.commit()
    return jsonify({'id': bus.id, 'routeid': bus.routeid, 'numberplate': bus.numberplate, 'capacity': bus.capacity})

@jwt_protected(role='admin')
def delete_bus(current_admin, id):
    bus = Bus.query.get_or_404(id)
    db.session.delete(bus)
    db.session.commit()
    return jsonify({'message': 'Bus deleted'})


# @jwt_protected()
def get_buses_by_route(current_user_or_admin):
    route_id = request.args.get('route_id')
    if not route_id:
        return jsonify({'error': 'Route ID is required'}), 400
    
    buses = Bus.query.filter_by(routeid=route_id).all()
    today = datetime.now().date()
    
    result = []
    for bus in buses:
        todays_bookings = db.session.query(func.sum(Booking.seats_booked)).filter(
            Booking.bus_id == bus.id,
            Booking.booking_date == today
        ).scalar() or 0
        
        available_seats = max(0, bus.capacity - todays_bookings)
        
        result.append({
            'id': bus.id,
            'numberplate': bus.numberplate,
            'capacity': bus.capacity,
            'current_bookings': todays_bookings,
            'available_seats': available_seats,
            'status': 'Full' if available_seats == 0 else 'Available'
        })
    
    return jsonify(result)