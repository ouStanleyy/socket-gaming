from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User
from sqlalchemy import func


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(func.lower(User.username) ==
                             func.lower(username)).first()
    if user:
        raise ValidationError('Username is already taken.')


def username_no_space(form, field):
    username = field.data
    if any(not char.isalnum() for char in username.replace("_", "")):
        raise ValidationError(
            "Special characters aren't allowed here. You can only use letters, periods, numbers, or underscores")


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), Length(min=5, max=30, message="Username must be between 5-30 characters"), username_exists, username_no_space])
    password = StringField('password', validators=[DataRequired(), Length(
        min=6, max=15, message="Password must be between 6-15 characters long")])
