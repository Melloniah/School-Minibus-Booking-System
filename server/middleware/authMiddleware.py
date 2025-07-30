from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.user import User
from models.admin import Admin
from functools import wraps
from flask import jsonify
import os

# Import cross_origin differently
try:
    from flask_cors import cross_origin
except ImportError:
    print("Flask-CORS not available")
    cross_origin = None

# Define allowed origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://school-minibus-booking-system.vercel.app"
]

# Add environment origin if set
env_origin = os.getenv("FRONTEND_ORIGIN")
if env_origin and env_origin not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(env_origin)

def jwt_protected(role=None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Apply CORS manually if cross_origin is available
            
            identity = get_jwt_identity()  
            claims = get_jwt()
            user_role = claims.get("role")

            current_user = None
            current_admin = None

            if user_role == 'admin':
                current_admin = Admin.query.filter_by(email=identity).first()
            elif user_role == 'user':
                current_user = User.query.filter_by(email=identity).first()

            if role == 'admin' and not current_admin:
                return jsonify({'error': 'Admin access required'}), 403
            if role == 'user' and not current_user:
                return jsonify({'error': 'User access required'}), 403

            if current_admin:
                return fn(current_admin, *args, **kwargs)
            elif current_user:
                return fn(current_user, *args, **kwargs)
            else:
                return jsonify({'error': 'Unauthorized'}), 401

        # Apply decorators conditionally
        if cross_origin:
            decorator = cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)(decorator)
        decorator = jwt_required()(decorator)
        
        return decorator
    return wrapper