from app.models import db, Item, Owned_Item, environment, SCHEMA

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
    },
    {
        # 7
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFIJOdbuUM/1/0/1600w/canva-purple-teal-pastel-yellow-gamer-girl-just-chatting-twitch-banner-1qV7dCmBRQo.jpg",
    },
    {
        # 8
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAFIIQMNuCY/1/0/1600w/canva-black-neon-pink-blue-arcade-pixel-music-twitch-banner-mXh8oQAaeyM.jpg",
    },
    {
        # 9
        "item_type": "banner",
        "image": "https://marketplace.canva.com/EAEeOQwo3jY/1/0/1600w/canva-purple-mountain-vintage-retro-twitch-banner-1NYTq34QR6I.jpg",
    },
    {
        # 10
        "item_type": "avatar",
        "image": "https://img.freepik.com/free-vector/skull-gaming-with-joy-stick-emblem-modern-style_32991-492.jpg?w=1480&t=st=1673981116~exp=1673981716~hmac=56a46436a91050e5deb228a8ad65280b4613d78fc64822601b6071d5db97b091",
    },
    {
        # 11
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFIKBhAC0A/1/0/1600w/canva-violet-dark-blue-beige-anime-music-twitch-logo-Vb3oMvni32s.jpg",
    },
    {
        # 12
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAEeKH905XY/2/0/1600w/canva-yellow-and-black-gamer-grunge-twitch-profile-picture-Yf5RCMJroQI.jpg",
    },
    {
        # 13
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFGTFnp6Ao/4/0/1600w/canva-orange-pixel-game-controller-twitch-logo-0o_UWEjzvz4.jpg",
    },
    {
        # 14
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFGTls0GiI/2/0/1600w/canva-blue-and-orange-moon-illustration-twitch-profile-picture-ryxlqaa97i4.jpg",
    },
    {
        # 15
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFIKI4NGLE/1/0/1600w/canva-red-black-white-anime-podcast-twitch-logo-EkRf2XxHpdQ.jpg",
    },
    {
        # 16
        "item_type": "avatar",
        "image": "https://img.freepik.com/free-psd/gaming-headphone-icon-isolated-3d-render-illustration_47987-8168.jpg?w=1480&t=st=1673981325~exp=1673981925~hmac=5e9d5a1f0087b6910ab28654fad480d0dfc0d3a1ebcfde9cf8ef77918e642537",
    },
    {
        # 17
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAE6OH6DF2w/1/0/1600w/canva-moon-astronaut-character-twitch-profile-picture-0kkgyJSodt4.jpg",
    },
    {
        # 18
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFQTYXPyD8/1/0/1600w/canva-astronaut-square-pillow-J0E0kRuPMwA.jpg",
    },
    {
        # 19
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFAgG43i2k/1/0/1600w/canva-cute-astronaut-sticker-M41Cfys_QSM.jpg",
    },
    {
        # 20
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFKKO0ySG8/1/0/1600w/canva-blue-and-yellow-illustrated-astronaut-circle-sticker-LJx23D_jsq0.jpg",
    },
    {
        # 21
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFPW8q5wLE/1/0/1600w/canva-black-playful-astronaut-square-pillow-zt04lXD39gI.jpg",
    },
    {
        # 22
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFQNoijNo0/1/0/1600w/canva-white-orange-astronaut-to-the-moon-square-sticker-5aCX3i6YEU0.jpg",
    },
    {
        # 23
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAE5bmYWNEs/1/0/1600w/canva-orange-television-circle-laptop-sticker-dCtkguuhQBg.jpg",
    },
    {
        # 24
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAEsry5X21k/1/0/1600w/canva-black-and-red-playful-planet-space-galaxy-sticker-WtZIo3hef5w.jpg",
    },
    {
        # 25
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFIIQarwhw/3/0/1600w/canva-black-purple-neon-pink-arcade-pixel-music-twitch-logo-pYvYF8bcQv8.jpg",
    },
    {
        # 27
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAFGTbjAdiw/2/0/1600w/canva-purple-and-blue-retro-pixel-butterfly-twitch-profile-picture-6PiID1yZXyI.jpg",
    },
    {
        # 27
        "item_type": "avatar",
        "image": "https://marketplace.canva.com/EAE6OH4hGaw/1/0/1600w/canva-joystick-button-twitch-profile-picture-d-CX0PwNZ70.jpg",
    }
]


def seed_items():
    db.session.add_all([Item(**item) for item in items])
    db.session.commit()
    db.session.connection().execute(Owned_Item.insert().values([(1, 1), (2, 1), (3, 1), (10, 1), (11, 1), (12, 1), (1, 2), (2, 2), (10, 2), (11, 2), (12, 2), (3, 2), (1, 3), (2, 3), (3, 3), (10, 3), (11, 3), (12, 3),]))
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
