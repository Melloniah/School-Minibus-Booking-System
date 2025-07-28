from flask import request, jsonify
from models.route import Route
# from models.bus import Bus
from models.pickup_dropoff_location import Pickup_Dropoff_Location 
from middleware.authMiddleware import jwt_protected
from models import db
import os
import requests # Import the requests library

GOOGLE_API_KEY = os.getenv('Maps_API_KEY')


def geocode_location(name):
    url = f'https://maps.googleapis.com/maps/api/geocode/json?address={name}&key={GOOGLE_API_KEY}'
    response = requests.get(url)
    data = response.json()

    if data['status'] == 'OK':
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None


@jwt_protected(role='admin')
# def create_route(current_admin):
def create_route(current_admin):
    data = request.get_json()
    # Validate required field
    if 'route_name' not in data:
        return jsonify({'error': 'Missing route_name'}), 400

    # Create new Route
    route = Route(route_name=data['route_name'])
    db.session.add(route)
    db.session.flush()  # Get route.id before committing

    # Handle locations
    locations = data.get('locations', [])
    for loc in locations:
        name = loc.get('name_location')
        if not name:
            continue  # Skip if name is missing

        # Use geocoding to get lat/lng from name
        lat, lng = geocode_location(name)
        if lat is None or lng is None:
            continue  # Skip if geocoding fails

        new_location = Pickup_Dropoff_Location(
            name_location=name,
            latitude=lat,
            longitude=lng,
            route_id=route.id
        )
        db.session.add(new_location)

    db.session.commit()

    # Serialize response
    return jsonify({
        'id': route.id,
        'route_name': route.route_name,
        'locations': [loc.serialize() for loc in route.pickup_dropoff_locations]
    }), 201

    

@jwt_protected()
def get_routes(current_user_or_admin):
    routes = Route.query.all()
    return jsonify([
        {
            'id': r.id,
            'route_name': r.route_name,
            'stops': [loc.name_location for loc in r.pickup_dropoff_locations]
        }
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