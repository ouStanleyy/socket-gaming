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
    this.snakeThree = [];
    this.snakeFour = [];
    this.apples = [];
    this.powerUp = null;
    this.dir = [0, -1];
    this.currOppDir = [0, 1];
    this.newOppDir = [0, 1];
    this.p1PayloadId = 0;
    this.p2PayloadId = 0;
    this.p3PayloadId = 0;
    this.p4PayloadId = 0;
  }

  static createApple = () =>
    [0, 0, 0].map((_, idx) =>
      Math.floor(
        Math.random() * (idx < 2 ? Snakes.CANVAS_SIZE[idx] / Snakes.SCALE : 10)
      )
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

  checkCollision = (newCell, newSnakeHead = []) => {
    if (newCell[0] === newSnakeHead[0] && newCell[1] === newSnakeHead[1])
      return true;
    for (const body of this.snakeOne) {
      if (newCell[0] === body[0] && newCell[1] === body[1]) return true;
    }
    for (const body of this.snakeTwo) {
      if (newCell[0] === body[0] && newCell[1] === body[1]) return true;
    }
    for (const body of this.snakeThree) {
      if (newCell[0] === body[0] && newCell[1] === body[1]) return true;
    }
    for (const body of this.snakeFour) {
      if (newCell[0] === body[0] && newCell[1] === body[1]) return true;
    }
    return false;
  };

  checkAppleCollision = (newSnakeHead) => {
    let result = false;
    this.apples.forEach((apple, idx) => {
      if (newSnakeHead[0] === apple[0] && newSnakeHead[1] === apple[1]) {
        if (apple[2] >= 8) this.powerUp = "break";

        let newApple = Snakes.createApple();
        while (this.checkCollision(newApple, newSnakeHead)) {
          newApple = Snakes.createApple();
        }
        this.apples[idx] = newApple;
        result = true;
      }
    });
    return result;
  };

  moveSnake = (keyCode) => {
    if (
      keyCode >= 37 &&
      keyCode <= 40 &&
      JSON.stringify(Snakes.DIRECTIONS[keyCode]) !==
        JSON.stringify(this.newOppDir)
    ) {
      this.dir = Snakes.DIRECTIONS[keyCode];
      if (keyCode === 38) {
        this.newOppDir = Snakes.DIRECTIONS[40];
      } else if (keyCode === 40) {
        this.newOppDir = Snakes.DIRECTIONS[38];
      } else if (keyCode === 37) {
        this.newOppDir = Snakes.DIRECTIONS[39];
      } else if (keyCode === 39) {
        this.newOppDir = Snakes.DIRECTIONS[37];
      }
      // if (keyCode === 38) {
      //   this.newOppDir = Snakes.DIRECTIONS[40];
      //   setTimeout(() => (this.currOppDir = Snakes.DIRECTIONS[40]), 75);
      // } else if (keyCode === 40) {
      //   this.newOppDir = Snakes.DIRECTIONS[38];
      //   setTimeout(() => (this.currOppDir = Snakes.DIRECTIONS[38]), 75);
      // } else if (keyCode === 37) {
      //   this.newOppDir = Snakes.DIRECTIONS[39];
      //   setTimeout(() => (this.currOppDir = Snakes.DIRECTIONS[39]), 75);
      // } else if (keyCode === 39) {
      //   this.newOppDir = Snakes.DIRECTIONS[37];
      //   setTimeout(() => (this.currOppDir = Snakes.DIRECTIONS[37]), 75);
      // }
    }
  };

  gameOver = () => {
    let players = 0;
    if (this.snakeOne.length) players++;
    if (this.snakeTwo.length) players++;
    if (this.snakeThree.length) players++;
    if (this.snakeFour.length) players++;

    return players === 1;
  };

  draw = () => {
    let players = 0;
    if (this.snakeOne.length) players++;
    if (this.snakeTwo.length) players++;
    if (this.snakeThree.length) players++;
    if (this.snakeFour.length) players++;

    return players === 0;
  };
}
