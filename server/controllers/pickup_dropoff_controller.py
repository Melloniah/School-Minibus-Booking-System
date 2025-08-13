# controllers/pickup_dropoff_controller.py
from flask import request, jsonify
from middleware.authMiddleware import jwt_protected # Keep this import as other functions still use it
from models.pickup_dropoff_location import Pickup_Dropoff_Location
from models import db

@jwt_protected(role='admin')
def create_location(current_admin):
    """Creates a new pickup/drop-off location (admin only)."""
    data = request.get_json()
    loc = Pickup_Dropoff_Location(
        name_location=data['name_location'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        route_id=data['route_id']
        )

    db.session.add(loc)
    db.session.commit()
    return jsonify(loc.serialize()),201

# Unprotected: Allows anyone to view all pickup/drop-off locations
def get_all_location():
    """Retrieves all pickup/drop-off locations."""
    loc = Pickup_Dropoff_Location.query.all()
    return jsonify([l.serialize() for l in loc]), 200

# Unprotected: Allows anyone to view a single pickup/drop-off location by ID
def get_location(id):
    """Retrieves a single pickup/drop-off location by ID."""
    loc = Pickup_Dropoff_Location.query.get(id)
    if not loc:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(loc.serialize()),200

@jwt_protected(role='admin')
def update_location(current_admin,id):
    """Updates an existing pickup/drop-off location (admin only)."""
    loc = Pickup_Dropoff_Location.query.get(id)
    if not loc:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json()
    for key in ['name_location', 'latitude', 'longitude', 'route_id']:
        if key in data:
            setattr(loc, key, data[key])
    db.session.commit()
    return jsonify(loc.serialize()), 200


@jwt_protected(role='admin')
def delete_location(current_admin,id):
    """Deletes a pickup/drop-off location (admin only)."""
    loc = Pickup_Dropoff_Location.query.get(id)
    if not loc:
        return jsonify({'error': 'Not found'}), 404
    db.session.delete(loc)
    db.session.commit()
    return jsonify({'message': 'deleted'}), 200

# This function was already public in your original code, no changes needed here.
def get_locations_by_route():
    """Retrieves pickup/drop-off locations filtered by route ID."""
    route_id = request.args.get('route_id')

    if not route_id:
        return jsonify({'error': 'route_id parameter is required'}), 400

    try:
        route_id_int = int(route_id)
    except ValueError:
        return jsonify({'error': 'Invalid route_id'}), 400

    # Fetch all stops for the given route
    locations = Pickup_Dropoff_Location.query.filter_by(route_id=route_id_int).all()

    return jsonify([loc.serialize() for loc in locations]), 200
