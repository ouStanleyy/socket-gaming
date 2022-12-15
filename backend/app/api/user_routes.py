from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, User

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
