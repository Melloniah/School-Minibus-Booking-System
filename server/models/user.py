from . import db
# from werkzeug.security import generate_password_hash, check_password_hash
from .serialize_mixin import SerializeMixin
class User (db.Model, SerializeMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String(120), unique=True)
    # _password_hash = db.Column('passwordhash', db.String(255))
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(40), default='user')
    
    bookings = db.relationship('Booking', back_populates='user')

    # # password setter and verification
    # @property
    # def password(self):
    #     raise AttributeError("Password is write-only")

    # @password.setter
    # def password(self, raw_password):
    #     self._password_hash = generate_password_hash(raw_password) # turns it into a secure,
    #     # salted, irreversible hash

    # def verify_password(self, raw_password):
    #     return check_password_hash(self._password_hash, raw_password)