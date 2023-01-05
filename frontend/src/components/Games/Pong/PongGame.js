import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useInterval from "./useInterval";
import Pong from "./pong-class";

const PongGame = () => {
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const sessionId = useSelector((state) => state.session.user.id);
  const hostId = useSelector((state) => state.games[gameId]?.host_id);
  const isHost = sessionId === hostId;
  const canvasRef = useRef();
  const gameRef = useRef();
  const [gameOver, setGameOver] = useState(true);
  const [otherPlayer, setOtherPlayer] = useState(null);
  const [gameInstance, setGameInstance] = useState({ game: null });
  // const [ctx, setCtx] = useState(null);
  const [keyCode, setKeyCode] = useState(null);

  const gameLoop = () => {
    if (!gameInstance.game?.paused || !isHost) {
      let ball, scorer, paused, scores;
      gameInstance.game?.movePaddle({ keyCode, isHost });
      if (isHost) {
        gameInstance.game?.moveBall();
        ball = [gameInstance.game?.ballX, gameInstance.game?.ballY];
        scorer = gameInstance.game.scorer;
        scores = {
          p1Score: gameInstance.game.p1Score,
          p2Score: gameInstance.game.p2Score,
        };
        paused = gameInstance.game.paused;
      }
      const paddle = isHost
        ? [gameInstance.game?.p1X, gameInstance.game?.p1Y]
        : [gameInstance.game?.p2X, gameInstance.game?.p2Y];
      // const ball = isHost
      //   ? [gameInstance.game?.ballX, gameInstance.game?.ballY]
      //   : undefined;
      // console.log("gameloop", gameInstance.game.paused);
      sio?.emit("update_game", {
        gameId,
        paddle,
        ball,
        scorer,
        scores,
        paused,
        payloadId: gameInstance.game.payloadId,
      });
    }
    // setGameInstance({ game: gameInstance.game });
  };

  // const startGame = () => {
  //   const pongGame = new Pong();
  //   setGameInstance({ game: pongGame });
  //   setTimeout(() => {
  //     setGameOver(false);
  //     pongGame.serve(1);
  //   }, 2000);
  //   gameRef?.current?.focus();
  // };

  // const stopGame = () => {
  //   clearInterval(this._loop);
  //   this._loop = null;
  //   setTimeout(() => {
  //     this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  //   }, 0);
  // };

  useEffect(() => {
    if (gameInstance.game) {
      sio.once("update_game", (data) => {
        gameInstance.game.p1X = isHost
          ? data[sessionId][0]
          : data[otherPlayer][0];
        gameInstance.game.p1Y = isHost
          ? data[sessionId][1]
          : data[otherPlayer][1];
        gameInstance.game.p2X = !isHost
          ? data[sessionId][0]
          : data[otherPlayer][0];
        gameInstance.game.p2Y = !isHost
          ? data[sessionId][1]
          : data[otherPlayer][1];
        gameInstance.game.ballX = data.ball[0];
        gameInstance.game.ballY = data.ball[1];
        // console.log("here", data.scorer, data.paused);
        if (!isHost) {
          gameInstance.game.scorer = data.scorer;
          gameInstance.game.paused = data.paused;
        }
        gameInstance.game.payloadId++;
        setGameInstance({ game: gameInstance.game });
      });
    }
  }, [gameInstance]);

  useEffect(() => {
    sio.on("start_game", (data) => {
      const pongGame = new Pong();
      // const pongGame = new Pong(canvasRef?.current?.getContext("2d"));
      // setCtx(canvasRef?.current?.getContext("2d"));
      setOtherPlayer(data[sessionId].opponent);
      setGameInstance({ game: pongGame });
      setTimeout(() => {
        setGameOver(false);
        pongGame.serve(1);
      }, 2000);
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
    // ctx.setTransform(Pong.SCALE, 0, 0, Pong.SCALE, 0, 0);
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
      // Ball
      // ctx.lineWidth = 2;
      ctx.fillStyle = "lightblue";
      ctx.arc(
        gameInstance.game?.ballX,
        gameInstance.game?.ballY,
        Pong.BALL_SIZE,
        0,
        2 * Math.PI
      );
      ctx.fill();
      // ctx.strokeStyle = "#fff";
      // ctx.stroke();
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
      // ctx.stroke();
      // Player 2
      // ctx.fillStyle = "lightgray";
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
      ctx.lineWidth = 2;
      ctx.stroke();
      if (gameInstance.game?.paused) {
        ctx.font = "30px Arial";
        ctx.lineWidth = 6;
        ctx.strokeText(
          gameInstance.game.scorer + " score!",
          Pong.CANVAS_SIZE[0] / 2 - 100,
          Pong.CANVAS_SIZE[1] / 2
        );
        ctx.fillStyle = "red";
        ctx.fillText(
          gameInstance.game.scorer + " score!",
          Pong.CANVAS_SIZE[0] / 2 - 100,
          Pong.CANVAS_SIZE[1] / 2
        );
      }
      // if (gameInstance.game?.paused) gameInstance.game.drawScore();
    }
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
      {/* <button onClick={startGame}>Start</button> */}
    </div>
  );
};

export default PongGame;
