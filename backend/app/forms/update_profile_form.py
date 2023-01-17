from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError, Length, StopValidation
from app.models import User
from flask_login import current_user


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    if current_user.username != username:
        user = User.query.filter(User.username == username).first()
        if user:
            raise ValidationError('Username is already in use')


def optional(form, field):
    # Checks if input is empty and stops the validation sequence
    if field.raw_data is None or not len(field.raw_data):
        raise StopValidation()


class UpdateProfileForm(FlaskForm):
    username = StringField(
        'username', validators=[optional, DataRequired(), Length(max=30), username_exists])
    profile_picture = StringField('profile_picture')
