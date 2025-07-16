#Logic for creating bookings, calculating total price, and managing associations.
from flask import request, jsonify
from models.Booking import Booking
from models import db
