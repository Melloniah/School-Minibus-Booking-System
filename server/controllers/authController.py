#Handles registration, login, password validation, and token generation.
#All crud operations for user authentication.

from flask import request, jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity
from models import db 
from models.user import User
from models.admin import Admin
import bcrypt

#Registration of a new user
@cross_origin()
def register_user():
    data = request.get_json()

    name = data["name"]
    password = data["password"]
    email = data["email"]

    if User.query.filter_by(email=email).first():
        return make_response(jsonify({"error": "This user already exists"}), 400)
    
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(email=email, name=name, password=hashed)
    db.session.add(new_user)
    db.session.commit()

    return make_response(jsonify({"message": f"User {name} created successfully"}), 201)

    
@cross_origin()
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return make_response(jsonify({"error": "Email and password required"}), 400)

    # Admin Login
    admin = Admin.query.filter_by(email=email).first()
    if admin and bcrypt.checkpw(password.encode(), admin.password.encode()):
        token = create_access_token(identity={"email": email, "role": "admin"})
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

    # User Login
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.checkpw(password.encode(), user.password.encode()):
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



@cross_origin()
def read_cookie():
    cookie_value = request.cookies.get("name")
    return make_response(f"cookie: {cookie_value}")

@jwt_required()
@cross_origin()
def get_current_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "User not found"}), 404