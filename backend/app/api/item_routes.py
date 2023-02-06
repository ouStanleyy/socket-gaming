from flask import Blueprint, jsonify, request, redirect, url_for
from flask_login import login_required, current_user
from app.models import db, User, Item

item_routes = Blueprint('items', __name__)


@item_routes.route('/')
@login_required
def items():
    """
    Query for all items and returns them in a list of item dictionaries
    """
    items = Item.query.all()
    return {'items': [item.to_dict() for item in items]}


@item_routes.route('/<int:item_id>')
@login_required
def item(item_id):
    """
    Query for item by id and returns that item in a dictionary
    """
    item = Item.query.get_or_404(item_id)
    return item.to_dict()


@item_routes.route('/<int:item_id>/buy', methods=['POST'])
@login_required
def buy_item(item_id):
    """
    Query for item by id and adds it to current user's items
    """
    item = Item.query.get_or_404(item_id)
    current_user.items.append(item)
    db.session.commit()

    return item.to_dict()


@item_routes.route('/<int:item_id>/set', methods=['PUT'])
@login_required
def set_item(item_id):
    """
    Query for item by id and sets it as current user's profile choice
    """
    item = next((item for item in current_user.items if item.id == item_id), None)

    if item is not None:
        item_type = request.json["item_type"]
        if item_type == "banner":
            current_user.banner_id = item.id
        db.session.commit()

    return item.to_dict()
