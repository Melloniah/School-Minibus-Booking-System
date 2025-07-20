from . import db 
from .serialize_mixin import SerializeMixin

class Pickup_Dropoff_Location(db.Model,SerializeMixin):
    __tablename__ = 'pickup_dropoff_location'

    id = db.Column(db.Integer,primary_key=True)
    name_location = db.Column(db.String)
    GPSystem = db.Column(db.String)
    routeid = db.Column(db.Integer, db.ForeignKey('routes.id'))

    route = db.relationship('Route', back_populates='pickup_dropoff_locations')
