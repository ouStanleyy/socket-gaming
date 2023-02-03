from app.models import db, Item, environment, SCHEMA

items = [
    {
        # 1
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFKAwefFZs/1/0/1600w/canva-purple-aquamarine-art-pixel-art-discord-profile-banner-aw9UuWkrCts.jpg",
    },
    {
        # 2
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFSri5bYh0/1/0/1600w/canva-pink-fun-gaming-pixel-art-discord-profile-banner-x-tJlezAdIU.jpg",
    },
    {
        # 3
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFOOdUV12Y/1/0/1600w/canva-blue-green-brown-gaming-pixel-art-discord-profile-banner-FTz8fhcgPGQ.jpg",
    },
    {
        # 4
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAEeO4Bb7ys/1/0/1600w/canva-purple-clouds-gamer-girl-twitch-banner-USDV23M__tU.jpg",
    },
    {
        # 5
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFIJI5vK_Q/1/0/1600w/canva-violet-dark-blue-anime-music-twitch-banner-iu2BU3SsufU.jpg",
    },
    {
        # 6
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFIJGWz8q4/1/0/1600w/canva-red-black-white-anime-podcast-twitch-banner-UWLRt79y-g4.jpg",
    }
]


def seed_items():
    db.session.add_all([Item(**item) for item in items])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_items():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM items")

    db.session.commit()
