import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Switch, Route } from "react-router-dom";
import { getGames } from "../../store/games";
import NewGame from "./NewGame";
import { Modal } from "../../context/Modal";
import styles from "./GamesList.module.css";

const gamePics = {
  // snakes: <img src="https://illustoon.com/photo/2317.png" alt="snake" />,
  snakes: (
    <img
      src="https://cdn-icons-png.flaticon.com/512/528/528105.png"
      alt="snake"
    />
  ),
  pong: (
    <img
      src="https://cdn-icons-png.flaticon.com/512/1030/1030209.png"
      alt="pong"
    />
  ),
  // pong: (
  //   <img
  //     src="https://cdn.pixabay.com/photo/2012/04/02/16/25/pong-24876_1280.png"
  //     alt="pong"
  //   />
  // ),
};

const GamesList = () => {
  const dispatch = useDispatch();
  const sio = useSelector((state) => state.socket.socket);
  const games = useSelector((state) => Object.values(state.games));
  const [newGameModal, setNewGameModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggleNewGameModal = () => {
    setNewGameModal((state) => !state);
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGames());
        setLoaded(true);
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    const updateList = () => dispatch(getGames());

    sio.on("update_game_list", updateList);
    return () => sio.off("update_game_list", updateList);
  }, [sio.id]);

  return (
    <div className={styles.gamesListContainer}>
      <div className={styles.realTimeContainer}>
        <div className={styles.header}>
          <h3 className={styles.title}>Real Time</h3>
          <div className={styles.newGameButton} onClick={toggleNewGameModal}>
            <i className="fa-solid fa-plus fa-lg" />
          </div>
        </div>
        {loaded &&
          games.map((game) => (
            <Link key={game.id} to={`/games/${game.id}`}>
              <div className={styles.gameContainer}>
                <div className={styles.gamePicture}>
                  {/* <img src="https://illustoon.com/photo/2317.png" alt="snake" /> */}
                  {gamePics[game.game_type]}
                </div>
                <div className={styles.gameDetails}>
                  <p className={styles.host}>
                    Host:{" "}
                    {
                      game.users.find((user) => user.id === game.host_id)
                        .username
                    }
                  </p>
                  <p className={styles.numPlayers}>
                    Players:{game.users.length}/{game.max_players}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <div className={styles.turnBasedContainer}>
        <div className={styles.header}>
          <h3 className={styles.title}>Turn Based</h3>
          <div
            className={styles.newGameButton}
            // onClick={toggleNewMessageModal}
          >
            <i className="fa-solid fa-plus fa-lg" />
          </div>
        </div>
      </div>
      {newGameModal && (
        <Modal onClose={toggleNewGameModal}>
          <NewGame onClose={toggleNewGameModal} />
        </Modal>
      )}
    </div>
  );
};

export default GamesList;
