from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.user import User
from models.admin import Admin
from functools import wraps
from flask import jsonify

def jwt_protected(role=None):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
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

        return decorator
    return wrapper