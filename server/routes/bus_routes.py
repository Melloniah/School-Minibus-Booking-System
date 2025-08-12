from flask import Blueprint
from controllers.busController import (
    create_bus,
    get_buses,
    get_bus,
    update_bus,
    delete_bus, 
    get_buses_by_route
)


bus_bp = Blueprint('buses', __name__)
    
bus_bp.route('/', methods=['POST'])(create_bus)
bus_bp.route('/', methods=['GET'])(get_buses)
bus_bp.route('<int:id>', methods=['GET'])(get_bus)
bus_bp.route('/<int:id>', methods=['PUT'])(update_bus)
bus_bp.route('/<int:id>', methods=['DELETE'])(delete_bus)
bus_bp.route('/', methods=['GET'])(get_buses_by_route)
