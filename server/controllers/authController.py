#Handles registration, login, password validation, and token generation.
#All crud operations for user authentication.

from flask import request, jsonify, make_response
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity
from models import db 
from models.user import User
import bcrypt

#Registration of a new user
def register_user():
    data = request.get_json()

    name = data["name"]
    password = data["password"]
    email = data["email"]

    if User.query.filter_by(email=email).first():
        return make_response(f"This user already exists", 400)
    
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(email=email, name=name, password=hashed)
    db.session.add(new_user)
    db.session.commit()

    return make_response(f"User {name} created successfully", 201)

#User Login
def login():
    data = request.get_json()
    password = data["password"]
    email = data["email"]

    user = User.query.filter_by(email= email).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        access_token = create_access_token(identity=email) #gerate JWT
        response = make_response(f"Welcome {user.name}")
        set_access_cookies(response, access_token) # save JWT in httponly cookies
        return response   
         
    return make_response(f"Invalid credentials!")

#Cookies
def read_cookie():
    cookie_value = request.cookies.get("name")
    return make_response(f"cookie: {cookie_value}")

from flask_jwt_extended import jwt_required, get_jwt_identity

# Get current logged-in user info
@jwt_required()
def get_current_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "User not found"}), 404
