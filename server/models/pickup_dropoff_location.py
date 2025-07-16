from . import db 
from .serialize_mixin import SerializeMixin

class PickupDropoffLocation(db.Model,SerializeMixin):
    __tablename__ = 'pickup_dropoff_location'

    id = db.Column(db.Integer,primary_key=True)
    name_location = db.Column(db.String)
    GPSystem = db.Column(db.String)

    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))

    route = db.relationship('Route', back_populates='pickup_dropoff_location')
