import { useDispatch } from "react-redux";
import styles from "./InstructionsModal.module.css";

function InstructionsModal({ gameType, onClose }) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.title}>Game Rules</h3>
        <div className={styles.svgContainer} onClick={onClose}>
          <svg
            aria-label="Close"
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
      </div>
      <div className={styles.howToPlay}>
        <h3 className={styles.sectionTitle}>How To Play The Game:</h3>
        {gameType === "snakes" && (
          <p>
            The goal is simple, try to be the last snake standing to win the
            game. Your snake will move forward by itself, but you can use the
            directional keys to change its direction. Your snake will be knocked
            out if you run into the body of any snake, including yours. Good
            luck, have fun!{" "}
          </p>
        )}
      </div>
      <div className={styles.powerUps}>
        {gameType === "snakes" && (
          <>
            <h3 className={styles.sectionTitle}>Apples:</h3>
            <div className={styles.powerUpContainer}>
              <div className={`${styles.powerUp} ${styles.normal}`}></div>
              <p>Normal: Eat it to grow your snake by 1 cell</p>
            </div>
            <div className={styles.powerUpContainer}>
              <div className={`${styles.powerUp} ${styles.freeze}`}></div>
              <p>Freeze: Slows down other snakes' movements</p>
            </div>
            <div className={styles.powerUpContainer}>
              <div className={`${styles.powerUp} ${styles.break}`}></div>
              <p>Break: Breaks other snakes in half</p>
            </div>
            <div className={styles.powerUpContainer}>
              <div className={`${styles.powerUp} ${styles.confuse}`}></div>
              <p>Confuse: Changes other players' directional inputs</p>
            </div>
            <div className={styles.powerUpContainer}>
              <div className={`${styles.powerUp} ${styles.shield}`}></div>
              <p>Shield: Protects your snake from any collisions</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InstructionsModal;
