# Logic for creating bookings, calculating total price, and managing associations.
from flask import request, jsonify
from flask_cors import cross_origin
from middleware.authMiddleware import jwt_protected
from models.Booking import Booking
from models import db
from datetime import datetime 
from models.bus import Bus 
from models.user import User
from models.pickup_dropoff_location import Pickup_Dropoff_Location
import math
from sqlalchemy import func 

# Utility function for distance calculation
def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points on Earth (in km)"""
    R = 6371.0  # Earth's radius in kilometers
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)

    a = math.sin(Δφ/2)**2 + math.cos(φ1)*math.cos(φ2)*math.sin(Δλ/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_price(distance, seats_booked, rate_per_km=5):
    """Calculate booking price based on distance and seats"""
    return round(distance * rate_per_km * seats_booked, 2)

def seats_available(bus_id):
    """Calculate available seats for a bus"""
    bus = Bus.query.get(bus_id)
    if not bus:
        return 0
    
    booked = db.session.query(func.sum(Booking.seats_booked)) \
        .filter(Booking.bus_id == bus_id).scalar() or 0
    return bus.capacity - booked

# Price estimation endpoint
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def estimate_price():
    """Get price estimate for a journey"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Validate required fields
        required_fields = ['pickup_location', 'dropoff_location', 'seats_booked']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        pickup_location = data['pickup_location']
        dropoff_location = data['dropoff_location']
        seats_booked = int(data['seats_booked'])

        if seats_booked <= 0:
            return jsonify({'error': 'Seats must be a positive number'}), 400

        # Look up locations
        pu = Pickup_Dropoff_Location.query.filter_by(name_location=pickup_location).first()
        do = Pickup_Dropoff_Location.query.filter_by(name_location=dropoff_location).first()

        if not pu or not do:
            return jsonify({'error': 'Invalid pickup or dropoff location'}), 400

        if pu.route_id != do.route_id:
            return jsonify({'error': 'Pickup and dropoff locations must be on the same route'}), 400

        # Calculate distance and price
        distance = haversine(pu.latitude, pu.longitude, do.latitude, do.longitude)
        estimated_price = calculate_price(distance, seats_booked)

        return jsonify({
            "estimated_price": estimated_price,
            "distance": round(distance, 2),
            "rate_per_km": 5,
            "seats_booked": seats_booked
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create a new booking
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_protected()
def create_booking(current_user_or_admin):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    try:
        # Validate required fields
        required_fields = ['user_email', 'bus_id', 'pickup_location', 'dropoff_location', 'seats_booked', 'booking_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        user_email = data['user_email']
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_id = user.id
        bus_id = data['bus_id']
        pickup_location = data['pickup_location']
        dropoff_location = data['dropoff_location']
        seats_booked = int(data['seats_booked'])
        booking_date = datetime.strptime(data['booking_date'], "%Y-%m-%d").date()

        if seats_booked <= 0:
            return jsonify({'error': 'Seats must be a positive number'}), 400

        print("🔍 Step 5: Checking seat availability...")
        available = seats_available(bus_id)
        print(f"✅ Available seats: {available}")
        
        if seats_booked > available:
            print(f"❌ Not enough seats: requested {seats_booked}, available {available}")
            return jsonify({'error': f'Only {available} seats available'}), 400

        print("🔍 Step 6: Looking up locations...")
        pu = Pickup_Dropoff_Location.query.filter_by(name_location=pickup_location).first()
        do = Pickup_Dropoff_Location.query.filter_by(name_location=dropoff_location).first()
        
        print(f"🔍 Pickup location found: {pu is not None}")
        print(f"🔍 Dropoff location found: {do is not None}")

        if not pu or not do:
            print("❌ Location lookup failed")
            return jsonify({'error': 'Invalid pickup or dropoff location'}), 400

        if pu.route_id != do.route_id:
            print(f"❌ Route mismatch: pickup route {pu.route_id}, dropoff route {do.route_id}")
            return jsonify({'error': 'Pickup and dropoff locations must be on the same route'}), 400

        print("🔍 Step 7: Calculating price...")
        distance = haversine(pu.latitude, pu.longitude, do.latitude, do.longitude)
        total_price = calculate_price(distance, seats_booked)
        print(f"✅ Distance: {distance}km, Price: {total_price} KES")

        print("🔍 Step 8: Creating booking...")
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
        
        return jsonify(new_booking.serialize()), 201

    except KeyError as e:
        db.session.rollback()
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# GET all bookings
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_protected()
def get_all_bookings(current_user_or_admin):
    try:
        bookings = Booking.query.all()
        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET booking by ID
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_protected()
def get_booking_by_id(current_user_or_admin, id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        return jsonify(booking.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a booking
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_protected()
def delete_booking(current_user_or_admin, id):  # Added id parameter.
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

# GETTING booking by a specific user
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_protected()
def get_bookings_for_user(current_user_or_admin):
    try:
        if current_user_or_admin.is_admin:
            # Admin sees all bookings
            bookings = Booking.query.all()
        else:
            # User sees only their own bookings
            bookings = Booking.query.filter_by(user_id=current_user_or_admin.id).all()

        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
