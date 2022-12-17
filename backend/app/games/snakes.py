class Snakes:
    def __init__(self, player_1):
        self.player_1 = player_1
        self.player_2 = None
        self.player_1_snake = []
        self.player_2_snake = []
        self.game_over = False
        self.winner = None

    def get_players(self):
        return [self.player_1, self.player_2]

    def get_player_snakes(self):
        return {self.player_1: self.player_1_snake, self.player_2: self.player_2_snake}

    def update_ready(self):
        return len(self.player_1_snake) and len(self.player_2_snake)

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
