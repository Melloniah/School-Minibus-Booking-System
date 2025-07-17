#Middleware to protect routes. It verifies JWT tokens and attaches the user to the request.
# authmiddleware.py
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify

def jwt_protected():
    """
    A decorator to secure routes with JWT.
    Usage: @jwt_protected() above route functions.
    """

    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            if not current_user:
                return jsonify({'error': 'Unauthorized'}), 401
            return fn(*args, **kwargs)
        return wrapper

    return decorator

