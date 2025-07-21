# Defines routes like POST /api/auth/register and POST /login.
from flask import Blueprint
from controllers.authController import register_user, login, read_cookie

# Create blueprints
auth_bp = Blueprint('auth', __name__)

# Register routes
auth_bp.route('/register', methods=['POST'])(register_user)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/cookie', methods=['GET'])(read_cookie)