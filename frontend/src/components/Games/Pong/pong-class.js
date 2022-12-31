import _ from "lodash";

export default class Pong {
  static CANVAS_SIZE = [700, 400];
  // static SCALE = 25;
  static SPEED = 25;
  // static DIRECTIONS = {
  //   38: [0, -1], // up
  //   40: [0, 1], // down
  // };
  static PADDLE_HEIGHT = 80;
  static PADDLE_WIDTH = 20;
  static PADDLE_SPEED = 15;
  static BALL_SIZE = 10;
  // static PI = Math.PI;
  // static RAND = Math.random();

  constructor() {
    this.ballX = 100;
    this.ballY = 100;
    this.ballSpeed = 10;
    this.velX = 0;
    this.velY = 0;
    this.p1X = 10;
    this.p1Y = 100;
    this.p2X = 670;
    this.p2Y = 100;
    this.p1Score = 0;
    this.p2Score = 0;
  }

  // _score(name) {
  //   const state = this.state;
  //   const scorer = { player: "ai", ai: "player" }[name];
  //   this.setState({
  //     [scorer + "Score"]: state[scorer + "Score"] + 1,
  //   });
  //   this._stopGame();
  //   setTimeout(() => {
  //     this._context.font = "30px Arial";
  //     this._context.fillText(
  //       scorer + " score!",
  //       this.props.width / 2,
  //       this.props.height / 2
  //     );
  //     this._context.restore();
  //   }, 0);

  //   setTimeout(() => {
  //     this._setupCanvas();
  //     this._startGame();
  //   }, 1000);
  // }
  // _draw() {
  //   // draw background
  //   const state = this.state;
  //   this._context.fillRect(0, 0, this.props.width, this.props.height);
  //   this._context.save();
  //   this._context.fillStyle = "#fff";

  //   // draw scoreboard
  //   this._context.font = "10px Arial";
  //   this._context.fillText("Player: " + state.playerScore, 10, 10);
  //   this._context.fillText("CPU: " + state.aiScore, 500, 10);

  //   //draw ball
  //   this._ball().draw();

  //   //draw paddles
  //   this._player().draw();
  //   this._ai().draw();
  //   // draw the net
  //   const w = 4;
  //   const x = (this.props.width - w) * 0.5;
  //   let y = 0;
  //   const step = this.props.height / 20; // how many net segments
  //   while (y < this.props.height) {
  //     this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
  //     y += step;
  //   }

  //   this._context.restore();
  // }

  moveBall = () => {
    const bX = this.ballX;
    const bY = this.ballY;
    const vX = this.velX;
    const vY = this.velY;

    this.ballX = bX + vX;
    this.ballY = bY + vY;

    if (0 > bY || bY + Pong.BALL_SIZE > Pong.CANVAS_SIZE[1]) {
      const offset =
        this.velY < 0
          ? 0 - this.ballY
          : Pong.CANVAS_SIZE[1] - (this.ballY + Pong.BALL_SIZE);

      this.ballY = bY + 2 * offset;
      this.velY = vY * -1;
    }

    const paddle = this.velX < 0 ? [this.p1X, this.p1Y] : [this.p2X, this.p2Y];

    if (
      paddle[0] < this.ballX + Pong.BALL_SIZE &&
      paddle[1] < this.ballY + Pong.BALL_SIZE &&
      this.ballX < paddle[0] + Pong.PADDLE_WIDTH &&
      this.ballY < paddle[1] + Pong.PADDLE_HEIGHT
    ) {
      const dir = this.velX < 0 ? 1 : -1;
      const n =
        (this.ballY + Pong.BALL_SIZE - paddle[1]) /
        (Pong.PADDLE_HEIGHT + Pong.BALL_SIZE);
      const yDir = (n > 0.5 ? -1 : 1) * dir;
      const phi = 0.25 * Math.PI * (2 * n + dir) + Math.random();
      const smash = Math.abs(phi) > 0.2 * Math.PI ? 1.1 : 1;

      this.ballX =
        this.velX < 0
          ? this.p1X + Pong.PADDLE_WIDTH
          : this.p2X - Pong.BALL_SIZE;
      this.velX = smash * -1 * this.velX;
      this.velY = smash * yDir * this.velX * Math.sin(phi);
    }

    if (0 > this.ballX + Pong.BALL_SIZE || this.ballX > Pong.CANVAS_SIZE[0]) {
      // score(pdle.name());
      this.serve(this.velX < 0 ? 1 : -1);
    }
  };

  serve = (side) => {
    const pi = Math.PI;
    const rand = Math.random();
    const phi = 0.1 * pi * (1 - 2 * rand);

    this.ballX =
      side === 1 ? this.p1X + Pong.PADDLE_WIDTH : this.p2X - Pong.BALL_SIZE;
    this.ballY = (Pong.CANVAS_SIZE[1] - Pong.BALL_SIZE) * rand;
    this.velX = this.ballSpeed * Math.cos(phi) * side;
    this.velY = this.ballSpeed * Math.sin(phi);
  };

  movePaddle = ({ keyCode, isHost }) => {
    if (keyCode === 38) {
      isHost
        ? (this.p1Y -= Pong.PADDLE_SPEED)
        : (this.p2Y -= Pong.PADDLE_SPEED);
    } else if (keyCode === 40) {
      isHost
        ? (this.p1Y += Pong.PADDLE_SPEED)
        : (this.p2Y += Pong.PADDLE_SPEED);
    }

    // keep the paddle inside of the canvas
    this.p1Y = Math.max(
      Math.min(this.p1Y, Pong.CANVAS_SIZE[1] - Pong.PADDLE_HEIGHT),
      0
    );
    this.p2Y = Math.max(
      Math.min(this.p2Y, Pong.CANVAS_SIZE[1] - Pong.PADDLE_HEIGHT),
      0
    );
  };
}
