from .db import db, environment, SCHEMA, add_prefix_for_prod


Owned_Item = db.Table('owned_items',
    db.Column('item_id', db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
)

if environment == "production":
    Owned_Item.schema = SCHEMA


class Item(db.Model):
    '''
    Relationships:
        Item belongs to many Users
    '''
    __tablename__ = 'items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    item_type = db.Column(db.Enum("avatar", "banner", "frame", name='item_type'), nullable=False)
    image = db.Column(db.String, nullable=False)

    users = db.relationship("User", secondary=Owned_Item, back_populates="items")

    def to_dict(self):
        return {
            'id': self.id,
            'item_type': self.item_type,
            'image': self.image,
        }
