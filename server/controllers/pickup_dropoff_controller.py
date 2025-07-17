from flask import request, jsonify
from models.pickup_dropoff_location import Pickup_Dropoff_Location
from middleware.authMiddleware import jwt_protected
from models import db 

@jwt_protected
def create_location():
    data = request.get_json()
    loc = Pickup_Dropoff_Location(
        name_location=data['name_location']
        GPSystem=data['GPSystem']
        route_id=data['route_id']
    )
    db.session.add(loc)
    db.session.commit()
    return jsonify(loc.serialize()),201

    
    def get_all_location():
        loc = Pickup_Dropoff_Location.query.all()
        return jsonify([l.serialize() for l in locs]), 200

    def get_location(id):
        loc = Pickup_Dropoff_Location.query.get(id)
        if not loc:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(loc.serialize()),200

    def update_location(id):
        loc = Pickup_Dropoff_Location.query.get(id)
        if not loc:
            return jsonify({'error': 'Not found'}), 404
        data = request.get_json()
        for key in ['name_location', 'GPSystem', 'route_id']:
            if key in date:
                setattr(loc, key, data[key])
            db.session.commit()
            return jsonify(loc.serialize()), 200

    def delete_location(id):
        los = Pickup_Dropoff_Location.query.get(id)
        if not loc:
            return jsonify({'error': 'Not found'}), 404
        db.session.delete(loc)
        db.session.commit()
        return jsonify({'message': 'deleted'}), 200
        
        