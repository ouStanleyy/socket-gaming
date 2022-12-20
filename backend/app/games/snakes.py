class Snakes:
    def __init__(self, player_1=None, game_data=None):
        self.player_1 = game_data['player_1'] or player_1
        self.player_2 = game_data['player_2'] or None
        self.player_1_snake = game_data['player_1_snake'] or []
        self.player_2_snake = game_data['player_2_snake'] or []
        self.game_over = game_data['game_over'] or False
        self.winner = game_data['winner'] or None

    def get_players(self):
        return [self.player_1, self.player_2]

    def get_player_snakes(self):
        return {self.player_1: self.player_1_snake, self.player_2: self.player_2_snake}

    def update_ready(self):
        return len(self.player_1_snake) and len(self.player_2_snake)

    def player_1_snake_ready(self):
        return len(self.player_1_snake)

    def player_2_snake_ready(self):
        return len(self.player_2_snake)

    def reset_snakes(self):
        self.player_1_snake = []
        self.player_2_snake = []

    def get_data(self):
        return {
            'player_1': self.player_1,
            'player_2': self.player_2,
            'player_1_snake': self.player_1_snake,
            'player_2_snake': self.player_2_snake,
            'game_over': self.game_over,
            'winner': self.winner
        }
