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
def create_booking(current_user_or_admin):
    print("🔥 CREATE_BOOKING FUNCTION CALLED")
    
    # Debug: Check request data
    print(f"🔍 Request method: {request.method}")
    print(f"🔍 Content-Type: {request.content_type}")
    print(f"🔍 Raw data: {request.data}")
    
    data = request.get_json()
    print(f"🔍 Parsed JSON data: {data}")
    print(f"🔍 Data type: {type(data)}")
    
    if not data:
        print("❌ No JSON data received")
        return jsonify({'error': 'No JSON data provided'}), 400
    
    try:
        print("🔍 Step 1: Extracting user_id...")
        user_id = data['user_id']
        print(f"✅ User ID: {user_id}")
        
        print("🔍 Step 2: Extracting bus_id...")
        bus_id = data['bus_id']
        print(f"✅ Bus ID: {bus_id}")
        
        print("🔍 Step 3: Extracting locations...")
        pickup_location = data['pickup_location']
        dropoff_location = data['dropoff_location']
        print(f"✅ Pickup: {pickup_location}, Dropoff: {dropoff_location}")
        
        print("🔍 Step 4: Extracting seats and date...")
        seats_booked = int(data['seats_booked'])
        booking_date = datetime.strptime(data['booking_date'], "%Y-%m-%d").date()
        print(f"✅ Seats: {seats_booked}, Date: {booking_date}")

        if seats_booked <= 0:
            print("❌ Invalid seats number")
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
        lat1, lon1 = pu.latitude, pu.longitude
        lat2, lon2 = do.latitude, do.longitude
        distance = haversine(lat1, lon1, lat2, lon2)
        rate = 5
        total_price = round(distance * rate * seats_booked, 2)
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

        print("🔍 Step 9: Saving to database...")
        db.session.add(new_booking)
        db.session.commit()
        print("✅ Booking saved successfully!")
        
        return jsonify(new_booking.serialize()), 201

    except KeyError as e:
        print(f"❌ KeyError - Missing field: {e}")
        db.session.rollback()
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except ValueError as e:
        print(f"❌ ValueError - Invalid data format: {e}")
        db.session.rollback()
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        print(f"❌ Unexpected error: {type(e).__name__}: {str(e)}")
        print(f"❌ Error details: {repr(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
# GET all bookings
@jwt_protected()
def get_all_bookings(current_user_or_admin):
    try:
        bookings = Booking.query.all()
        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET booking by ID
@jwt_protected()
def get_booking_by_id(current_user_or_admin,id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        return jsonify(booking.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a booking
@jwt_protected()
def delete_booking(current_user_or_admin):
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
