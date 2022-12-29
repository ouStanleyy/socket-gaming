class Pong:
    def __init__(self, player_1=None, game_data={}):
        self.player_1 = game_data.get('player_1', player_1)
        self.player_2 = game_data.get('player_2', None)
        self.player_2_ready = game_data.get('player_2_ready', False)
        self.player_1_paddle = game_data.get('player_1_paddle', [])
        self.player_2_paddle = game_data.get('player_2_paddle', [])
        self.ball = game_data.get('ball', [])
        self.player_1_score = game_data.get('player_1_score', 0)
        self.player_2_score = game_data.get('player_2_score', 0)
        self.game_over = game_data.get('game_over', False)
        self.winner = game_data.get('winner', None)

    def get_players(self):
        return [self.player_1, self.player_2]

    def get_paddles_and_ball(self):
        return {
            self.player_1: self.player_1_paddle,
            self.player_2: self.player_2_paddle,
            'ball': self.ball
        }

    def update_ready(self):
        return len(self.player_1_paddle) and len(self.player_2_paddle)

    def reset_paddles(self):
        self.player_1_paddle = []
        self.player_2_paddle = []

    def get_game_start_data(self):
        return {
            self.player_1: {
                'opponent': self.player_2,
                'paddle': self.player_1_paddle
            },
            self.player_2: {
                'opponent': self.player_1,
                'paddle': self.player_2_paddle
            },
            'ball': self.ball
        }

    def get_data(self):
        return {
            'player_1': self.player_1,
            'player_2': self.player_2,
            'player_2_ready': self.player_2_ready,
            'player_1_paddle': self.player_1_paddle,
            'player_2_paddle': self.player_2_paddle,
            'ball': self.ball,
            'player_1_score': self.player_1_score,
            'player_2_score': self.player_2_score,
            'game_over': self.game_over,
            'winner': self.winner
        }
