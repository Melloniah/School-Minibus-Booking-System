from flask import request, jsonify
from middleware.authMiddleware import jwt_protected
from models.pickup_dropoff_location import Pickup_Dropoff_Location
from models import db 

@jwt_protected(role='admin')
def create_location(current_admin):
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

@jwt_protected()
def get_all_location(current_user_or_admin):
    loc = Pickup_Dropoff_Location.query.all()
    return jsonify([l.serialize() for l in loc]), 200

@jwt_protected()
def get_location(current_user_or_admin,id):
    loc = Pickup_Dropoff_Location.query.get(id)
    if not loc:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(loc.serialize()),200

@jwt_protected(role='admin')
def update_location(current_admin,id):
    loc = Pickup_Dropoff_Location.query.get(id)
    if not loc:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json()
    for key in ['name_location', 'latitude', 'longitude' 'route_id']:
        if key in data:
            setattr(loc, key, data[key])
            db.session.commit()
            return jsonify(loc.serialize()), 200

@jwt_protected(role='admin')
def delete_location(current_admin,id):
    loc = Pickup_Dropoff_Location.query.get(id)
    if not loc:
        return jsonify({'error': 'Not found'}), 404
    db.session.delete(loc)
    db.session.commit()
    return jsonify({'message': 'deleted'}), 200

@jwt_protected()
def get_locations_by_route(current_user_or_admin):
    route_id = request.args.get('route_id')

    if not route_id:
        return jsonify({'error': 'Route ID is required'}), 400

    locations = Pickup_Dropoff_Location.query.filter_by(routeid=route_id).all()

    return jsonify([loc.serialize() for loc in locations]), 200

        
        