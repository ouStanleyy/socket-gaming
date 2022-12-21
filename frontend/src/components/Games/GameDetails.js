import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  getGameById,
  joinGame,
  leaveGame,
  deleteGame,
} from "../../store/games";
import styles from "./GameDetails.module.css";

const GameDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const game = useSelector((state) => state.games[gameId]);
  const sessionId = useSelector((state) => state.session.user.id);

  const join = async () => {
    await dispatch(joinGame(gameId));
  };

  const leave = async () => {
    await dispatch(leaveGame(gameId));
  };

  const closeLobby = async () => {
    await dispatch(deleteGame(gameId));
    history.push("/games");
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGameById(gameId));
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    if (sio)
      sio?.once("update_game_lobby", () => dispatch(getGameById(gameId)));
  }, [sio, game]);

  useEffect(() => {
    if (sio) sio?.once("close_game_lobby", () => history.push("/games"));
  }, [sio, game]);

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
        {game?.host_id === sessionId && (
          <button onClick={closeLobby}>Close Lobby</button>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
