import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { resetAnimation } from "../../store/session";
import { buyItem } from "../../store/shop";
import styles from "./ShopItem.module.css";

const ShopItem = ({ item }) => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.session.coins.amount);
  const isOwned = useSelector((state) =>
    state.session.items.find(({ id }) => id === item.id)
  );
  const [buyItemModal, setBuyItemModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggleBuyItemModal = () => {
    setBuyItemModal((state) => !state);
  };

  const toggleMessageModal = () => {
    setMessageModal((state) => !state);
  };

  const handleBuyItemClick = () => {
    if (coins >= 100) toggleBuyItemModal();
    else toggleMessageModal();
  };

  const confirmPurchase = async () => {
    await dispatch(buyItem(item.id));
    toggleBuyItemModal();
    setTimeout(() => dispatch(resetAnimation()), 1000);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`${styles.shopItemContainer} ${
        item.item_type === "banner" && styles.bannerType
      } ${item.item_type === "avatar" && styles.avatarType}`}
    >
      {loaded && (
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
            onClick={!isOwned ? handleBuyItemClick : undefined}
          >
            {!isOwned ? "Buy" : "Owned"}
          </button>
        </div>
      )}
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
      {messageModal && (
        <Modal onClose={toggleMessageModal}>
          <div className={styles.messageModal}>
            <h3>
              You need 100
              <img
                className={styles.goldCoin}
                src="https://i.gifer.com/Fw3P.gif"
                alt="gold coin"
              />
              to buy this item.
            </h3>
            <div className={styles.svgContainer} onClick={toggleMessageModal}>
              <svg
                aria-label="Close"
                // class="_ab6-"
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
        </Modal>
      )}
    </div>
  );
};

export default ShopItem;
