import ItemsList from "./ItemsList";
import styles from "./EditModal.module.css";

function EditModal({ editType, onClose }) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.title}>{editType}</h3>
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
      <div className={styles.listContainer}>
        <ItemsList itemType={editType} onClose={onClose} />
      </div>
    </div>
  );
}

export default EditModal;
