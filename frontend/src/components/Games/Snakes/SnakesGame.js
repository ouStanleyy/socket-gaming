import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useInterval from "./useInterval";
import Snakes from "./snakes-class";

const SnakesGame = () => {
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const sessionId = useSelector((state) => state.session.user.id);
  const canvasRef = useRef();
  const gameRef = useRef();
  const [gameOver, setGameOver] = useState(true);
  const [otherPlayer, setOtherPlayer] = useState(null);
  const [gameInstance, setGameInstance] = useState({ game: null });

  const gameLoop = () => {
    const snake = [...gameInstance.game.snakeOne];
    let apples;
    const newSnakeHead = [
      snake[0][0] + gameInstance.game.dir[0],
      snake[0][1] + gameInstance.game.dir[1],
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
    snake.unshift(newSnakeHead);
    if (!gameInstance.game.checkAppleCollision(snake)) snake.pop();
    else apples = gameInstance.game.apples;
    sio?.emit("update_game", {
      gameId,
      snake,
      apples,
      payloadId: gameInstance.game.payloadId,
    });
  };

  useEffect(() => {
    if (gameInstance.game) {
      sio.once("update_game", (data) => {
        gameInstance.game.snakeTwo = data[otherPlayer];
        gameInstance.game.snakeOne = data[sessionId];
        gameInstance.game.apples = data.apples;
        gameInstance.game.payloadId++;
        setGameInstance({ game: gameInstance.game });
      });
    }
  }, [gameInstance]);

  useEffect(() => {
    sio.on("start_game", (data) => {
      const snakesGame = new Snakes();
      setOtherPlayer(data[sessionId].opponent);
      snakesGame.snakeOne = data[sessionId].snake;
      snakesGame.snakeTwo = data[data[sessionId].opponent].snake;
      snakesGame.apples = data.apples;
      setGameInstance({ game: snakesGame });
      setTimeout(() => setGameOver(false), 2000);
      gameRef?.current?.focus();
    });
  }, [sio, gameRef]);

  useEffect(() => {
    sio.on("end_game", () => {
      setGameOver(true);
      setGameInstance({ game: null });
    });
  }, [sio]);

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
    gameInstance.game?.apples.forEach(([x, y]) => {
      ctx.fillStyle = "lightgreen";
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
  }, [gameInstance]);

  useInterval(gameLoop, Snakes.SPEED, gameOver);

  return (
    <div ref={gameRef} tabIndex="0" onKeyDown={gameInstance.game?.moveSnake}>
      <canvas
        style={{ border: "1px solid", backgroundColor: "#ffffff" }}
        ref={canvasRef}
        width={`${Snakes.CANVAS_SIZE[0]}px`}
        height={`${Snakes.CANVAS_SIZE[1]}px`}
      />
    </div>
  );
};

export default SnakesGame;
