from flask import request, jsonify
from models.route import Route
from models.bus import Bus
from models import db

def create_route():
    data = request.json
    route = Route(origin=data['origin'], destination=data['destination'])
    db.session.add(route)
    db.session.commit()
    return jsonify({'id': route.id, 'origin': route.origin, 'destination': route.destination}), 201

def get_routes():
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

def get_route(id):
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

def update_route(id):
    route = Route.query.get_or_404(id)
    data = request.json
    if 'origin' in data:
        route.origin = data['origin']
    if 'destination' in data:
        route.destination = data['destination']
    db.session.commit()
    return jsonify({'id': route.id, 'origin': route.origin, 'destination': route.destination})

def delete_route(id):
    route = Route.query.get_or_404(id)
    db.session.delete(route)
    db.session.commit()
    return jsonify({'message': 'Route deleted'})