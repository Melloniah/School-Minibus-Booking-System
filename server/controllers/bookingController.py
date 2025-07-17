#Logic for creating bookings, calculating total price, and managing associations.
from flask import request, jsonify
from middleware.authMiddleware import jwt_protected
from models.Booking import Booking
from models import db
from datetime import datetime 
from models.bus import Bus 
from models.pickup_dropoff_location import Pickup_Dropoff_Location
import math
from sqlalchemy import func 

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)

    a = math.sin(Δφ/2)**2 + math.cos(φ1)*math.cos(φ2)*math.sin(Δλ/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def seats_available(bus_id):
    bus = Bus.query.get(bus_id)
    booked = db.session.query(func.sum(Booking.seats_booked)) \
        .filter(Booking.bus_id == bus_id).scalar() or 0
    return bus.capacity - booked
# create a new booking 
@jwt_protected()
def create_booking():
    data = request.get_json()
    try:
        user_id = data['user_id']
        bus_id = data['bus_id']
        pickup_location = data['pickup_location']
        dropoff_location = data['dropoff_location']
        seats_booked = int(data['seats_booked'])
        booking_date = datetime.strptime(data['booking_date'], "%Y-%m-%d").date()
        price = float(data['price'])

        if seats_booked <= 0 or price <= 0:
            return jsonify({'error': 'Seats and price must be positive'}), 400

        available = seats_available(bus_id)
        if seats_booked > available:
            return jsonify({'error': f'Only {available} seats available'}), 400
        # Look GPS coordinates
        pu = Pickup_Dropoff_Location.query.filter_by(name_location=pickup_name).first()
        do = Pickup_Dropoff_Location.query.filter_by(name_location=dropoff_name).first()
        if not pu or not do:
            return jsonify({'error': 'Invalid pickup/dropoff location'}),400
        lat1, lon1 = map(float, pu.GPSystem.split(",")) 
        lat2, lon2 = map(float, do.GPSystem.split(","))

        # caculate price
        distance = haversine(lat1, lon1, lat2, lon2)
        rate = 1.25 # KES per km
        total_price = round(distance * rate * seats, 2)

        new_booking = Booking(
            user_id=user_id,
            bus_id=bus_id,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            seats_booked=seats_booked,
            booking_date=booking_date,
            price=total_price
        )

        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.serialize()),201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}),400

# GET all bookings
@jwt_protected()
def get_all_bookings():
    try:
        bookings = Booking.query.all()
        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET booking by ID
@jwt_protected()
def get_booking_by_id(id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        return jsonify(booking.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a booking
@jwt_protected()
def delete_booking(id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404

        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
