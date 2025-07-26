from . import db 
from .serialize_mixin import SerializeMixin

class Pickup_Dropoff_Location(db.Model, SerializeMixin):
    __tablename__ = 'pickup_dropoff_locations'

    id = db.Column(db.Integer, primary_key=True)
    name_location = db.Column(db.String)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'), nullable=False)

    route = db.relationship('Route', back_populates='pickup_dropoff_locations')

