import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShopItems } from "../../store/shop";
import ShopItem from "./ShopItem";
import styles from "./Shop.module.css";

const Shop = () => {
  const dispatch = useDispatch();
  const shopItems = useSelector((state) => Object.values(state.shop));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getShopItems());
        setLoaded(true);
      } catch (err) {}
    })();
  }, [dispatch]);

  return (
    loaded && (
      <div className={styles.shopContainer}>
        {shopItems?.slice(2).map((item) => {
          return <ShopItem item={item} key={item.id} loaded={loaded} />;
        })}
      </div>
    )
  );
};

export default Shop;
