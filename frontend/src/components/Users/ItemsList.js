import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editItemSetting } from "../../store/users";
import styles from "./ItemsList.module.css";

function ItemsList({ itemType, onClose }) {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const items = useSelector((state) =>
    Object.values(state.session.items)
  ).filter(({ item_type }) => itemType.toLowerCase().includes(item_type));
  const currChoices = {
    banner: useSelector((state) => state.users[userId].banner_id),
  };
  // const [loaded, setLoaded] = useState(false);
  console.log("current choices: ", currChoices);
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

  return items.map(({ id, image, item_type }) => {
    return (
      <div
        className={styles.itemContainer}
        key={id}
        onClick={selectItem(item_type, id)}
      >
        <img src={image} alt={image} />
        {isCurrChoice(item_type, id) && (
          <button className={styles.current}>Current</button>
        )}
      </div>
    );
  });
}

export default ItemsList;
