import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItem } from "../../store/session";
import styles from "./ItemsList.module.css";

function ItemsList({ itemType, userId, currUser, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector((state) =>
    Object.values(state.session.items)
  ).filter(({ item_type }) => itemType.toLowerCase().includes(item_type));
  const currChoices = {
    banner: useSelector((state) => state.session.user.banner_id),
  };
  // const [loaded, setLoaded] = useState(false);

  const isCurrChoice = (itemType, itemId) => itemId === currChoices[itemType];

  const selectItem = (itemType, itemId) => () => {
    dispatch(setItem(itemType, itemId));
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await dispatch(getFollowers(userId));
  //       setLoaded(true);
  //     } catch (err) {}
  //   })();
  // }, [dispatch, userId]);

  return items.map(({ id, image, item_type }) => {
    return (
      <div
        className={styles.itemContainer}
        key={id}
        onClick={selectItem(item_type, id)}
      >
        <img src={image} alt={image} />
        {isCurrChoice(item_type, id) && <button>Current</button>}
      </div>
    );
  });
}

export default ItemsList;
