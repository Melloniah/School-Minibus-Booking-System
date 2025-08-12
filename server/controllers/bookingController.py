# Logic for creating bookings, calculating total price, and managing associations.
from flask import request, jsonify
from flask_cors import cross_origin
from middleware.authMiddleware import jwt_protected
from models.booking import Booking
from models import db
from datetime import datetime 
from models.bus import Bus 
from models.user import User
from models.pickup_dropoff_location import Pickup_Dropoff_Location
import math
from sqlalchemy import func 
import os

# Define allowed origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://school-minibus-booking-system.vercel.app"
]

# Add environment origin if set
env_origin = os.getenv("FRONTEND_ORIGIN")
if env_origin and env_origin not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(env_origin)

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
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
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
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_protected()
def create_booking(current_user_or_admin):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    try:
        # Validate required fields (REMOVED user_email)
        required_fields = ['bus_id', 'pickup_location', 'dropoff_location', 'seats_booked', 'booking_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Get user from JWT token (REMOVED user_email lookup)
        user_id = current_user_or_admin.id 
        
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
            return jsonify({'error': 'Invalid pickup or dropoff location'}), 400

        if pu.route_id != do.route_id:
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
        
        # Return booking without user_id for regular users
        booking_data = new_booking.serialize()
        if not current_user_or_admin.is_admin:
            booking_data.pop('user_id', None)
        
        return jsonify(booking_data), 201

    except KeyError as e:
        db.session.rollback()
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# GET all bookings (Admin only - with user names)
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_protected()
def get_all_bookings(current_user_or_admin):
    try:
        # Only admins can access all bookings
        if not current_user_or_admin.is_admin:
            return jsonify({'error': 'Access denied. Admin privileges required.'}), 403
            
        # Join bookings with users to get user names
        bookings_with_users = db.session.query(Booking, User.username, User.email)\
            .join(User, Booking.user_id == User.id)\
            .all()
        
        result = []
        for booking, username, email in bookings_with_users:
            booking_data = booking.serialize()
            booking_data['user_name'] = username
            booking_data['user_email'] = email
            result.append(booking_data)
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET booking by ID
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_protected()
def get_booking_by_id(current_user_or_admin, id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
            
        # Check if user has permission to view this booking
        if not current_user_or_admin.is_admin and booking.user_id != current_user_or_admin.id:
            return jsonify({'error': 'Access denied'}), 403
            
        booking_data = booking.serialize()
        
        # Add user information for admins
        if current_user_or_admin.is_admin:
            user = User.query.get(booking.user_id)
            if user:
                booking_data['user_name'] = user.username
                booking_data['user_email'] = user.email
        else:
            # Remove user_id for regular users
            booking_data.pop('user_id', None)
            
        return jsonify(booking_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a booking
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_protected()
def delete_booking(current_user_or_admin, id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404

        # Check if user has permission to delete this booking
        if not current_user_or_admin.is_admin and booking.user_id != current_user_or_admin.id:
            return jsonify({'error': 'Access denied'}), 403

        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# GETTING bookings for current user (Users see only their bookings, Admins see all with user names)
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_protected()
def get_bookings_for_user(current_user_or_admin):
    try:
        if current_user_or_admin.is_admin:
            # Admin sees all bookings with user information
            bookings_with_users = db.session.query(Booking, User.name, User.email)\
                .join(User, Booking.user_id == User.id)\
                .all()
            
            result = []
            for booking, username, email in bookings_with_users:
                booking_data = booking.serialize()
                booking_data['user_name'] = username
                booking_data['user_email'] = email
                result.append(booking_data)
            
            return jsonify(result), 200
        else:
            # User sees only their own bookings without user_id
            bookings = Booking.query.filter_by(user_id=current_user_or_admin.id).all()
            result = []
            for booking in bookings:
                booking_data = booking.serialize()
                # Remove user_id from response for regular users
                booking_data.pop('user_id', None)
                result.append(booking_data)
            
            return jsonify(result), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500