import { useDispatch, useSelector } from "react-redux";
import { addCoins, resetAnimation } from "../../store/session";
import styles from "./ResultsModal.module.css";

function ResultsModal({ results, username, onClose }) {
  const dispatch = useDispatch();
  const position = results.indexOf(username) + 1;
  const amount = { 1: 25, 2: 15, 3: 10, 4: 5 };

  const confirmResults = async () => {
    await dispatch(addCoins(25 + amount[position]));
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
          <p>
            Participation: +25{" "}
            <img
              src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
              alt="gold coin"
            />
          </p>
        )}
        {position === 1 && (
          <p>
            First Place: +{amount[position]}{" "}
            <img
              src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
              alt="gold coin"
            />
          </p>
        )}
        {position === 2 && (
          <p>
            Second Place: +{amount[position]}{" "}
            <img
              src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
              alt="gold coin"
            />
          </p>
        )}
        {position === 3 && (
          <p>
            Third Place: +{amount[position]}{" "}
            <img
              src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
              alt="gold coin"
            />
          </p>
        )}
        {position === 4 && (
          <p>
            Fourth Place: +{amount[position]}{" "}
            <img
              src="https://media.tenor.com/jIp4duCAVp4AAAAi/sengage-sengageio.gif"
              alt="gold coin"
            />
          </p>
        )}
      </div>
    </div>
  );
}

export default ResultsModal;
