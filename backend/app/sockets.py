import os
from flask import request
from flask_login import current_user
from flask_socketio import SocketIO, emit, join_room, rooms, leave_room
from .models import db, Message


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
    sio.server.enter_room(request.sid, request.args.get('room'))
    emit("connect",{"sid": request.sid})

@sio.on('message')
def handle_message(data):
    """event listener when client types a message"""
    # print("data from the front end: ",data['message'], data['room'])
    db.session.add(Message(user_id=data['uid'], room_id=data['room'], message=data['message']))
    db.session.commit()
    emit('message',{'message':data['message'],'sid':request.sid},room=data['room'])
    # emit(event,{'data':data,'id':request.sid},broadcast=True)

@sio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    # print("user disconnected")
    sio.server.leave_room(request.sid, request.args.get('room'))
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)