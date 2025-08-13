from flask import Blueprint
from controllers.busController import (
    create_bus,
    get_buses,  # Use the unified function
    get_bus,
    update_bus,
    delete_bus
)

bus_bp = Blueprint('buses', __name__)
    
bus_bp.route('/', methods=['POST'])(create_bus)
bus_bp.route('/', methods=['GET'])(get_buses)  # This handles ?route_id=4 perfectly using the unified function. 
bus_bp.route('/<int:id>', methods=['GET'])(get_bus) 
bus_bp.route('/<int:id>', methods=['PUT'])(update_bus)
bus_bp.route('/<int:id>', methods=['DELETE'])(delete_bus)