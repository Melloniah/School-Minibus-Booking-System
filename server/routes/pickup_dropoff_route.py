from flask import Blueprint
from controllers.pickup_dropoff_contoller import (
    create_location,
    get_all_location,
    get_location,
    update_location,
    delete_location
)

pickup_bp = Blueprint('pickup_bp' __name__)

pickup_bp.route('/locations' methods=['POST'])(create_location)
pickup_bp.route('/locations', methods=['GET'])(get_all_locations)
pickup_bp.route('/locations/<int:id>', methods=['GET'])(get_location)
pickup_bp.route('/locations/<int:id>', methods=['PUT'])(update_location)
pickup_bp.route('/locations/<int:id>', methods=['DELETE'])(delete_location)