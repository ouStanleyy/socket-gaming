from app.models import db, User, environment, SCHEMA

users = [
    {
        # 1
        "username": "Demo_User",
        "password": "demouserpw",
        "profile_picture": "https://img.freepik.com/free-vector/skull-gaming-with-joy-stick-emblem-modern-style_32991-492.jpg?w=1480&t=st=1673981116~exp=1673981716~hmac=56a46436a91050e5deb228a8ad65280b4613d78fc64822601b6071d5db97b091",
        "is_online": False,
    },
    {
        # 2
        "username": "Marnie_Demo",
        "password": "marniedemopw",
        "profile_picture": "https://img.freepik.com/free-psd/gaming-headphone-icon-isolated-3d-render-illustration_47987-8168.jpg?w=1480&t=st=1673981325~exp=1673981925~hmac=5e9d5a1f0087b6910ab28654fad480d0dfc0d3a1ebcfde9cf8ef77918e642537",
        "is_online": False
    },
    {
        # 3
        "username": "Stanley_Ou",
        "password": "stanleydemopw",
        "profile_picture": "https://porhomme.com/wp-content/uploads/2022/12/Audi-RS-6-Avant-and-RS-7-Sportback-Performance-V-8-super-Wagons-Arrive-11_11zon.jpeg",
        "is_online": False
    }
]


def seed_users():
    db.session.add_all([User(**user) for user in users])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
