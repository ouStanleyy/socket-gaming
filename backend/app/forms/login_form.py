from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
from sqlalchemy import func


def user_exists(form, field):
    # Checking if user exists
    username = field.data
    user = User.query.filter(func.lower(User.username) == username.lower()).first()
    if not user:
        raise ValidationError('Invalid username.')


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    username = form.data['username']
    user = User.query.filter(func.lower(User.username) == username.lower()).first()

    if user and not user.check_password(password):
        raise ValidationError('Incorrect password.')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), user_exists])
    password = StringField('Password', validators=[
                           DataRequired(), password_matches])
