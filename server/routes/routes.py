
from flask import Blueprint
from controllers.routeController import (
    create_route,
    get_routes,
    get_route, 
    update_route,
    delete_route,
    get_route_detailed_status # This will be the primary GET for /<int:id>
)



route_bp = Blueprint('routes_bp', __name__)

# NEW public route so that users can access the routes before signup. 
route_bp.route('/', methods=['GET'])(get_routes)

route_bp.route('/', methods=['POST'])(create_route) 

# route_bp.route('/<int:id>', methods=['GET'])(get_route)

route_bp.route('/<int:id>', methods=['PUT'])(update_route)

route_bp.route('/<int:id>', methods=['DELETE'])(delete_route)

route_bp.route('/<int:id>', methods=['GET'])(get_route_detailed_status)