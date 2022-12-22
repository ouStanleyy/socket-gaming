import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  getGameById,
  joinGame,
  leaveGame,
  deleteGame,
  loadGameDetails,
  updateReadyState,
  startGame,
} from "../../store/games";
import styles from "./GameDetails.module.css";

const GameDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const game = useSelector((state) => state.games[gameId]);
  const sessionId = useSelector((state) => state.session.user.id);
  const [ready, setReady] = useState(game?.game_data.player_2_ready);

  const join = () => {
    setReady(false);
    dispatch(joinGame(gameId));
  };

  const leave = () => {
    setReady(false);
    dispatch(leaveGame(gameId));
  };

  const toggleReady = () => setReady((state) => !state);

  const closeLobby = async () => {
    await dispatch(deleteGame(gameId));
    history.push("/games");
  };

  const start = () => {
    dispatch(startGame(gameId));
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(updateReadyState(gameId, ready));
      } catch (err) {}
    })();
  }, [ready]);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGameById(gameId));
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    sio.once("update_game_lobby", (data) => dispatch(loadGameDetails(data)));
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
            <div key={user.id}>
              <span>{user.username}</span>{" "}
              <span>{`${game.game_data.player_2_ready}`}</span>
            </div>
          ))}
        </div>
        {!game?.users.find((user) => user.id === sessionId) && (
          <button onClick={join}>Join</button>
        )}
        {game?.users.find((user) => user.id === sessionId) &&
          game.host_id !== sessionId && (
            <>
              <button onClick={leave}>Leave</button>
              <button onClick={toggleReady}>
                {!ready ? "Ready Up" : "Unready"}
              </button>
            </>
          )}
        {game?.host_id === sessionId && (
          <button onClick={closeLobby}>Close Lobby</button>
        )}
        {game?.host_id === sessionId && game.game_data.player_2_ready && (
          <button onClick={start}>Start Game</button>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
