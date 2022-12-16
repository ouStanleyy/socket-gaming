import { useState, useRef, useEffect } from "react";
import useInterval from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";

const Snakes = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState([-1, -1]);
  const [dir, setDir] = useState([0, -1]);
  const [oppDir, setOppDir] = useState([0, 1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const moveSnake = ({ keyCode }) => {
    if (
      keyCode >= 37 &&
      keyCode <= 40 &&
      JSON.stringify(DIRECTIONS[keyCode]) !== JSON.stringify(oppDir)
    ) {
      setDir(DIRECTIONS[keyCode]);
      if (keyCode === 38) setOppDir(DIRECTIONS[40]);
      else if (keyCode === 40) setOppDir(DIRECTIONS[38]);
      else if (keyCode === 37) setOppDir(DIRECTIONS[39]);
      else if (keyCode === 39) setOppDir(DIRECTIONS[37]);
    }
  };

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    // if (
    //   piece[0] * SCALE >= CANVAS_SIZE[0] ||
    //   piece[0] < 0 ||
    //   piece[1] * SCALE >= CANVAS_SIZE[1] ||
    //   piece[1] < 0
    // )
    //   return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = [...snake];
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    if (newSnakeHead[0] * SCALE >= CANVAS_SIZE[0]) newSnakeHead[0] = 0;
    else if (newSnakeHead[0] < 0) newSnakeHead[0] = CANVAS_SIZE[0] / SCALE;
    else if (newSnakeHead[1] * SCALE >= CANVAS_SIZE[1]) newSnakeHead[1] = 0;
    else if (newSnakeHead[1] < 0) newSnakeHead[1] = CANVAS_SIZE[1] / SCALE;
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(createApple());
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  //   useEffect(() => {
  //     if (speed !== null) {
  //       //   console.log("hi");
  //       const interval = setInterval(gameLoop, 1000);
  //       return () => clearInterval(interval);
  //     }
  //   }, [speed]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    snake.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "lightgray");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    if (apple) {
      ctx.fillStyle = "lightgreen";
      ctx.rect(apple[0], apple[1], 1, 1);
      ctx.fillRect(apple[0], apple[1], 1, 1);
      ctx.lineWidth = 0.05;
      ctx.stroke();
    }
  }, [snake, apple, gameOver]);

  useInterval(gameLoop, speed);

  return (
    <div onKeyDown={moveSnake}>
      <canvas
        style={{ border: "1px solid" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>GAME OVER!</div>}
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Snakes;
