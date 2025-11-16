from flask import current_app

# This module registers socket handlers

def register_socket_handlers(socketio):
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')

    @socketio.on('join')
    def handle_join(data):
        # data: {room: 'route_1' or 'bus_12'}
        room = data.get('room')
        if room:
            from flask_socketio import join_room
            join_room(room)
            socketio.emit('joined', {'room': room})

    @socketio.on('location_update')
    def handle_location_update(data):
        # data: {bus_id, lat, lng, speed, heading}
        # Save into DB and emit to subscribers
        try:
            from backend.database import db
            from backend.models.bus import Bus
            bus_id = data.get('bus_id')
            lat = data.get('lat')
            lng = data.get('lng')
            speed = data.get('speed')
            bus = Bus.query.get(bus_id)
            if bus:
                bus.current_lat = lat
                bus.current_lng = lng
                bus.speed = speed
                bus.status = data.get('status', bus.status)
                db.session.commit()
            # Emit to room for this bus and its route
            socketio.emit('bus_location', data, room=f'bus_{bus_id}')
            if bus and bus.route_id:
                socketio.emit('bus_location', data, room=f'route_{bus.route_id}')
        except Exception as e:
            print('Error saving location:', e)

    @socketio.on('alert')
    def handle_alert(data):
        # data: {bus_id, type: emergency/delay, message}
        socketio.emit('alert', data, broadcast=True)
