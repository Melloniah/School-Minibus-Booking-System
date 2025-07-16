# Defines routes like POST /api/auth/register and POST /login.
from flask import Blueprint;
from controllers.authController import (register_user)

# Registering a new user
registration_bp = Blueprint('register', __name__)
registration_bp.route('/', methods=['POST'])(register_user)

