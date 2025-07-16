#Handles registration, login, password validation, and token generation.
#All crud operations for user authentication.

from flask import request, jsonify, make_response
from models import db 
from models.user import User
import bcrypt

#Registration of a new user
def register_user():
    data = request.get_json()

    name = data["name"]
    password = data["_password_hash"]
    email = data["email"]

    if User.query.filter_by(email=email).first():
        return make_response(f"This user already exists", 400)
    
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(email=email, name=name, _password_hash=hashed)
    db.session.add(new_user)
    db.session.commit()

    return make_response(f"User {name} created successfully", 201)