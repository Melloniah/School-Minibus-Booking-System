# Booking endpoints (e.g., POST /api/bookings).
from flask import Blueprint;
from controllers.bookingController import (
    create_booking,
    get_all_bookings,
    get_booking_by_id,
    delete_booking,
    estimate_price
)

booking_bp = Blueprint('bookings', __name__)

# Route to create a new booking
booking_bp.route('/', methods=['POST'])(create_booking)
# Route to get all bookings
booking_bp.route('/', methods=['GET'])(get_all_bookings)
# Route to get one booking by ID
booking_bp.route('/<int:id>', methods=['GET'])(get_booking_by_id)
# Route to delete a booking by ID
booking_bp.route('/<int:id>', methods=['DELETE'])(delete_booking)
# Route to show price estimation before user submits
booking_bp.route('/estimate-price', methods=['POST'])(estimate_price) #front end will call /bookings/estimate-price

