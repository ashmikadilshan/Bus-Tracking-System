from backend.database import db
from datetime import datetime

class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'))
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)
    distance_m = db.Column(db.Float)
    avg_speed = db.Column(db.Float)
    events = db.Column(db.Text)  # JSON events (alerts)

    def to_dict(self):
        return {'id': self.id, 'bus_id': self.bus_id, 'driver_id': self.driver_id, 'started_at': self.started_at, 'ended_at': self.ended_at}
