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
            color="#262626"
            fill="#262626"
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
            <img src="https://illustoon.com/photo/2317.png" alt="snake" />
          </div>
          <div className={styles.gameDetails}>
            <p className={styles.gameTitle}>Snakes</p>
            <p className={styles.numPlayers}>2 Players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGame;
