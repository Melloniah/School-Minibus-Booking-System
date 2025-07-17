
from flask import Blueprint
from controllers.routeController import (
    create_route,
    get_routes,
    get_route,
    update_route,
    delete_route
)

route_bp = Blueprint('route_bp', __name__)

route_bp.route('/routes', methods=['POST'])(routeController.create_route)

route_bp.route('/routes', methods=['GET'])(routeController.get_routes)

route_bp.route('/routes/<int:id>', methods=['GET'])(routeController.get_route)

route_bp.route('/routes/<int:id>', methods=['PUT'])(routeController.update_route)

route_bp.route('/routes/<int:id>', methods=['DELETE'])(routeController.delete_route)