from flask import Blueprint, request
from flask_login import login_required, current_user
from flask_socketio import emit
from app.sockets import sio
from app.models import db, Game, Room, Message
from app.games import Player, Snakes, Pong
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
    if not current_user in game.users:
        game.room.users.append(current_user)
        print("reached", current_user.sid)
        sio.server.enter_room(current_user.sid, f'{game.game_type}-{game.id}')
        sio.server.enter_room(current_user.sid, str(game.room.id))

        db.session.add(Message(room_id=game.room.id, message=f'{current_user.username} has joined the room'))
        db.session.commit()

        sio.emit('update_game_lobby', game.to_dict(), room=f'{game.game_type}-{game.id}')

    return game.to_dict()

max_players = {
    'snakes': 4,
    'pong': 2
}
@game_routes.route('/', methods=['POST'])
@login_required
def create_game():
    """
    Creates a new game based on game type
    """
    # if request.json['game_type'] == 'snakes':
    #     new_game = Snakes(player_1=current_user.id)
    room = Room()
    room.users.append(current_user)
    db.session.add(room)
    db.session.commit()

    game_type = request.json['game_type']
    new_game = globals()[game_type.capitalize()](player_1=current_user.id)
    game = Game(host_id=current_user.id, room_id=room.id, game_data=json.dumps(new_game.get_data()), game_type=game_type, max_players=max_players[game_type])
    game.users.append(current_user)

    db.session.add(game)
    db.session.commit()

    sio.server.enter_room(current_user.sid, f'{game.game_type}-{game.id}')
    sio.server.enter_room(current_user.sid, str(room.id))
    sio.emit('update_game_list', broadcast=True)

    return game.to_dict()


@game_routes.route('/<int:game_id>/join', methods=['PUT'])
@login_required
def join_game(game_id):
    """
    Joins game specified by id
    """
    player_num = f'player_{request.json["playerNum"]}'
    game = Game.query.get_or_404(game_id)
    # game_instance = Snakes(game_data=json.loads(game.game_data))
    game_instance = globals()[game.game_type.capitalize()](game_data=json.loads(game.game_data))

    game_instance[player_num] = current_user.id
    game_instance[f'{player_num}_ready'] = False
    game.users.append(current_user)

    # if game_instance.player_2 is None:
    #     game_instance.player_2 = current_user.id
    #     game_instance.player_2_ready = False
    #     game.users.append(current_user)
    # elif game_instance.player_3 is None:
    #     game_instance.player_3 = current_user.id
    #     game_instance.player_3_ready = False
    #     game.users.append(current_user)
    # elif game_instance.player_4 is None:
    #     game_instance.player_4 = current_user.id
    #     game_instance.player_4_ready = False
    #     game.users.append(current_user)

    game.game_data = json.dumps(game_instance.get_data())

    db.session.commit()

        # sio.server.enter_room(current_user.sid, f'{game.game_type}-{game.id}')
    sio.emit('update_game_lobby', game.to_dict(), room=f'{game.game_type}-{game.id}')
    sio.emit('update_game_list', broadcast=True)

    return game.to_dict()


@game_routes.route('/<int:game_id>/leave', methods=['PUT'])
@login_required
def leave_game(game_id):
    """
    Leaves game specified by id
    """
    game = Game.query.get_or_404(game_id)
    # game_instance = Snakes(game_data=json.loads(game.game_data))
    game_instance = globals()[game.game_type.capitalize()](game_data=json.loads(game.game_data))

    if current_user.id == game_instance.player_2:
        game_instance.player_2 = None
        game_instance.player_2_ready = False
        game.users.remove(current_user)
    elif current_user.id == game_instance.player_3:
        game_instance.player_3 = None
        game_instance.player_3_ready = False
        game.users.remove(current_user)
    elif current_user.id == game_instance.player_4:
        game_instance.player_4 = None
        game_instance.player_4_ready = False
        game.users.remove(current_user)

    game.game_data = json.dumps(game_instance.get_data())

    if request.json['unmount']:
        sio.server.leave_room(current_user.sid, f'{game.game_type}-{game.id}')
        sio.server.leave_room(current_user.sid, str(game.room.id))
        game.room.users.remove(current_user)
        db.session.add(Message(room_id=game.room.id, message=f'{current_user.username} has left the room'))

    db.session.commit()

    sio.emit('update_game_lobby', game.to_dict(), room=f'{game.game_type}-{game.id}')
    sio.emit('update_game_list', broadcast=True)

    return game.to_dict()


# @login_required
@game_routes.route('/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    """
    Deletes game specified by id
    """
    game = Game.query.get_or_404(game_id)

    sio.emit('close_game_lobby', room=f'{game.game_type}-{game.id}')
    sio.server.close_room(f'{game.game_type}-{game.id}')
    sio.server.close_room(str(game.room.id))
    sio.emit('update_game_list', broadcast=True)

    db.session.delete(game.room)
    db.session.commit()

    return {'message': 'Successfully deleted game'}


@game_routes.route('/<int:game_id>/ready', methods=['PUT'])
@login_required
def update_ready_state(game_id):
    """
    Updates ready state of game specified by id
    """
    game = Game.query.get_or_404(game_id)
    # game_instance = Snakes(game_data=json.loads(game.game_data))
    game_instance = globals()[game.game_type.capitalize()](game_data=json.loads(game.game_data))

    if current_user.id == game_instance.player_2:
        game_instance.player_2_ready = request.json['ready_state']
    if game.game_type == "snakes":
        if current_user.id == game_instance.player_3:
            game_instance.player_3_ready = request.json['ready_state']
        if current_user.id == game_instance.player_4:
            game_instance.player_4_ready = request.json['ready_state']

    game.game_data = json.dumps(game_instance.get_data())

    db.session.commit()

    sio.emit('update_game_lobby', game.to_dict(), room=f'{game.game_type}-{game.id}')

    return game.to_dict()


@game_routes.route('/<int:game_id>/start', methods=['PUT'])
@login_required
def start_game(game_id):
    """
    Starts game specified by id
    """
    game = Game.query.get_or_404(game_id)
    # game_instance = Snakes(game_data=json.loads(game.game_data))
    game_instance = globals()[game.game_type.capitalize()](game_data=json.loads(game.game_data))

    if current_user.id == game_instance.player_1:
        if game.game_type == "snakes":
            game_instance.player_1_snake = request.json['player_1_snake']
            if (game_instance.player_2):
                game_instance.player_2_snake = request.json['player_2_snake']
            if (game_instance.player_3):
                game_instance.player_3_snake = request.json['player_3_snake']
            if (game_instance.player_4):
                game_instance.player_4_snake = request.json['player_4_snake']
            game_instance.apples = request.json['apples']

        # elif game.game_type == "pong":
        #     game_instance.player_1_paddle = request.json['player_1_paddle']
        #     game_instance.player_2_paddle = request.json['player_2_paddle']
        #     game_instance.ball = request.json['ball']
        # game_instance.payload_id = 0
        game.game_data = json.dumps(game_instance.get_data())

        db.session.commit()

        sio.emit('start_game', game_instance.get_game_start_data(), room=f'{game.game_type}-{game.id}')

    return game.to_dict()


# @sio.on('update_game')
# def update_game(data):
#     game = Game.query.get_or_404(data['gameId'])
#     # game_instance = Snakes(game_data=json.loads(game.game_data))
#     game_instance = globals()[game.game_type.capitalize()](game_data=json.loads(game.game_data))

#     # if data['payloadId'] == game_instance.payload_id:
#     if game.game_type == "snakes":
#         if current_user.id == game_instance.player_1 and not game_instance.player_1_snake:
#             game_instance.player_1_snake = data['snake']
#         elif current_user.id == game_instance.player_2 and not game_instance.player_2_snake:
#             game_instance.player_2_snake = data['snake']

#         if data.get('apples') is not None:
#             game_instance.apples = data['apples']

#         if game_instance.update_ready():
#             emit('update_game', game_instance.get_snakes_and_apples(), to=f'{game.game_type}-{game.id}')
#             game_instance.reset_snakes()
#             # game_instance.inc_payload_id()

#     elif game.game_type == "pong":
#         if current_user.id == game_instance.player_1 and not game_instance.player_1_paddle:
#             game_instance.player_1_paddle = data['paddle']
#         elif current_user.id == game_instance.player_2 and not game_instance.player_2_paddle:
#             game_instance.player_2_paddle = data['paddle']

#         if data.get('ball') is not None and not game_instance.ball:
#             game_instance.ball = data['ball']

#         if data.get('scorer') is not None:
#             game_instance.scorer = data['scorer']

#         if data.get('scores') is not None:
#             game_instance.player_1_score = data['scores']['p1Score']
#             game_instance.player_2_score = data['scores']['p2Score']

#         if data.get('paused') is not None:
#             game_instance.paused = data['paused']

#         if game_instance.update_ready():
#             emit('update_game', game_instance.get_paddles_and_ball(), to=f'{game.game_type}-{game.id}')
#             game_instance.reset_paddles_and_ball()
#             # game_instance.inc_payload_id()

#     game.game_data = json.dumps(game_instance.get_data())

#     db.session.commit()

@sio.on('update_game')
def update_game(data):
    emit('update_game', data, to=f'{data["gameType"]}-{data["gameId"]}')


@sio.on('end_game')
def end_game(data):
    game = Game.query.get_or_404(data['gameId'])
    game_instance = Snakes(game_data=json.loads(game.game_data))
    # game_instance.game_over = True
    # game_instance.winner = (game_instance.player_1 if current_user.id == game_instance.player_2 else game_instance.player_2)
    game_instance.results = data['results']
    game_instance.reset_game()
    # game_instance.player_2_ready = False
    # game_instance.player_3_ready = False
    # game_instance.player_4_ready = False

    game.game_data = json.dumps(game_instance.get_data())

    db.session.commit()

    emit('end_game', game.to_dict(), to=f'{game.game_type}-{game.id}')
