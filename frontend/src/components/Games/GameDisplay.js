import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SnakesGame } from "./Snakes";
import { PongGame } from "./Pong";

const GameDisplay = () => {
  const { gameId } = useParams();
  const gameType = useSelector((state) => state.games[gameId]?.game_type);

  return (
    <>
      {gameType === "snakes" && <SnakesGame />}
      {gameType === "pong" && <PongGame />}
    </>
  );
};

export default GameDisplay;
