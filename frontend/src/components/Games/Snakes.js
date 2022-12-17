import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const sio = useSelector((state) => state.socket.socket);
  const canvasRef = useRef();
  const [snake, setSnake] = useState(null);
  const [snake2, setSnake2] = useState(null);
  const [apple, setApple] = useState(null);
  const [dir, setDir] = useState([0, -1]);
  const [oppDir, setOppDir] = useState([0, 1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(true);
  // const savedCallback = useRef();

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
    APPLE_START.map((_, idx) =>
      Math.floor(Math.random() * (CANVAS_SIZE[idx] / SCALE))
    );

  const createSnake = () => {
    let pos;
    const startPos = SNAKE_START.map((cell, idx) => {
      if (idx === 0) {
        pos = cell.map((_, idx) =>
          Math.floor(Math.random() * (CANVAS_SIZE[idx] / SCALE))
        );
      }
      return pos;
    });
    return startPos;
  };

  const checkCollision = (piece, snk = snake) => {
    for (const cell of snk) {
      if (piece[0] === cell[0] && piece[1] === cell[1]) return true;
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
    sio?.emit("active_game", { snake: snakeCopy });
    // setTimeout(() => sio?.emit("active_game", { snake: snakeCopy }), 1000);
    // setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(createSnake());
    setApple(createApple());
    setDir([0, -1]);
    setSpeed(500);
    setGameOver(false);
    // savedCallback.current();
  };

  const readyUp = () => {
    sio?.emit("game_connect");
  };

  useEffect(() => {
    if (sio) {
      sio?.once("update_game", (data) => {
        setSnake(data[sio.id]);
        // savedCallback.current();
        // setSnake2(data[1]);
      });
    }
  }, [snake]);

  useEffect(() => {
    if (sio) {
      sio?.once("start_game", () => startGame());
    }
  });

  // useEffect(() => {
  //   savedCallback.current = gameLoop;
  // }, [gameLoop]);

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
    snake?.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "lightgray");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    // snake2?.forEach(([x, y], idx) => {
    //   idx === 0 ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "lightgray");
    //   ctx.rect(x, y, 1, 1);
    //   ctx.fillRect(x, y, 1, 1);
    //   ctx.lineWidth = 0.05;
    // });
    // ctx.stroke();
    if (apple) {
      ctx.fillStyle = "lightgreen";
      ctx.rect(apple[0], apple[1], 1, 1);
      ctx.fillRect(apple[0], apple[1], 1, 1);
      ctx.lineWidth = 0.05;
      ctx.stroke();
    }
  }, [snake, apple, gameOver]);

  useInterval(gameLoop, speed, gameOver);

  return (
    <div onKeyDown={moveSnake}>
      <canvas
        style={{ border: "1px solid", backgroundColor: "#ffffff" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {/* <button onClick={startGame}>Start Game</button> */}
      <button onClick={readyUp}>Ready Up</button>
      {gameOver && <div>GAME OVER!</div>}
    </div>
  );
};

export default Snakes;
