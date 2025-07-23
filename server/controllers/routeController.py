from flask import request, jsonify
from models.route import Route
# from models.bus import Bus
from middleware.authMiddleware import jwt_protected
from models import db

@jwt_protected(role='admin')
def create_route(current_admin):
    data = request.json
    route = Route(route_name=data['route_name'])
    db.session.add(route)
    db.session.commit()
    return jsonify({'id': route.id, 'route_name': route.route_name}), 201

@jwt_protected()
def get_routes(current_user_or_admin):
    routes= Route.query.all()
    return jsonify([
         {'id': r.id, 'route_name': r.route_name}
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
        'route_name':route.route_name,
        'buses': buses
    })

@jwt_protected(role='admin')
def update_route(current_admin,id):
    route = Route.query.get_or_404(id)
    data = request.json
    if 'route_name' in data:
        route.route_name = data['route_name']
    db.session.commit()
    return jsonify({'id': route.id, 'route_name': route.route_name})

@jwt_protected(role='admin')
def delete_route(current_admin,id):
    route = Route.query.get_or_404(id)
    db.session.delete(route)
    db.session.commit()
    return jsonify({'message': 'Route deleted'})