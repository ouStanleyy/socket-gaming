class Player:
    def __init__(self, player):
        self._player = player

    @property
    def player(self):
        return self._player
