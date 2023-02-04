import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { buyItem } from "../../store/shop";
import styles from "./ShopItem.module.css";

const ShopItem = ({ item }) => {
  const dispatch = useDispatch();
  const isOwned = useSelector((state) =>
    state.session.items.find(({ id }) => id === item.id)
  );
  const [buyItemModal, setBuyItemModal] = useState(false);

  const toggleBuyItemModal = () => {
    setBuyItemModal((state) => !state);
  };

  const confirmPurchase = async () => {
    await dispatch(buyItem(item.id));
    toggleBuyItemModal();
  };

  return (
    <div className={styles.shopItemContainer}>
      <div className={styles.hoverOptions}>
        <div className={styles.priceContainer}>
          <p className={styles.price}>100</p>
          <img
            className={styles.goldCoin}
            src="https://i.gifer.com/Fw3P.gif"
            alt="gold coin"
          />
        </div>
        <button
          className={isOwned && styles.disabledButton}
          onClick={!isOwned ? toggleBuyItemModal : undefined}
        >
          {!isOwned ? "Buy" : "Owned"}
        </button>
      </div>
      <img className={styles.itemImage} src={item.image} alt={item.image} />
      {buyItemModal && (
        <Modal onClose={toggleBuyItemModal}>
          <div className={styles.buyItemModal}>
            <h3>
              Buy for 100
              <img
                className={styles.goldCoin}
                src="https://i.gifer.com/Fw3P.gif"
                alt="gold coin"
              />
              ?
            </h3>
            <button onClick={confirmPurchase}>Yes</button>
            <button onClick={toggleBuyItemModal}>No</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ShopItem;
