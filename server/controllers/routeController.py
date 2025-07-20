from flask import request, jsonify
from models.route import Route
# from models.bus import Bus
from middleware.authMiddleware import jwt_protected
from models import db

@jwt_protected(role='admin')
def create_route(current_admin):
    data = request.json
    route = Route(origin=data['origin'], destination=data['destination'])
    db.session.add(route)
    db.session.commit()
    return jsonify({'id': route.id, 'origin': route.origin, 'destination': route.destination}), 201

@jwt_protected()
def get_routes(current_user_or_admin):
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    query = Route.query
    if origin:
        query = query.filter_by(origin=origin)
    if destination:
        query = query.filter_by(destination=destination)
    routes = query.all()
    return jsonify([
        {'id': r.id, 'origin': r.origin, 'destination': r.destination}
        for r in routes
    ])

@jwt_protected()
def get_route(current_user_or_admin,id):
    route = Route.query.get_or_404(id)
    buses = [
        {'id': b.id, 'numberplate': b.numberplate, 'capacity': b.capacity}
        for b in route.buses
    ]
    return jsonify({
        'id': route.id,
        'origin': route.origin,
        'destination': route.destination,
        'buses': buses
    })

@jwt_protected(role='admin')
def update_route(current_admin,id):
    route = Route.query.get_or_404(id)
    data = request.json
    if 'origin' in data:
        route.origin = data['origin']
    if 'destination' in data:
        route.destination = data['destination']
    db.session.commit()
    return jsonify({'id': route.id, 'origin': route.origin, 'destination': route.destination})

@jwt_protected(role='admin')
def delete_route(current_admin,id):
    route = Route.query.get_or_404(id)
    db.session.delete(route)
    db.session.commit()
    return jsonify({'message': 'Route deleted'})