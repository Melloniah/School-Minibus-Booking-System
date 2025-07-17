from flask import Blueprint
from controllers.busController import (
    create_bus,
    get_buses,
    get_bus,
    update_bus,
    delete_bus
)


bus_bp = Blueprint('bus_bp', __name__)
    

bus_bp.route('/buses', methods=['POST'])(busController.create_bus)
bus_bp.route('/buses', methods=['GET'])(busController.get_buses)
bus_bp.route('/buses/<int:id>', methods=['GET'])(busController.get_bus)
bus_bp.route('/buses/<int:id>', methods=['PUT'])(busController.update_bus)
bus_bp.route('/buses/<int:id>', methods=['DELETE'])(busController.delete_bus)