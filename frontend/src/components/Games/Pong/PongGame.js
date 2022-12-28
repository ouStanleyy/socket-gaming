import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useInterval from "./useInterval";
import Pong from "./pong-class";

const PongGame = () => {
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const sessionId = useSelector((state) => state.session.user.id);
  const canvasRef = useRef();
  const gameRef = useRef();
  const [gameOver, setGameOver] = useState(true);
  const [otherPlayer, setOtherPlayer] = useState(null);
  const [gameInstance, setGameInstance] = useState({ game: null });
  const [keyCode, setKeyCode] = useState(null);

  const gameLoop = () => {
    gameInstance.game?.movePaddle({ keyCode });
    gameInstance.game?.moveBall();
    setGameInstance({ game: gameInstance.game });
  };

  const startGame = () => {
    const pongGame = new Pong();
    setGameInstance({ game: pongGame });
    setTimeout(() => {
      setGameOver(false);
      pongGame.serve(1);
    }, 2000);
    gameRef?.current?.focus();
  };

  // const stopGame = () => {
  //   clearInterval(this._loop);
  //   this._loop = null;
  //   setTimeout(() => {
  //     this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  //   }, 0);
  // };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    // ctx.setTransform(Pong.SCALE, 0, 0, Pong.SCALE, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    // Ball
    ctx.fillStyle = "lightblue";
    ctx.arc(
      gameInstance.game?.ballX,
      gameInstance.game?.ballY,
      Pong.BALL_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
    // ctx.lineWidth = 0;
    // ctx.strokeStyle = "#fff";
    ctx.stroke();
    // Player 1
    ctx.fillStyle = "lightgray";
    ctx.rect(
      gameInstance.game?.p1X,
      gameInstance.game?.p1Y,
      Pong.PADDLE_WIDTH,
      Pong.PADDLE_HEIGHT
    );
    ctx.fillRect(
      gameInstance.game?.p1X,
      gameInstance.game?.p1Y,
      Pong.PADDLE_WIDTH,
      Pong.PADDLE_HEIGHT
    );
    // ctx.lineWidth = 1;
    ctx.stroke();
    // Player 2
    ctx.fillStyle = "lightgray";
    ctx.rect(
      gameInstance.game?.p2X,
      gameInstance.game?.p2Y,
      Pong.PADDLE_WIDTH,
      Pong.PADDLE_HEIGHT
    );
    ctx.fillRect(
      gameInstance.game?.p2X,
      gameInstance.game?.p2Y,
      Pong.PADDLE_WIDTH,
      Pong.PADDLE_HEIGHT
    );
    // ctx.lineWidth = 0.05;
    ctx.stroke();
  }, [gameInstance]);

  useInterval(gameLoop, Pong.SPEED, gameOver);

  return (
    <div
      ref={gameRef}
      tabIndex="0"
      onKeyDown={({ keyCode }) => setKeyCode(keyCode)}
      onKeyUp={() => setKeyCode(null)}
    >
      <canvas
        style={{ border: "1px solid", backgroundColor: "#ffffff" }}
        ref={canvasRef}
        width={`${Pong.CANVAS_SIZE[0]}px`}
        height={`${Pong.CANVAS_SIZE[1]}px`}
      />
      <button onClick={startGame}>Start</button>
    </div>
  );
};

export default PongGame;
