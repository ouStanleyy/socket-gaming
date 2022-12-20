import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGameById, joinGame, leaveGame } from "../../store/games";
import styles from "./GameDetails.module.css";

const GameDetails = () => {
  const dispatch = useDispatch();
  const { gameId } = useParams();
  const game = useSelector((state) => state.games[gameId]);
  const sessionId = useSelector((state) => state.session.user.id);

  const join = async () => {
    await dispatch(joinGame(gameId));
  };

  const leave = async () => {
    await dispatch(leaveGame(gameId));
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGameById(gameId));
      } catch (err) {}
    })();
  }, []);

  return (
    <div className={styles.gameDetails}>
      <div className={styles.playersContainer}>
        <h3>Players</h3>
        <div className={styles.playersList}>
          {game?.users.map((user) => (
            <div key={user.id}>{user.username}</div>
          ))}
        </div>
        {!game?.users.find((user) => user.id === sessionId) && (
          <button onClick={join}>Join</button>
        )}
        {game?.users.find((user) => user.id === sessionId) &&
          game.host_id !== sessionId && <button onClick={leave}>Leave</button>}
      </div>
    </div>
  );
};

export default GameDetails;
