import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Modal } from "../../context/Modal";
import {
  getGameById,
  joinGame,
  leaveGame,
  deleteGame,
  loadGameDetails,
  updateReadyState,
  startGame,
  updateGameScores,
} from "../../store/games";
import Snakes from "./Snakes/snakes-class";
import styles from "./GameDetails.module.css";

const GameDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { gameId } = useParams();
  const sio = useSelector((state) => state.socket.socket);
  const game = useSelector((state) => state.games[gameId]);
  const sessionId = useSelector((state) => state.session.user.id);
  const players = game?.users.sort(({ id }) => (id === game.host_id ? -1 : 0));
  const openSeats = game
    ? Array(game?.max_players - game?.users.length).fill()
    : null;
  const [ready, setReady] = useState(game?.game_data.player_2_ready || false);
  const [closeLobbyModal, setCloseLobbyModal] = useState(false);

  const toggleCloseLobbyModal = () => {
    setCloseLobbyModal((state) => !state);
  };

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
    toggleCloseLobbyModal();
    history.push("/games");
  };

  const start = () => {
    dispatch(
      startGame(gameId, {
        player_1_snake: Snakes.createSnake(),
        player_2_snake: Snakes.createSnake(),
        apples: [Snakes.createApple(), Snakes.createApple()],
      })
    );
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
    sio.on("update_game_lobby", (data) => dispatch(loadGameDetails(data)));
  }, [sio]);

  useEffect(() => {
    sio.on("close_game_lobby", () => history.push("/games"));
  }, [sio]);

  useEffect(() => {
    sio.on("end_game", (data) => {
      dispatch(loadGameDetails(data));
      setReady(false);
    });
  }, [sio]);

  // useEffect(() => {
  //   sio.on("update_game", (data) => {
  //     if (data.scorer && data.paused)
  //       dispatch(
  //         updateGameScores({
  //           gameId,
  //           scores: {
  //             player_1_score: data.player_1_score,
  //             player_2_score: data.player_2_score,
  //           },
  //         })
  //       );
  //   });
  // }, [sio]);

  useEffect(() => {
    sio.on("update_game", (data) => {
      if (data.scorer && data.paused)
        dispatch(
          updateGameScores({
            gameId,
            scores: data.scores,
          })
        );
    });
  }, [sio]);

  return (
    <div className={styles.gameDetails}>
      <div className={styles.header}>
        <h3 className={styles.title}>{game?.game_type}</h3>
        <div className={styles.closeLobbyBtn} onClick={toggleCloseLobbyModal}>
          {game?.host_id === sessionId && (
            <i className="fa-solid fa-arrow-right-from-bracket fa-lg" />
          )}
        </div>
        {closeLobbyModal && (
          <Modal onClose={toggleCloseLobbyModal}>
            <div>
              <h3>Close game lobby?</h3>
              <button onClick={closeLobby}>Yes</button>
              <button onClick={toggleCloseLobbyModal}>No</button>
            </div>
          </Modal>
        )}
      </div>
      <div className={styles.playersContainer}>
        <h3>Players</h3>
        <div className={styles.playersList}>
          {players?.map((user) => (
            <div key={user.id} className={styles.seat}>
              <span>{user.username}</span>{" "}
              {user.id === sessionId && game.host_id !== sessionId && (
                <button className={styles.seatBtn} onClick={leave}>
                  <i className="fa-solid fa-user-minus fa-lg" />
                </button>
              )}
              {/* <span>{game.game_data.winner === user.id && "Winner"}</span> */}
            </div>
          ))}
          {openSeats?.map((_, idx) => (
            <div key={idx} className={styles.seat}>
              <button
                className={styles.seatBtn}
                onClick={join}
                disabled={game?.users.find((user) => user.id === sessionId)}
              >
                <i className="fa-solid fa-user-plus fa-lg" />
              </button>
            </div>
          ))}
        </div>
        <div>
          Player 2 is {game?.game_data.player_2_ready ? "ready" : "not ready"}
        </div>
        {game?.users.find((user) => user.id === sessionId) &&
          game.host_id !== sessionId && (
            <button onClick={toggleReady}>
              {!ready ? "Ready Up" : "Unready"}
            </button>
          )}
        {game?.host_id === sessionId && game.game_data.player_2_ready && (
          <button onClick={start}>Start Game</button>
        )}
      </div>
      <div className={styles.scoreboard}>
        <div>
          <p>Player 1: {game?.game_data.player_1_score}</p>
        </div>
        <div>
          <p>Player 2: {game?.game_data.player_2_score}</p>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
