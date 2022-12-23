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
import Snakes from "./snakes-class";
import { useParams } from "react-router-dom";

const SnakesGame = () => {
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const sessionId = useSelector((state) => state.session.user.id);
  const canvasRef = useRef();
  const gameRef = useRef();
  // const [snake, setSnake] = useState(null);
  // const [snake2, setSnake2] = useState(null);
  // const [apple, setApple] = useState(null);
  // const [dir, setDir] = useState([0, -1]);
  // const [oppDir, setOppDir] = useState([0, 1]);
  // const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(true);
  const [otherPlayer, setOtherPlayer] = useState(null);
  const [gameInstance, setGameInstance] = useState({ game: null });
  // const savedCallback = useRef();

  const endGame = () => {
    // setSpeed(null);
    setGameOver(true);
  };

  // const moveSnake = ({ keyCode }) => {
  //   if (
  //     keyCode >= 37 &&
  //     keyCode <= 40 &&
  //     JSON.stringify(DIRECTIONS[keyCode]) !== JSON.stringify(oppDir)
  //   ) {
  //     setDir(DIRECTIONS[keyCode]);
  //     if (keyCode === 38) setOppDir(DIRECTIONS[40]);
  //     else if (keyCode === 40) setOppDir(DIRECTIONS[38]);
  //     else if (keyCode === 37) setOppDir(DIRECTIONS[39]);
  //     else if (keyCode === 39) setOppDir(DIRECTIONS[37]);
  //   }
  // };

  // const createApple = () =>
  //   [0, 0].map((_, idx) =>
  //     Math.floor(Math.random() * (CANVAS_SIZE[idx] / SCALE))
  //   );

  // const createSnake = () => {
  //   let pos;
  //   const startPos = [
  //     [0, 0],
  //     [0, 0],
  //   ].map((cell, idx) => {
  //     if (idx === 0) {
  //       pos = cell.map((_, idx) =>
  //         Math.floor(Math.random() * (CANVAS_SIZE[idx] / SCALE))
  //       );
  //       return pos;
  //     } else {
  //       return [pos[0], pos[1] + 1];
  //     }
  //   });
  //   return startPos;
  // };

  // const checkCollision = (head, snk = snake, snk2 = snake2) => {
  //   for (const cell of snk) {
  //     if (head[0] === cell[0] && head[1] === cell[1]) return true;
  //   }
  //   for (const cell of snk2) {
  //     if (head[0] === cell[0] && head[1] === cell[1]) return true;
  //   }
  //   return false;
  // };

  // const checkAppleCollision = (newSnake) => {
  //   if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
  //     let newApple = createApple();
  //     while (checkCollision(newApple, newSnake)) {
  //       newApple = createApple();
  //     }
  //     setApple(newApple);
  //     return true;
  //   }
  //   return false;
  // };

  const gameLoop = () => {
    const snakeCopy = [...gameInstance.game.snakeOne];
    const newSnakeHead = [
      snakeCopy[0][0] + gameInstance.game.dir[0],
      snakeCopy[0][1] + gameInstance.game.dir[1],
    ];
    if (newSnakeHead[0] * Snakes.SCALE >= Snakes.CANVAS_SIZE[0])
      newSnakeHead[0] = 0;
    else if (newSnakeHead[0] < 0)
      newSnakeHead[0] = Snakes.CANVAS_SIZE[0] / Snakes.SCALE;
    else if (newSnakeHead[1] * Snakes.SCALE >= Snakes.CANVAS_SIZE[1])
      newSnakeHead[1] = 0;
    else if (newSnakeHead[1] < 0)
      newSnakeHead[1] = Snakes.CANVAS_SIZE[1] / Snakes.SCALE;
    if (gameInstance.game.checkCollision(newSnakeHead))
      sio?.emit("end_game", { gameId });
    snakeCopy.unshift(newSnakeHead);
    if (!gameInstance.game.checkAppleCollision(snakeCopy)) snakeCopy.pop();
    sio?.emit("update_game", { gameId, snake: snakeCopy });
    // setTimeout(() => sio?.emit("active_game", { snake: snakeCopy }), 1000);
    // setSnake(snakeCopy);
  };

  const startGame = () => {
    // setSnake(createSnake());
    // setSnake2(createSnake());
    // setApple(createApple());
    // gameInstance.apple = gameInstance.createApple();
    // setDir([0, -1]);
    // setSpeed(100);
    setGameOver(false);
    // savedCallback.current();
  };

  // const readyUp = () => {
  //   sio?.emit("game_connect", { snake: createSnake() });
  // };

  useEffect(() => {
    if (gameInstance.game) {
      sio.once("update_game", (data) => {
        // setTimeout(() => setSnake(data[sio.id]), 3);
        // console.log("other player", data[otherPlayer]);
        // console.log("player", data[sessionId]);
        gameInstance.game.snakeTwo = data[otherPlayer];
        gameInstance.game.snakeOne = data[sessionId];
        setGameInstance({ game: gameInstance.game });
        // savedCallback.current();
        // setSnake2(data[1]);
      });
    }
  }, [gameInstance]);
  // useEffect(() => {
  //   if (gameInstance.game) {
  //     sio?.once("update_game", (data) => {
  //       // setTimeout(() => setSnake(data[sio.id]), 3);
  //       // console.log("hello", gameInstance);
  //       gameInstance.game.snakeTwo = data[otherPlayer];
  //       gameInstance.game.snakeOne = data[sio.id];
  //       setGameInstance({ game: gameInstance.game });
  //       // savedCallback.current();
  //       // setSnake2(data[1]);
  //     });
  //   }
  // }, [gameInstance]);
  // useEffect(() => {
  //   if (sio) {
  //     sio?.once("update_game", (data) => {
  //       // setTimeout(() => setSnake(data[sio.id]), 3);
  //       setSnake2(data[otherPlayer]);
  //       setSnake(data[sio.id]);
  //       // savedCallback.current();
  //       // setSnake2(data[1]);
  //     });
  //   }
  // }, [snake]);

  useEffect(() => {
    sio.on("start_game", (data) => {
      const snakesGame = new Snakes();
      setOtherPlayer(data[sessionId].opponent);
      snakesGame.snakeTwo = data[data[sessionId].opponent].snake;
      snakesGame.snakeOne = data[sessionId].snake;
      setGameInstance({ game: snakesGame });
      setTimeout(() => startGame(), 2000);
      gameRef.current.focus();
    });
  }, [sio]);
  // useEffect(() => {
  //   if (sio) {
  //     sio?.once("start_game", (data) => {
  //       const snakesGame = new Snakes();
  //       setOtherPlayer(data[0][0] === sio.id ? data[0][1] : data[0][0]);
  //       snakesGame.snakeTwo =
  //         data[1][data[0][0] === sio.id ? data[0][1] : data[0][0]];
  //       snakesGame.snakeOne = data[1][sio.id];
  //       setGameInstance({ game: snakesGame });
  //       setTimeout(() => startGame(), 2000);
  //     });
  //   }
  // });

  // useEffect(() => {
  //   if (sio) {
  //     sio?.once("start_game", (data) => {
  //       setOtherPlayer(data[0][0] === sio.id ? data[0][1] : data[0][0]);
  //       setSnake2(data[1][data[0][0] === sio.id ? data[0][1] : data[0][0]]);
  //       setSnake(data[1][sio.id]);
  //       setTimeout(() => startGame(), 2000);
  //     });
  //   }
  // });

  useEffect(() => {
    sio.on("end_game", () => {
      endGame();
      setGameInstance({ game: null });
      // setOtherPlayer(null);
    });
  }, [sio]);

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
    ctx.setTransform(Snakes.SCALE, 0, 0, Snakes.SCALE, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    gameInstance.game?.snakeOne.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "lightgray");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    gameInstance.game?.snakeTwo.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "lightgray");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    if (gameInstance.game?.apple) {
      const [x, y] = gameInstance.game.apple;
      ctx.fillStyle = "lightgreen";
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
      ctx.stroke();
    }
  }, [gameInstance]);

  useInterval(gameLoop, Snakes.SPEED, gameOver);
  // console.log("here", gameInstance);

  return (
    <div ref={gameRef} tabIndex="0" onKeyDown={gameInstance.game?.moveSnake}>
      <canvas
        style={{ border: "1px solid", backgroundColor: "#ffffff" }}
        ref={canvasRef}
        width={`${Snakes.CANVAS_SIZE[0]}px`}
        height={`${Snakes.CANVAS_SIZE[1]}px`}
        // width={`${CANVAS_SIZE[0]}px`}
        // height={`${CANVAS_SIZE[1]}px`}
      />
      {/* <button onClick={startGame}>Start Game</button> */}
      {/* <button onClick={readyUp}>Ready Up</button>
      {gameOver && <div>GAME OVER!</div>} */}
    </div>
  );
};

export default SnakesGame;
