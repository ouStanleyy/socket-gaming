from flask import Blueprint, request
from flask_login import login_required, current_user
from app.sockets import sio
from app.models import db, User, Room, Game
from app.games import Player, Snakes
import json

game_routes = Blueprint('games', __name__)


@game_routes.route('/')
@login_required
def games():
    """
    Query for all games and returns them in a list of game dictionaries
    """
    games = Game.query.all()
    return {'Games': [game.to_dict() for game in games]}


@game_routes.route('/<int:game_id>')
@login_required
def game(game_id):
    """
    Query for a game by id and returns that game in a dictionary
    """
    game = Game.query.get_or_404(game_id)
    return game.to_dict()


@game_routes.route('/', methods=['POST'])
@login_required
def create_game():
    """
    Creates a new game based on game type
    """
    # other_user = User.query.get_or_404(request.json['user_id'])
    if request.json['game_type'] == 'snakes':
        new_game = Snakes(player_1=current_user.sid)
    game = Game(host_id=current_user.id, game_data=json.dumps(new_game.get_data()), game_type=request.json['game_type'])
    game.users.append(current_user)
    # room = Room.query.filter(Room.users.any(User.id == user.id)).filter(Room.users.any(User.id == current_user.id)).first()

    db.session.add(game)
    db.session.commit()

    sio.server.enter_room(current_user.sid, f'{game.game_type}-{game.id}')

    return game.to_dict()


@game_routes.route('/<int:game_id>/join', methods=['PUT'])
@login_required
def join_game(game_id):
    """
    Joins game specified by id
    """
    game = Game.query.get_or_404(game_id)
    game_instance = Snakes(game_data=json.loads(game.game_data))
    game_instance.player_2 = current_user.sid
    game.game_data = json.dumps(game_instance.get_data())
    game.users.append(current_user)
    # room = Room.query.filter(Room.users.any(User.id == user.id)).filter(Room.users.any(User.id == current_user.id)).first()

    db.session.commit()

    sio.server.enter_room(current_user.sid, f'{game.game_type}-{game.id}')

    return game.to_dict()


@game_routes.route('/<int:game_id>/leave', methods=['PUT'])
@login_required
def leave_game(game_id):
    """
    Leaves game specified by id
    """
    game = Game.query.get_or_404(game_id)
    game_instance = Snakes(game_data=json.loads(game.game_data))
    game_instance.player_2 = None
    game.game_data = json.dumps(game_instance.get_data())
    game.users.remove(current_user)
    # room = Room.query.filter(Room.users.any(User.id == user.id)).filter(Room.users.any(User.id == current_user.id)).first()

    db.session.commit()

    sio.server.leave_room(current_user.sid, f'{game.game_type}-{game.id}')

    return game.to_dict()
