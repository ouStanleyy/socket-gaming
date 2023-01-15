import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Modal } from "../../context/Modal";
import GameChat from "./GameChat";
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
  const isHost = sessionId === game?.host_id;
  const player = (userId) =>
    Object.keys(game?.game_data).find(
      (data) => game?.game_data[data] === userId && data !== "winner"
    );
  const players = game
    ? Array(game?.max_players)
        .fill()
        .map((_, idx) =>
          game.users.find(
            ({ id }) => id === game.game_data[`player_${idx + 1}`]
          )
        )
    : null;
  // const players = game?.users.sort(
  //   (a, b) => player(a.id).slice(-1) - player(b.id).slice(-1)
  //   // id === game.host_id ? -1 : 0;
  // );
  // const player = game
  //   ? Object.keys(game?.game_data).find(
  //       (data) => game?.game_data[data] === sessionId
  //     )
  //   : null;
  // const openSeats = game
  //   ? Array(game?.max_players - game?.users.length).fill()
  //   : null;
  const [ready, setReady] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  // const [ready, setReady] = useState(game?.game_data.player_2_ready || false);
  const [closeLobbyModal, setCloseLobbyModal] = useState(false);
  const allReady =
    (game?.game_data.player_2_ready || 0) +
      (game?.game_data.player_3_ready || 0) +
      (game?.game_data.player_4_ready || 0) ===
    game?.users.length - 1;
  const playerReady = {
    player_2: "player_2_ready",
    player_3: "player_3_ready",
    player_4: "player_4_ready",
  };

  const toggleCloseLobbyModal = () => {
    setCloseLobbyModal((state) => !state);
  };

  const join = (playerNum) => () => {
    setReady(false);
    dispatch(joinGame(gameId, playerNum));
  };

  const leave = (unmount) => {
    setReady(false);
    dispatch(leaveGame(gameId, unmount));
  };

  const toggleReady = () => setReady((state) => !state);

  const closeLobby = async (push = true) => {
    await dispatch(deleteGame(gameId));
    toggleCloseLobbyModal();
    if (push) history.push("/games");
  };

  const start = () => {
    setGameActive(true);
    dispatch(
      startGame(gameId, {
        player_1_snake: Snakes.createSnake(),
        player_2_snake: Snakes.createSnake(),
        player_3_snake: Snakes.createSnake(),
        player_4_snake: Snakes.createSnake(),
        apples: [Snakes.createApple(), Snakes.createApple()],
      })
    );
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGameById(gameId));
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(updateReadyState(gameId, ready));
      } catch (err) {}
    })();
  }, [ready]);

  useEffect(() => {
    sio.on("update_game_lobby", (data) => dispatch(loadGameDetails(data)));
  }, [sio]);

  useEffect(() => {
    if (game?.host_id !== sessionId)
      sio.on("close_game_lobby", () => history.push("/games"));
  }, [sio]);

  useEffect(() => {
    sio.on("end_game", (data) => {
      dispatch(loadGameDetails(data));
      setReady(false);
      setGameActive(false);
    });
  }, [sio]);

  useEffect(() => (isHost ? () => closeLobby(false) : () => leave(true)), []);
  // useEffect(() => {
  //   if (game?.host_id === sessionId) return () => closeLobby(false);
  // }, []);

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

    return () => sio.off("update_game");
  }, [sio]);

  return (
    <div className={styles.gameDetails}>
      <div className={styles.header}>
        <h3 className={styles.title}>{game?.game_type}</h3>
        <div className={styles.closeLobbyBtn} onClick={toggleCloseLobbyModal}>
          {game?.host_id === sessionId && (
            <i
              className="fa-solid fa-arrow-right-from-bracket fa-lg"
              style={{
                color: "#86c232",
              }}
            />
          )}
        </div>
        {closeLobbyModal && (
          <Modal onClose={toggleCloseLobbyModal}>
            <div className={styles.closeLobbyModal}>
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
          {players?.map((user, idx) =>
            user ? (
              <div key={idx} className={styles.player}>
                <div className={styles.seat}>
                  <span>{user.username}</span>
                  {game.host_id !== user.id &&
                    (game?.game_data[playerReady[player(user.id)]] ? (
                      <i
                        className="fa-solid fa-check fa-lg fa-beat"
                        style={{ color: "green" }}
                      />
                    ) : (
                      <i
                        className="fa-solid fa-xmark fa-lg fa-fade"
                        style={{ color: "red" }}
                      />
                    ))}
                  {user.id === sessionId && game.host_id !== sessionId && (
                    <button
                      className={styles.seatBtn}
                      onClick={() => leave(false)}
                    >
                      <i className="fa-solid fa-user-minus fa-lg" />
                    </button>
                  )}
                  <div></div>
                  {/* <span>{game.game_data.winner === user.id && "Winner"}</span> */}
                </div>
                {game.host_id === user.id ? (
                  user.id === sessionId &&
                  game.users.length > 1 &&
                  allReady &&
                  !gameActive && <button onClick={start}>Start Game</button>
                ) : (
                  <>
                    {user.id === sessionId && (
                      <button onClick={toggleReady}>
                        {!ready ? "Ready Up" : "Unready"}
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div key={idx} className={styles.seat}>
                {game && !player(sessionId) && (
                  <button
                    className={styles.seatBtn}
                    onClick={join(idx + 1)}
                    disabled={game?.users.find((user) => user.id === sessionId)}
                  >
                    <i className="fa-solid fa-user-plus fa-lg" />
                  </button>
                )}
              </div>
            )
          )}
          {/* {openSeats?.map((_, idx) => (
            <div key={idx} className={styles.seat}>
              <button
                className={styles.seatBtn}
                onClick={join}
                disabled={game?.users.find((user) => user.id === sessionId)}
              >
                <i className="fa-solid fa-user-plus fa-lg" />
              </button>
            </div>
          ))} */}
        </div>
        {/* <div>
          Player 2 is {game?.game_data.player_2_ready ? "ready" : "not ready"}
        </div> */}
        {/* {player(sessionId) && game.host_id !== sessionId && (
          <button onClick={toggleReady}>
            {!ready ? "Ready Up" : "Unready"}
          </button>
        )} */}
        {/* {game?.host_id === sessionId &&
          game.users.length > 1 &&
          allReady &&
          !gameActive && <button onClick={start}>Start Game</button>} */}
      </div>
      <div className={styles.scoreboard}>
        {game?.game_type === "pong" && (
          <>
            <div>
              <p>Player 1: {game?.game_data.player_1_score}</p>
            </div>
            <div>
              <p>Player 2: {game?.game_data.player_2_score}</p>
            </div>
          </>
        )}
        <div>
          <p>
            Winner:{" "}
            {game?.game_data.winner &&
              (game.game_data.winner === "draw"
                ? "draw"
                : game.users.find((user) => game.game_data.winner === user.id)
                ? game.users.find((user) => game.game_data.winner === user.id)
                    .username
                : null)}
          </p>
        </div>
      </div>
      <GameChat sessionId={sessionId} game={game} />
    </div>
  );
};

export default GameDetails;
