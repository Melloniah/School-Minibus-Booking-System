from flask import request, jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from models import db 
from models.user import User
from models.admin import Admin
import bcrypt
import traceback 
import os

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://school-minibus-booking-system.vercel.app"
]

# Add environment origin if set
env_origin = os.getenv("FRONTEND_ORIGIN")
if env_origin and env_origin not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(env_origin)


ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://school-minibus-booking-system.vercel.app"
]

# Add environment origin if set
env_origin = os.getenv("FRONTEND_ORIGIN")
if env_origin and env_origin not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(env_origin)


# Register route
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def register_user():
    try:
        data = request.get_json() or {}
        
        email = data.get("email", "").strip().lower()
        name = data.get("name", "").strip()
        password = data.get("password")

        if not email or not name or not password:
            return make_response(jsonify({"error": "Email, name, and password are required"}), 400)

        if User.query.filter_by(email=email).first():
            return make_response(jsonify({"error": "This user already exists"}), 400)

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_user = User(email=email, name=name, password=hashed)
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify({"message": f"User {name} created successfully"}), 201)
    
    except Exception as e:
        print("Registration error:", e)
        return make_response(jsonify({"error": "Registration failed"}), 500)

# Login route
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def login():
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password")

        if not email or not password:
            return make_response(jsonify({"error": "Email and password required"}), 400)

        admin = Admin.query.filter_by(email=email).first()
        if admin and bcrypt.checkpw(password.encode('utf-8'), admin.password.encode('utf-8')):
            # Store just the email as identity 
            token = create_access_token(
                identity=admin.email,  
                additional_claims={"role": "admin"}
            )
            
            res = jsonify({
                "message": f"Welcome Admin {admin.name}",
                "user": {
                    "name": admin.name,
                    "email": admin.email,
                    "role": "admin",
                    "token": token
                }
            })
            set_access_cookies(res, token)
            return res, 200

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            # Store just the email as identity
            token = create_access_token(
                identity=user.email,  
                additional_claims={"role": "user"}
            )

            res = jsonify({
                "message": f"Welcome {user.name}",
                "user": {
                    "name": user.name,
                    "email": user.email,
                    "role": "user",
                    "token": token
                }
            })
            set_access_cookies(res, token)
            return res, 200

        return make_response(jsonify({"error": "Invalid email or password"}), 401)
    
    except Exception as e:
        print(traceback.format_exc())
        return make_response(jsonify({"error": "Login failed"}), 500)

# Current user route
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_required()
def get_current_user():
    try:
        # get_jwt_identity() returns the full identity object
        identity = get_jwt_identity()
        user_email = identity.get("email") if isinstance(identity, dict) else identity
        
        admin = Admin.query.filter_by(email=user_email).first()
        if admin:
            return jsonify({
                "name": admin.name,
                "email": admin.email,
                "role": "admin"
            }), 200
            
        user = User.query.filter_by(email=user_email).first()
        if user:
            return jsonify({
                "name": user.name,
                "email": user.email,
                "role": "user"
            }), 200
            
        return jsonify({"error": "User not found"}), 404
    
    except Exception as e:
        print("Current user error:", e)
        return jsonify({"error": "Failed to get user info"}), 500

# Logout route
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_required()
def logout():
    try:
        res = jsonify({"message": "Logged out successfully"})
        unset_jwt_cookies(res)
        return res, 200
    except Exception as e:
        return jsonify({"error": "Logout failed"}), 500

# getting all users for admin use
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
@jwt_required()
def get_all_users():
    """
    Fetches all registered users.
    Requires admin role for access.
    """
    try:
        claims = get_jwt() 
        user_role = claims.get("role") 
        # Ensure only admins can access this endpoint
        if user_role != "admin":
            return make_response(jsonify({"error": "Unauthorized: Admin access required"}), 403)

        users = User.query.all()
        # Assuming User model has a to_dict() method from SerializeMixin
        users_data = [user.to_dict() for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        print(f"Error fetching all users: {traceback.format_exc()}")
        return make_response(jsonify({"error": "Failed to fetch users"}), 500)
