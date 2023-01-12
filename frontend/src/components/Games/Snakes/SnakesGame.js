import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useInterval from "./useInterval";
import Snakes from "./snakes-class";

const SnakesGame = () => {
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const sessionId = useSelector((state) => state.session.user.id);
  const game = useSelector((state) => state.games[gameId]);
  // const hostId = useSelector((state) => state.games[gameId]?.host_id);
  const isHost = sessionId === game?.host_id;
  const player = Object.keys(game?.game_data).find(
    (data) => game?.game_data[data] === sessionId
  );
  const canvasRef = useRef();
  const gameRef = useRef();
  const [gameOver, setGameOver] = useState(true);
  // const [otherPlayer, setOtherPlayer] = useState(null);
  const [gameInstance, setGameInstance] = useState({ game: null });
  const [keyCode, setKeyCode] = useState(null);
  const snakeNum = {
    player_1: "snakeOne",
    player_2: "snakeTwo",
    player_3: "snakeThree",
    player_4: "snakeFour",
  };
  const payloadId = {
    player_1: "p1PayloadId",
    player_2: "p2PayloadId",
    player_3: "p3PayloadId",
    player_4: "p4PayloadId",
  };
  const payloads = [
    gameInstance?.game?.p1PayloadId,
    gameInstance?.game?.p2PayloadId,
    gameInstance?.game?.p3PayloadId,
    gameInstance?.game?.p4PayloadId,
  ];
  const maxId = Math.max(...payloads);

  const equalPayloads = () => {
    return payloads.every((payloadId, idx, [p1PayloadId]) => {
      // console.log("payloadId", payloadId);
      // console.log("idx", idx);
      // console.log("maxId", maxId);
      // console.log("p1PayloadId", p1PayloadId);
      // console.log(
      //   "player",
      //   gameInstance.game[snakeNum[`player_${idx + 1}`]].length
      // );
      // console.log("equal", payloadId === p1PayloadId);
      return gameInstance.game[snakeNum[`player_${idx + 1}`]].length
        ? maxId === payloadId
        : true;
    });
  };

  // const gameLoop = () => {
  //   const snake = [...gameInstance.game.snakeOne];
  //   let apples;
  //   const newSnakeHead = [
  //     snake[0][0] + gameInstance.game.dir[0],
  //     snake[0][1] + gameInstance.game.dir[1],
  //   ];
  //   if (newSnakeHead[0] * Snakes.SCALE >= Snakes.CANVAS_SIZE[0])
  //     newSnakeHead[0] = 0;
  //   else if (newSnakeHead[0] < 0)
  //     newSnakeHead[0] = Snakes.CANVAS_SIZE[0] / Snakes.SCALE;
  //   else if (newSnakeHead[1] * Snakes.SCALE >= Snakes.CANVAS_SIZE[1])
  //     newSnakeHead[1] = 0;
  //   else if (newSnakeHead[1] < 0)
  //     newSnakeHead[1] = Snakes.CANVAS_SIZE[1] / Snakes.SCALE;
  //   if (gameInstance.game.checkCollision(newSnakeHead))
  //     sio?.emit("end_game", { gameId });
  //   snake.unshift(newSnakeHead);
  //   if (!gameInstance.game.checkAppleCollision(snake)) snake.pop();
  //   else apples = gameInstance.game.apples;
  //   sio?.emit("update_game", {
  //     gameId,
  //     snake,
  //     apples,
  //     payloadId: gameInstance.game.payloadId,
  //   });
  // };

  const gameLoop = () => {
    // const snake = [...gameInstance.game[isHost ? "snakeOne" : "snakeTwo"]];
    if (gameInstance.game.draw())
      sio?.emit("end_game", { gameId, winner: "draw" });
    const snake = [...gameInstance.game[snakeNum[player]]];
    if (
      snake.length &&
      (equalPayloads() || gameInstance.game[payloadId[player]] < maxId)
    ) {
      gameInstance.game[payloadId[player]] < maxId
        ? (gameInstance.game[payloadId[player]] = maxId)
        : gameInstance.game[payloadId[player]]++;
      if (gameInstance.game.gameOver())
        sio?.emit("end_game", { gameId, winner: sessionId });
      let apples;
      gameInstance.game.moveSnake(keyCode);
      const newSnakeHead = [
        snake[0][0] + gameInstance.game.dir[0],
        snake[0][1] + gameInstance.game.dir[1],
      ];
      if (newSnakeHead[0] * Snakes.SCALE >= Snakes.CANVAS_SIZE[0])
        newSnakeHead[0] = 0;
      if (newSnakeHead[0] < 0)
        newSnakeHead[0] = Snakes.CANVAS_SIZE[0] / Snakes.SCALE;
      if (newSnakeHead[1] * Snakes.SCALE >= Snakes.CANVAS_SIZE[1])
        newSnakeHead[1] = 0;
      if (newSnakeHead[1] < 0)
        newSnakeHead[1] = Snakes.CANVAS_SIZE[1] / Snakes.SCALE;
      snake.unshift(newSnakeHead);
      // sio?.emit("end_game", { gameId });
      if (!gameInstance.game.checkAppleCollision(newSnakeHead)) snake.pop();
      else apples = gameInstance.game.apples;
      if (gameInstance.game.checkCollision(newSnakeHead)) snake.length = 0;
      // else if (gameInstance.game[payloadId[player]] < Math.max(...payloads))
      //   gameInstance.game[payloadId[player]]++;
      sio?.emit("update_game", {
        isHost,
        player,
        gameId,
        gameType: "snakes",
        snake,
        apples,
        payloadId: gameInstance.game[payloadId[player]],
        // payloadId: isHost
        //   ? gameInstance.game.p1PayloadId
        //   : gameInstance.game.p2PayloadId,
      });
      // isHost
      //   ? (gameInstance.game.snakeOne = snake)
      //   : (gameInstance.game.snakeTwo = snake);
      gameInstance.game[snakeNum[player]] = snake;
      // setGameInstance({ game: gameInstance.game });
    }
  };

  // useEffect(() => {
  //   if (gameInstance.game) {
  //     sio.once("update_game", (data) => {
  //       gameInstance.game.snakeTwo = data[otherPlayer];
  //       gameInstance.game.snakeOne = data[sessionId];
  //       gameInstance.game.apples = data.apples;
  //       gameInstance.game.payloadId++;
  //       setGameInstance({ game: gameInstance.game });
  //     });
  //   }
  // }, [gameInstance]);

  // useEffect(() => {
  //   if (gameInstance.game) {
  //     sio.on("update_game", (data) => {
  //       if (data.isHost && data.payloadId === gameInstance.game.p1PayloadId) {
  //         gameInstance.game.p1PayloadId++;
  //         gameInstance.game.snakeOne = data.snake;
  //       } else if (
  //         !data.isHost &&
  //         data.payloadId === gameInstance.game.p2PayloadId
  //       ) {
  //         gameInstance.game.p2PayloadId++;
  //         gameInstance.game.snakeTwo = data.snake;
  //       }
  //       if (data.apples) gameInstance.game.apples = data.apples;
  //       setGameInstance({ game: gameInstance.game });
  //     });
  //   }

  //   return () => sio.off("update_game");
  // }, [gameInstance]);

  useEffect(() => {
    if (gameInstance.game) {
      const update = (data) => {
        // if (data.isHost !== isHost) {
        //   data.isHost
        //     ? (gameInstance.game.snakeOne = data.snake)
        //     : (gameInstance.game.snakeTwo = data.snake);
        if (data.player !== player) {
          gameInstance.game[payloadId[data.player]] = data.payloadId;
          gameInstance.game[snakeNum[data.player]] = data.snake;
          if (data.apples) gameInstance.game.apples = data.apples;
        }
        setGameInstance({ game: gameInstance.game });
      };

      sio.on("update_game", update);
      return () => sio.off("update_game", update);
    }
  }, [gameInstance]);

  // useEffect(() => {
  //   sio.on("start_game", (data) => {
  //     const snakesGame = new Snakes();
  //     setOtherPlayer(data[sessionId].opponent);
  //     snakesGame.snakeOne = data[sessionId].snake;
  //     snakesGame.snakeTwo = data[data[sessionId].opponent].snake;
  //     snakesGame.apples = data.apples;
  //     setGameInstance({ game: snakesGame });
  //     setTimeout(() => setGameOver(false), 2000);
  //     gameRef?.current?.focus();
  //   });
  // }, [sio, gameRef]);

  useEffect(() => {
    sio.on("start_game", (data) => {
      const snakesGame = new Snakes();
      snakesGame.snakeOne = data.snake_one;
      snakesGame.snakeTwo = data.snake_two;
      snakesGame.snakeThree = data.snake_three;
      snakesGame.snakeFour = data.snake_four;
      snakesGame.apples = data.apples;
      setGameInstance({ game: snakesGame });
      if (player) setTimeout(() => setGameOver(false), 2000);
      gameRef?.current?.focus();
    });

    return () => sio.off("start_game");
  }, [sio, gameRef, player]);

  useEffect(() => {
    sio.on("end_game", () => {
      setGameOver(true);
      setGameInstance({ game: null });
    });

    return () => sio.off("end_game");
  }, [sio]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.setTransform(Snakes.SCALE, 0, 0, Snakes.SCALE, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    gameInstance.game?.snakeOne.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "blue") : (ctx.fillStyle = "lightblue");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    gameInstance.game?.snakeTwo.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "green") : (ctx.fillStyle = "lightgreen");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    gameInstance.game?.snakeThree.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "yellow") : (ctx.fillStyle = "lightyellow");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    gameInstance.game?.snakeFour.forEach(([x, y], idx) => {
      idx === 0 ? (ctx.fillStyle = "orangered") : (ctx.fillStyle = "orange");
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
    gameInstance.game?.apples.forEach(([x, y]) => {
      ctx.fillStyle = "darkred";
      ctx.rect(x, y, 1, 1);
      ctx.fillRect(x, y, 1, 1);
      ctx.lineWidth = 0.05;
    });
    ctx.stroke();
  }, [gameInstance]);

  useInterval(gameLoop, Snakes.SPEED, gameOver);

  return (
    <div
      ref={gameRef}
      tabIndex="0"
      onKeyDown={({ keyCode }) => setKeyCode(keyCode)}
    >
      <canvas
        // style={{ border: "1px solid #E8E6E2", backgroundColor: "#181A1B" }}
        style={{ border: "1px solid", backgroundColor: "#ffffff" }}
        ref={canvasRef}
        width={`${Snakes.CANVAS_SIZE[0]}px`}
        height={`${Snakes.CANVAS_SIZE[1]}px`}
      />
    </div>
  );
};

export default SnakesGame;
