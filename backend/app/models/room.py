from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import current_user


Occupant = db.Table('occupants',
    db.Column('room_id', db.Integer, db.ForeignKey(add_prefix_for_prod('rooms.id')), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
)

if environment == "production":
    Occupant.schema = SCHEMA


class Room(db.Model):
    '''
    Relationships:
        Room has many Users and Messages
    '''
    __tablename__ = 'rooms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    users = db.relationship("User", secondary=Occupant, back_populates="rooms")
    messages = db.relationship("Message", back_populates="room", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            'id': self.id,
            'user': next((user.to_dict() for user in self.users if user.id != current_user.id), {}),
            'messages': [message.to_dict() for message in self.messages]
        }
