#Middleware to protect routes. It verifies JWT tokens and attaches the user to the request.
# authmiddleware.py
# from functools import wraps
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from flask import jsonify

# def jwt_protected():
#     """
#     A decorator to secure routes with JWT.
#     Usage: @jwt_protected() above route functions.
#     """

    # def decorator(fn):
    #     @wraps(fn)
    #     @jwt_required()
    #     def wrapper(*args, **kwargs):
    #         current_user = get_jwt_identity()
    #         if not current_user:
    #             return jsonify({'error': 'Unauthorized'}), 401
    #         return fn(*args, **kwargs)
    #     return wrapper

    # return decorator
# def jwt_protected():
#     def decorator(fn):
#         @wraps(fn)
#         @jwt_required()
#         def wrapper(*args, **kwargs):
#             print("jwt_protected called")  # Debug line
#             current_user = get_jwt_identity()
#             print(f"Current user: {current_user}")  # Debug line
#             if not current_user:
#                 return jsonify({'error': 'Unauthorized'}), 401
#             return fn(*args, **kwargs)
#         return wrapper
#     return decorator
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.admin import Admin
from functools import wraps

def jwt_protected(role=None):
    """
    Decorator to secure routes with JWT and check roles (user or admin).
    """
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            identity = get_jwt_identity()
            
            # Check if identity is dict
            if isinstance(identity, dict):
                user_role = identity.get("role")
                email = identity.get("email")
            else:
                return {'error': 'Invalid token format'}, 400

            current_user = None
            current_admin = None

            if user_role == 'admin':
                current_admin = Admin.query.filter_by(email=email).first()
            elif user_role == 'user':
                current_user = User.query.filter_by(email=email).first()

            if role == 'admin' and not current_admin:
                return {'error': 'Admin access required'}, 403
            if role == 'user' and not current_user:
                return {'error': 'User access required'}, 403

            if current_admin:
                return fn(current_admin, *args, **kwargs)
            elif current_user:
                return fn(current_user, *args, **kwargs)
            else:
                return {'error': 'Unauthorized'}, 401

        return decorator
    return wrapper
