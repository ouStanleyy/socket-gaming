import styles from "./ShopItem.module.css";

const ShopItem = ({ item }) => {
  return (
    <div className={styles.shopItemContainer}>
      <img src={item.image} alt={item.image} />
    </div>
  );
};

export default ShopItem;
