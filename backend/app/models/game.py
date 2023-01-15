from .db import db, environment, SCHEMA, add_prefix_for_prod
import json


Player = db.Table('players',
    db.Column('game_id', db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
)

if environment == "production":
    Player.schema = SCHEMA


class Game(db.Model):
    '''
    Relationships:
        Message belongs to User and Room
    '''
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('rooms.id')), nullable=False)
    game_data = db.Column(db.Text)
    game_type = db.Column(db.Enum("snakes", "pong", "connect4", name='game_type'), nullable=False)
    max_players = db.Column(db.Integer, nullable=False, default=2)
    is_private = db.Column(db.Boolean, nullable=False, default=False)

    users = db.relationship("User", secondary=Player, back_populates="games")
    room = db.relationship("Room", back_populates="game")

    def to_dict(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'room_id': self.room_id,
            'game_data': json.loads(self.game_data),
            'game_type': self.game_type,
            'max_players': self.max_players,
            'is_private': self.is_private,
            'users': [user.to_dict() for user in self.users],
            # 'room': self.room.to_dict_game_chat()
        }
