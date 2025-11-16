from backend.database import db
from datetime import datetime

class Driver(db.Model):
    __tablename__ = 'drivers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30))
    license_number = db.Column(db.String(50))
    status = db.Column(db.String(30), default='active')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    assigned_bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'))
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'phone': self.phone, 'license_number': self.license_number, 'status': self.status, 'assigned_bus_id': self.assigned_bus_id}
