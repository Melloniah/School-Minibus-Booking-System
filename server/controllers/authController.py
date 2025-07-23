from flask import request, jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)
from models import db 
from models.user import User
from models.admin import Admin
import bcrypt

# Register route
@cross_origin()
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
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def login():
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password")

        if not email or not password:
            return make_response(jsonify({"error": "Email and password required"}), 400)

        admin = Admin.query.filter_by(email=email).first()
        if admin and bcrypt.checkpw(password.encode('utf-8'), admin.password.encode('utf-8')):
            token = create_access_token(identity={"email": email, "role": "admin"})
            res = jsonify({
                "message": f"Welcome Admin {admin.name}",
                "user": {
                    "name": admin.name,
                    "email": admin.email,
                    "role": "admin",
                    "token":token
                }
            })
            set_access_cookies(res, token)
            return res, 200

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            token = create_access_token(identity={"email": email, "role": "user"})
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

@jwt_required()
@cross_origin()
def get_current_user():
    try:
        current_user_identity = get_jwt_identity()
        user_email = current_user_identity.get("email") if isinstance(current_user_identity, dict) else current_user_identity

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
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required()
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200
