class Snakes:
    def __init__(self, player_1=None, game_data={}):
        self.player_1 = game_data.get('player_1', player_1)
        self.player_2 = game_data.get('player_2', None)
        self.player_1_ready = game_data.get('player_1_ready', False)
        self.player_2_ready = game_data.get('player_2_ready', False)
        self.player_1_snake = game_data.get('player_1_snake', [])
        self.player_2_snake = game_data.get('player_2_snake', [])
        self.game_over = game_data.get('game_over', False)
        self.winner = game_data.get('winner', None)

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

    def get_game_start_data(self):
        return {
            self.player_1: {
                'opponent': self.player_2,
                'snake': self.player_1_snake
            },
            self.player_2: {
                'opponent': self.player_1,
                'snake': self.player_2_snake
            }
        }

    def get_data(self):
        return {
            'player_1': self.player_1,
            'player_2': self.player_2,
            'player_1_ready': self.player_1_ready,
            'player_2_ready': self.player_2_ready,
            'player_1_snake': self.player_1_snake,
            'player_2_snake': self.player_2_snake,
            'game_over': self.game_over,
            'winner': self.winner
        }
