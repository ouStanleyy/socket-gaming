import styles from "./MoreItem.module.css";
import { moreIcon } from "./icons";

const MoreItem = ({ type, onClick }) => {
  return (
    <div className={styles.moreItemContainer} onClick={onClick}>
      <div className={styles.moreItemType}>{type}</div>
      <div className={styles.moreItemSVGContainer}>{moreIcon[type] || ""}</div>
    </div>
  );
};

export default MoreItem;
