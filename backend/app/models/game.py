from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import func


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
    room_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('rooms.id')))
    game_data = db.Column(db.Text)
    game_type = db.Column(db.DateTime(timezone=True),
                          server_default=func.now())

    users = db.relationship("User", secondary=Player, back_populates="games")
    room = db.relationship("Room", back_populates="games")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'room_id': self.room_id,
            'message': self.message,
            'time_sent': self.time_sent
        }
