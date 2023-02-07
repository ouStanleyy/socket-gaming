import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editItemSetting } from "../../store/users";
import styles from "./ItemsList.module.css";

function ItemsList({ itemType, onClose }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const items = useSelector((state) =>
    Object.values(state.session.items)
  ).filter(({ item_type }) => itemType.toLowerCase().includes(item_type));
  const currChoices = {
    banner: useSelector((state) => state.users[userId].banner_id),
    avatar: useSelector((state) => state.users[userId].avatar_id),
  };
  // const [loaded, setLoaded] = useState(false);
  const isCurrChoice = (itemType, itemId) => itemId === currChoices[itemType];

  const selectItem = (itemType, itemId) => () => {
    dispatch(editItemSetting(itemType, itemId, userId));
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await dispatch(getFollowers(userId));
  //       setLoaded(true);
  //     } catch (err) {}
  //   })();
  // }, [dispatch, userId]);

  return (
    <>
      {items.map(({ id, image, item_type }) => {
        return (
          <div
            className={`${styles.itemContainer} ${
              item_type === "avatar" && styles.avatarItem
            }`}
            key={id}
            onClick={selectItem(item_type, id)}
          >
            {image.endsWith(".mp4") ? (
              <video loop autoPlay muted src={image} alt={image} />
            ) : (
              <img src={image} alt={image} />
            )}
            {isCurrChoice(item_type, id) && (
              <button className={styles.current}>Current</button>
            )}
          </div>
        );
      })}
      {items.length < 2 && (
        <button
          className={styles.linkToShop}
          onClick={() => history.push(`/shop`)}
        >
          Visit The Shop
        </button>
      )}
    </>
  );
}

export default ItemsList;
