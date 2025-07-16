# Booking endpoints (e.g., POST /api/bookings).
from flask import Blueprint;
from controllers.bookingController import (
    
)

booking_bp = Blueprint('booking_bp', __name__)

booking_bp.route('/', methods=['POST'])(create_booking)