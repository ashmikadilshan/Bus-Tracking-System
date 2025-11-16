from backend.database import db
from datetime import datetime

class Bus(db.Model):
    __tablename__ = 'buses'
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(50), unique=True, nullable=False)
    capacity = db.Column(db.Integer, default=40)
    model = db.Column(db.String(100), default='Standard')
    current_lat = db.Column(db.Float)
    current_lng = db.Column(db.Float)
    speed = db.Column(db.Float)
    status = db.Column(db.String(30), default='idle')
    driver = db.relationship('Driver', backref='bus', uselist=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'plate_number': self.plate_number, 'capacity': self.capacity, 'model': self.model, 'lat': self.current_lat, 'lng': self.current_lng, 'status': self.status}
