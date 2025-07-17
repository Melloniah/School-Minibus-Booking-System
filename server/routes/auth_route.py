# Defines routes like POST /api/auth/register and POST /login.
from flask import Blueprint;
from controllers.authController import(register_user, login,read_cookie)

# Registering a new user
registration_bp = Blueprint('register', __name__)
registration_bp.route('/', methods=['POST'])(register_user)

login_bp = Blueprint('login', __name__)
login_bp.route('/', methods=['POST'])(login)

read_cookie_bp = Blueprint('cookie', __name__)   
registration_bp.route('/', methods=['GET'])(read_cookie)