from flask import request, jsonify
from models.route import Route
# from models.bus import Bus
from models.pickup_dropoff_location import Pickup_Dropoff_Location 
from middleware.authMiddleware import jwt_protected
from models import db

@jwt_protected(role='admin')
def create_route(current_admin):
    data = request.get_json()

    # Validate required fields
    if 'route_name' not in data:
        return jsonify({'error': 'Missing route_name'}), 400

    route = Route(route_name=data['route_name'])
    db.session.add(route)
    db.session.flush()  # Get route.id before commit

    # Handle locations if provided
    locations = data.get('locations', [])
    for loc in locations:
        if 'name_location' not in loc:
            continue  # Skip invalid entries
        pickup = Pickup_Dropoff_Location(
            name_location=loc['name_location'],
            GPSystem=loc.get('GPSystem', ''),
            routeid=route.id
        )
        db.session.add(pickup)

    db.session.commit()

    return jsonify({
        'id': route.id,
        'route_name': route.route_name,
        'locations': [
            loc.serialize() for loc in route.pickup_dropoff_locations
        ]
    }), 201

# @jwt_protected()
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