import GameDisplay from "./GameDisplay";
import GameDetails from "./GameDetails";
import styles from "./GameLobby.module.css";

const GameLobby = () => {
  return (
    <div className={styles.gameLobby}>
      <GameDisplay />
      <GameDetails />
    </div>
  );
};

export default GameLobby;
