from . import db
from .serialize_mixin import SerializeMixin

class Route(db.Model, SerializeMixin):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    route_name = db.Column(db.String(100))
    
    buses = db.relationship('Bus', back_populates='route',cascade="all, delete-orphan")
    pickup_dropoff_locations = db.relationship('Pickup_Dropoff_Location', back_populates='route',cascade="all, delete-orphan")
