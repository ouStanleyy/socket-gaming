import { useSelector } from "react-redux";
import styles from "./ResultsModal.module.css";

function ResultsModal({ results, username, onClose }) {
  const position = results.indexOf(username) + 1;
  return (
    <div className={styles.modalContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.title}>Results</h3>
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
      <ul className={styles.listContainer}>
        {results === "draw" ? (
          <li>DRAW</li>
        ) : (
          results.map((player, idx) => {
            return (
              <li
                key={idx}
                className={`${styles.resultsPosition} ${styles[idx + 1]}`}
              >
                {player}
              </li>
            );
          })
        )}
      </ul>
      <div className={styles.bonusCoins}>
        {position === 1 ? "+50 coins" : "+25 coins"}
      </div>
    </div>
  );
}

export default ResultsModal;
