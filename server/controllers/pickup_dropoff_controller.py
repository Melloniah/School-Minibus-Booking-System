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
    for key in ['name_location', 'latitude', 'longitude', 'route_id']:
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

from flask import request, jsonify
from middleware.authMiddleware import jwt_protected
from models.pickup_dropoff_location import Pickup_Dropoff_Location
from models import db

@jwt_protected()
def get_locations_by_route(current_user_or_admin):
    print("🔥 FUNCTION CALLED: get_locations_by_route")
    
    route_id = request.args.get('route_id')
    print(f"🔍 Step 1: Raw route_id from request: '{route_id}' (type: {type(route_id)})")
    
    if not route_id:
        return jsonify({'error': 'route_id parameter is required'}), 400
    
    try:
        route_id_int = int(route_id)

    except ValueError:
        return jsonify({'error': 'Invalid route_id'}), 400
    
   
    all_locations = Pickup_Dropoff_Location.query.all()
   
    filtered_locations = Pickup_Dropoff_Location.query.filter_by(route_id=route_id_int).all()
   
    route_ids_in_db = [loc.route_id for loc in all_locations]
    
    manual_filter = [loc for loc in all_locations if loc.route_id == route_id_int]
   
    
   
    for i, loc in enumerate(filtered_locations):
        print(f"  Location {i+1}: ID={loc.id}, Name='{loc.name_location}', RouteID={loc.route_id}")
   
    result = [loc.serialize() for loc in filtered_locations]
    
    return jsonify(result), 200