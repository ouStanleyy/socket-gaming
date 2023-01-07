export default class Snakes {
  static CANVAS_SIZE = [800, 800];
  static SCALE = 25;
  static SPEED = 100;
  static DIRECTIONS = {
    38: [0, -1], // up
    40: [0, 1], // down
    37: [-1, 0], // left
    39: [1, 0], // right
  };

  constructor() {
    this.snakeOne = [];
    this.snakeTwo = [];
    this.apples = [];
    this.dir = [0, -1];
    this.oppDir = [0, 1];
    this.p1PayloadId = 0;
    this.p2PayloadId = 0;
  }

  static createApple = () =>
    [0, 0].map((_, idx) =>
      Math.floor(Math.random() * (Snakes.CANVAS_SIZE[idx] / Snakes.SCALE))
    );

  static createSnake = () => {
    let pos;
    const startPos = [
      [0, 0],
      [0, 0],
    ].map((cell, idx) => {
      if (idx === 0) {
        pos = cell.map((_, idx) =>
          Math.floor(Math.random() * (Snakes.CANVAS_SIZE[idx] / Snakes.SCALE))
        );
        return pos;
      } else return [pos[0], pos[1] + 1];
    });
    return startPos;
  };

  checkCollision = (
    head,
    snakeOne = this.snakeOne,
    snakeTwo = this.snakeTwo
  ) => {
    for (const cell of snakeOne) {
      if (head[0] === cell[0] && head[1] === cell[1]) return true;
    }
    for (const cell of snakeTwo) {
      if (head[0] === cell[0] && head[1] === cell[1]) return true;
    }
    return false;
  };

  checkAppleCollision = (newSnake) => {
    let result = false;
    this.apples.forEach((apple, idx) => {
      if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
        let newApple = Snakes.createApple();
        while (this.checkCollision(newApple, newSnake)) {
          newApple = Snakes.createApple();
        }
        this.apples[idx] = newApple;
        result = true;
      }
    });
    return result;
  };

  moveSnake = ({ keyCode }) => {
    if (
      keyCode >= 37 &&
      keyCode <= 40 &&
      JSON.stringify(Snakes.DIRECTIONS[keyCode]) !== JSON.stringify(this.oppDir)
    ) {
      this.dir = Snakes.DIRECTIONS[keyCode];
      if (keyCode === 38) this.oppDir = Snakes.DIRECTIONS[40];
      else if (keyCode === 40) this.oppDir = Snakes.DIRECTIONS[38];
      else if (keyCode === 37) this.oppDir = Snakes.DIRECTIONS[39];
      else if (keyCode === 39) this.oppDir = Snakes.DIRECTIONS[37];
    }
  };
}
