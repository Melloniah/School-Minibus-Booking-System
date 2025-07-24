from flask import Blueprint
from controllers.pickup_dropoff_controller import (
    create_location,
    get_all_location,
    get_location,
    update_location,
    delete_location,
    get_locations_by_route
)

pickup_bp = Blueprint('location', __name__)
pickup_dropoff_bp = Blueprint('pickup_dropoff', __name__)

pickup_bp.route('/', methods=['POST'])(create_location)
pickup_bp.route('/', methods=['GET'])(get_all_location)
pickup_bp.route('/<int:id>', methods=['GET'])(get_location)
pickup_bp.route('/<int:id>', methods=['PUT'])(update_location)
pickup_bp.route('/<int:id>', methods=['DELETE'])(delete_location)
pickup_bp.route('/', methods=['GET'])(get_locations_by_route)