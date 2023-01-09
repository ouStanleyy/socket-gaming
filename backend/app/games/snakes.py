class Snakes:
    def __init__(self, player_1=None, game_data={}):
        self.player_1 = game_data.get('player_1', player_1)
        self.player_2 = game_data.get('player_2', None)
        self.player_3 = game_data.get('player_3', None)
        self.player_4 = game_data.get('player_4', None)
        self.player_2_ready = game_data.get('player_2_ready', False)
        self.player_3_ready = game_data.get('player_3_ready', False)
        self.player_4_ready = game_data.get('player_4_ready', False)
        self.player_1_snake = game_data.get('player_1_snake', [])
        self.player_2_snake = game_data.get('player_2_snake', [])
        self.player_3_snake = game_data.get('player_3_snake', [])
        self.player_4_snake = game_data.get('player_4_snake', [])
        self.apples = game_data.get('apples', [])
        self.game_over = game_data.get('game_over', False)
        self.winner = game_data.get('winner', None)
        self.payload_id = game_data.get('payload_id', 0)

    def get_players(self):
        return [self.player_1, self.player_2]

    def get_snakes_and_apples(self):
        return {
            self.player_1: self.player_1_snake,
            self.player_2: self.player_2_snake,
            'apples': self.apples
        }

    def update_ready(self):
        return len(self.player_1_snake) and len(self.player_2_snake)

    def player_1_snake_ready(self):
        return len(self.player_1_snake)

    def player_2_snake_ready(self):
        return len(self.player_2_snake)

    def reset_snakes(self):
        self.player_1_snake = []
        self.player_2_snake = []

    def inc_payload_id(self):
        self.payload_id+=1

    # def get_game_start_data(self):
    #     return {
    #         self.player_1: {
    #             'opponent': self.player_2,
    #             'snake': self.player_1_snake
    #         },
    #         self.player_2: {
    #             'opponent': self.player_1,
    #             'snake': self.player_2_snake
    #         },
    #         'apples': self.apples
    #     }

    def get_game_start_data(self):
        return {
            'snake_one': self.player_1_snake,
            'snake_two': self.player_2_snake,
            'snake_three': self.player_3_snake,
            'snake_four': self.player_4_snake,
            'apples': self.apples
        }

    def get_data(self):
        return {
            'player_1': self.player_1,
            'player_2': self.player_2,
            'player_3': self.player_3,
            'player_4': self.player_4,
            'player_2_ready': self.player_2_ready,
            'player_3_ready': self.player_3_ready,
            'player_4_ready': self.player_4_ready,
            'player_1_snake': self.player_1_snake,
            'player_2_snake': self.player_2_snake,
            'player_3_snake': self.player_3_snake,
            'player_4_snake': self.player_4_snake,
            'apples': self.apples,
            'game_over': self.game_over,
            'winner': self.winner,
            'payload_id': self.payload_id
        }
