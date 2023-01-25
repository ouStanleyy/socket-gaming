from flask import Blueprint, jsonify, request, redirect, url_for
from flask_login import login_required, current_user
from app.sockets import sio
from app.models import db, User, Room

room_routes = Blueprint('rooms', __name__)


@room_routes.route('/')
@login_required
def rooms():
    """
    Query for all rooms of the current user and returns them in a list of room dictionaries
    """
    return {'Rooms': [room.to_dict() for room in current_user.rooms if room.game is None]}


@room_routes.route('/<int:room_id>')
@login_required
def room(room_id):
    """
    Query for a room by id and returns that room in a dictionary
    """
    room = Room.query.get_or_404(room_id)
    return room.to_dict_game_chat()


@room_routes.route('/', methods=['POST'])
@login_required
def join_room():
    """
    Joins an existing or newly created room for current user and user specified by id
    """
    user = User.query.get_or_404(request.json['user_id'])
    room = Room.query.filter(Room.users.any(User.id == user.id)).filter(Room.users.any(User.id == current_user.id)).first()

    if room is None:
        room = Room()
        room.users.extend([current_user, user])

        db.session.add(room)
        db.session.commit()

        sio.server.enter_room(current_user.sid, str(room.id))

    return room.to_dict()
