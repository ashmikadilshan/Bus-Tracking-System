from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database import db
from backend.models.bus import Bus
from backend.models.favorite import Favorite

passenger_bp = Blueprint('passenger', __name__)

@passenger_bp.route('/buses', methods=['GET'])
def search_buses():
    # Basic search: by route or plate
    q = request.args.get('q')
    query = Bus.query
    if q:
        query = query.filter(Bus.plate_number.like(f"%{q}%"))
    buses = query.all()
    return jsonify([b.to_dict() for b in buses])

@passenger_bp.route('/favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    identity = get_jwt_identity()
    data = request.json
    bus_id = data.get('bus_id')
    fav = Favorite(user_id=identity['id'], bus_id=bus_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({'msg':'fav added'})

@passenger_bp.route('/favorites', methods=['GET'])
@jwt_required()
def list_favorites():
    identity = get_jwt_identity()
    favs = Favorite.query.filter_by(user_id=identity['id']).all()
    return jsonify([f.to_dict() for f in favs])

@passenger_bp.route('/eta/<int:bus_id>', methods=['GET'])
def eta(bus_id):
    # Very simple ETA: use distance to static point passed as lat/lng
    import math
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    bus = Bus.query.get(bus_id)
    if not bus or not bus.current_lat:
        return jsonify({'eta_minutes': None})
    # haversine
    def haversine(a_lat, a_lng, b_lat, b_lng):
        R = 6371000
        from math import radians, sin, cos, asin, sqrt
        dlat = radians(b_lat - a_lat)
        dlng = radians(b_lng - a_lng)
        a = sin(dlat/2)**2 + cos(radians(a_lat))*cos(radians(b_lat))*sin(dlng/2)**2
        c = 2*asin(sqrt(a))
        return R * c
    if lat is None or lng is None:
        return jsonify({'msg':'lat/lng required'}), 400
    dist = haversine(bus.current_lat, bus.current_lng, lat, lng)
    speed_mps = bus.speed or 8.33  # default 30km/h -> 8.33 m/s
    eta_seconds = dist / speed_mps if speed_mps>0 else None
    return jsonify({'eta_minutes': (eta_seconds/60) if eta_seconds else None})
