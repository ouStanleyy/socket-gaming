from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError, Length
from flask_login import current_user


def password_matches(form, field):
    # Checking if password matches
    password = field.data

    if not current_user.check_password(password):
        raise ValidationError('Password is incorrect.')


class ChangePasswordForm(FlaskForm):
    old_password = StringField(
        'old_password', validators=[DataRequired(), Length(max=15), password_matches])
    new_password = StringField('new_password', validators=[DataRequired(), Length(
        min=6, max=15, message="Password must be between 6-15 characters long")])
