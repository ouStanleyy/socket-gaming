import styles from "./SuccessPopup.module.css";

const SuccessPopup = ({ message }) => {
  return <div className={styles.popupContainer}>{message}</div>;
};

export default SuccessPopup;
