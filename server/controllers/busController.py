#Logic for creating bookings, calculating total price, and managing associations.
from flask import request, jsonify
from models.Booking import Booking
from models import db
from datetime import datetime 

# create a new booking 
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

        if seats_booked <= 0:
            return jsonify({'error': 'seats_booked must be at least 1'}),400
        if price <= 0:
            return jsonify({'error': 'price must be greater than o'}),400

        new_booking = Booking(
            user_id=user_id,
            bus_id=bus_id,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            seats_booked=seats_booked,
            booking_date=booking_date,
            price=price
        )

        db.session.add(new_booking)
        db.sesssion.commit()
        return jsonify(new_booking.serialize()),201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}),400

# GET all bookings
def get_all_bookings():
    try:
        bookings = Booking.query.all()
        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET booking by ID
def get_booking_by_id(id):
    try:
        booking = Booking.query.get(id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        return jsonify(booking.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a booking
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