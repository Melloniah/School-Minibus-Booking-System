from . import db
from .serialize_mixin import SerializeMixin
class Bus(db.Model, SerializeMixin):
    __tablename__ = 'buses'

    id = db.Column(db.Integer, primary_key=True)
    routeid = db.Column(db.Integer, db.ForeignKey('routes.id'))
    numberplate = db.Column(db.String(50))
    capacity = db.Column(db.Integer)
    route = db.relationship('Route', back_populates='buses')
    bookings = db.relationship('Booking', back_populates='bus')