import { useDispatch, useSelector } from "react-redux";
import { addCoins, resetAnimation } from "../../store/session";
import styles from "./ResultsModal.module.css";

function ResultsModal({ results, username, onClose }) {
  const dispatch = useDispatch();
  const position = results.indexOf(username) + 1;
  const positionAmount = 5 * (results.length - position);
  const participationAmount = 25;
  const podium = { 1: "First", 2: "Second", 3: "Third", 4: "Fourth" };

  const confirmResults = async () => {
    await dispatch(addCoins(participationAmount + positionAmount));
    onClose();
    setTimeout(() => dispatch(resetAnimation()), 1000);
  };
  return (
    <div className={styles.modalContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.title}>Results</h3>
        <div className={styles.svgContainer} onClick={confirmResults}>
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
        {/* <h3 className={styles.coinsTitle}>Coins Earned</h3> */}
        {position > 0 && (
          <>
            <p>
              Participation: +{participationAmount}{" "}
              <img
                src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
                alt="gold coin"
              />
            </p>
            <p>
              {podium[position]} Place: +{positionAmount}{" "}
              <img
                src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
                alt="gold coin"
              />
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ResultsModal;
