from backend.database import db
from datetime import datetime

class Route(db.Model):
    __tablename__ = 'routes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    start_point = db.Column(db.String(150))
    end_point = db.Column(db.String(150))
    number_of_stops = db.Column(db.Integer, default=0)
    waypoints = db.Column(db.Text)  # GeoJSON or JSON list of lat/lng
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    buses = db.relationship('Bus', backref='route')

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'start_point': self.start_point, 'end_point': self.end_point, 'number_of_stops': self.number_of_stops, 'waypoints': self.waypoints}
