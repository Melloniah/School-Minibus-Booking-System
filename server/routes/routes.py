
from flask import Blueprint
from controllers.routeController import (
    create_route,
    get_routes,
    get_route,
    update_route,
    delete_route
)

route_bp = Blueprint('routes', __name__)

route_bp.route('/', methods=['POST'])(create_route)

route_bp.route('/', methods=['GET'])(get_routes)

route_bp.route('/<int:id>', methods=['GET'])(get_route)

route_bp.route('/<int:id>', methods=['PUT'])(update_route)

route_bp.route('/<int:id>', methods=['DELETE'])(delete_route)