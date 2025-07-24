# Booking endpoints (e.g., POST /api/bookings).
from flask import Blueprint;
from controllers.bookingController import (
    create_booking,
    get_all_bookings,
    get_booking_by_id,
    delete_booking
)

booking_bp = Blueprint('bookings', __name__)
# route to create a new booking
booking_bp.route('/', methods=['POST'])(create_booking)
# Route to gt all booking
booking_bp.route('/', methods=['GET'])(get_all_bookings)

# Route to get one booking by ID
booking_bp.route('/<int:id>', methods=['GET'])(get_booking_by_id)

# Route to delete a booking by Id
booking_bp.route('/<int:id>', methods=['DELETE'])(delete_booking)