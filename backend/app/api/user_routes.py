from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User
from app.forms import UpdateProfileForm, ChangePasswordForm
from .auth_routes import validation_errors_to_error_messages

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:user_id>')
@login_required
def user(user_id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get_or_404(user_id)
    return user.to_dict()


@user_routes.route('/profile', methods=['PUT'])
@login_required
def update_user_profile():
    """
    Update current user's profile with provided data
    """
    form = UpdateProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        for key, val in form.data.items():
            if val:
                setattr(current_user, key, val)
        db.session.commit()
        return current_user.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@user_routes.route('/profile/password', methods=['PUT'])
@login_required
def change_password():
    """
    Change current user's password
    """

    form = ChangePasswordForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        for key, val in form.data.items():
            if key == "new_password":
                setattr(current_user, "password", val)
        db.session.commit()
        return current_user.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@user_routes.route('/search')
@login_required
def user_search():
    """
    Queries for users with provided search parameters and returns them in a list of user dictionaries
    """
    filter_ = request.args.get('username')
    users = User.query.filter(User.username.ilike(
        f'%{filter_}%')).all() if filter_ else []

    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/session/add_coins', methods=['PUT'])
@login_required
def add_coins():
    """
    Add coins to current user
    """
    current_user.coins_amount+=request.json['amount']
    db.session.commit()

    return current_user.to_dict()
