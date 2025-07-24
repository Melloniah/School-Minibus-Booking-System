# Defines routes like POST /api/auth/register and POST /login.
from flask import Blueprint
from controllers.authController import register_user, login, get_current_user, logout


# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Register routes
auth_bp.route('/register', methods=['POST'])(register_user)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/current_user', methods=['GET'])(get_current_user)
auth_bp.route('/logout', methods=['POST'])(logout)