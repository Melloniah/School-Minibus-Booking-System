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

@jwt_protected()  # Both users and admins can access
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

@jwt_protected()  # Both users and admins can access
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
