import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewGame } from "../../store/games";
import { useHistory } from "react-router-dom";
import styles from "./NewGame.module.css";

const NewGame = ({ onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = (gameType) => async () => {
    try {
      const gameId = await dispatch(createNewGame(gameType));
      onClose();
      history.push(`/games/${gameId}`);
    } catch (err) {}
  };

  return (
    <div className={styles.newGameContainer}>
      <div className={styles.header}>
        {/* <div className={styles.headerContainer}> */}
        <div className={styles.svgContainer} onClick={onClose}>
          <svg
            aria-label="Close"
            // class="_ab6-"
            color="currentColor"
            fill="currentColor"
            height="18"
            role="img"
            viewBox="0 0 24 24"
            width="18"
          >
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            ></polyline>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            ></line>
          </svg>
        </div>
        <h2>New Game</h2>
        {/* </div> */}
      </div>
      <div className={styles.gamesList}>
        <div className={styles.gameContainer} onClick={handleClick("snakes")}>
          <div className={styles.gamePicture}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/528/528105.png"
              alt="snake"
            />
            {/* <img src="https://illustoon.com/photo/2317.png" alt="snake" /> */}
          </div>
          <div className={styles.gameDetails}>
            <p className={styles.gameTitle}>Snakes</p>
            <p className={styles.numPlayers}>2-4 Players</p>
          </div>
        </div>
        <div className={styles.gameContainer} onClick={handleClick("pong")}>
          <div className={styles.gamePicture}>
            {/* <img src="http://pong-2.com/icon-256.png" alt="pong" /> */}
            {/* <img
              src="https://cdn.pixabay.com/photo/2012/04/02/16/25/pong-24876_1280.png"
              alt="pong"
            /> */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/1030/1030209.png"
              alt="pong"
            />
          </div>
          <div className={styles.gameDetails}>
            <p className={styles.gameTitle}>Pong</p>
            <p className={styles.numPlayers}>2 Players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGame;
