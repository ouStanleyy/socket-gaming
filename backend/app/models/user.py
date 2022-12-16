from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    '''
    Relationships:
        User has many Rooms, Messages
    '''
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String)
    is_online = db.Column(db.Boolean, nullable=False, default=False)
    sid = db.Column(db.String)
    # gender = db.Column(db.Enum("Male", "Female", "Non-binary", "Prefer not to say",
    #                    name='gender'), nullable=False, default="Prefer not to say")

    rooms = db.relationship("Room", secondary="occupants", back_populates="users")
    messages = db.relationship("Message", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'profile_picture': self.profile_picture,
            'is_online': self.is_online
        }

    # def to_dict_all(self):
    #     return {
    #         'id': self.id,
    #         'username': self.username,
    #         'full_name': self.full_name,
    #         'profile_picture': self.profile_picture,
    #         'is_verified': self.is_verified
    #     }

    # def to_dict_user_id(self):
    #     return {
    #         'id': self.id,
    #         'username': self.username,
    #         'full_name': self.full_name,
    #         'bio': self.bio,
    #         'num_of_followers': len([follower for follower in self.followers if not follower.is_pending]),
    #         'num_of_followings': len([following for following in self.followings if not following.is_pending]),
    #         'profile_picture': self.profile_picture,
    #         'is_verified': self.is_verified,
    #         'is_private': self.is_private,
    #         'num_of_posts': len([post for post in self.posts if not post.is_story]),
    #         'posts': [post.to_dict_user_details() for post in self.posts]
    #     }
