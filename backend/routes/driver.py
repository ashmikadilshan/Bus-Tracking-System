from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database import db
from backend.models.bus import Bus
from backend.models.driver import Driver

driver_bp = Blueprint('driver', __name__)

@driver_bp.route('/my', methods=['GET'])
@jwt_required()
def my_profile():
    identity = get_jwt_identity()
    # driver user id == identity.id
    return jsonify({'identity': identity})

@driver_bp.route('/location', methods=['POST'])
@jwt_required()
def post_location():
    # driver posts GPS via REST if socket not available
    data = request.json
    bus_id = data.get('bus_id')
    lat = data.get('lat')
    lng = data.get('lng')
    speed = data.get('speed')
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'msg':'bus not found'}), 404
    bus.current_lat = lat
    bus.current_lng = lng
    bus.speed = speed
    db.session.commit()
    # broadcast via socketio
    from backend.app import socketio
    socketio.emit('bus_location', {'bus_id': bus_id, 'lat': lat, 'lng': lng, 'speed': speed})
    return jsonify({'msg':'ok'})

@driver_bp.route('/status', methods=['POST'])
@jwt_required()
def update_status():
    data = request.json
    bus_id = data.get('bus_id')
    status = data.get('status')
    bus = Bus.query.get(bus_id)
    if bus:
        bus.status = status
        db.session.commit()
        return jsonify({'msg':'updated'})
    return jsonify({'msg':'not found'}), 404

@driver_bp.route('/alert', methods=['POST'])
@jwt_required()
def send_alert():
    data = request.json
    from backend.app import socketio
    socketio.emit('alert', data, broadcast=True)
    return jsonify({'msg':'alert sent'})
