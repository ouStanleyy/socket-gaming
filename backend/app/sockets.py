import os
from flask import request
from flask_login import current_user
from flask_socketio import SocketIO, emit, join_room, rooms, leave_room
from .models import db, Message
from .games import Player, Snakes


# Creates an instance of SocketIO
origins = []

if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'https://socket-gaming.onrender.com',
        'http://socket-gaming.onrender.com',
    ]
else:
    origins = '*'

sio = SocketIO(cors_allowed_origins=origins)


@sio.on("connect")
def connected():
    """event listener when client connects to the server"""
    # print(request.args.get('room'))
    # print("client has connected")
    # print(request.sid)
    current_user.is_online = True
    current_user.sid = request.sid
    db.session.commit()
    for room in current_user.rooms:
        join_room(str(room.id))
    for game in current_user.games:
        join_room(f'{game.game_type}-{game.id}')
    # sio.server.enter_room(request.sid, request.args.get('room'))
    emit("connected", {"sid": request.sid}, broadcast=True, include_self=False)


@sio.on('message')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ",data['message'], data['room'])
    db.session.add(Message(user_id=data['uid'], room_id=data['room'], message=data['message']))
    db.session.commit()
    emit('message',{'message':data['message'],'sid':request.sid},to=data['room'])
    # emit(event,{'data':data,'id':request.sid},broadcast=True)


@sio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    # print("user disconnected")
    current_user.is_online = False
    current_user.sid = None
    db.session.commit()
    for room in current_user.rooms:
        leave_room(str(room.id))
    for game in current_user.games:
        leave_room(f'{game.game_type}-{game.id}')
    # sio.server.leave_room(request.sid, request.args.get('room'))
    emit("disconnected", f"user {request.sid} disconnected", broadcast=True, include_self=False)


snakes_game = None

@sio.on('game_connect')
def game_connection(data):
    global snakes_game
    # player = Player(request.sid)
    print("hi", data['snake'])
    if not snakes_game:
        snakes_game = Snakes(player_1=request.sid)
        snakes_game.player_1_snake = data['snake']
        print("hi2", snakes_game)
    elif not snakes_game.player_2:
        snakes_game.player_2 = request.sid
        snakes_game.player_2_snake = data['snake']
        print("hi3", snakes_game.get_player_snakes())
        emit('start_game', [snakes_game.get_players(), snakes_game.get_player_snakes()], broadcast=True)


@sio.on('active_game')
def active_game(data):
    print("data", data['snake'])
    if request.sid == snakes_game.player_1:
        snakes_game.player_1_snake = data['snake']
    elif request.sid == snakes_game.player_2:
        snakes_game.player_2_snake = data['snake']

    print("update ready", snakes_game.get_player_snakes())
    if snakes_game.update_ready():
        print("snakes", snakes_game.get_player_snakes())
        emit('update_game', snakes_game.get_player_snakes(), broadcast=True)
        snakes_game.reset_snakes()


@sio.on('end_game')
def active_game():
    emit('end_game', broadcast=True)
