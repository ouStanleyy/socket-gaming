import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShopItems } from "../../store/shop";
import ShopItem from "./ShopItem";
import styles from "./Shop.module.css";

const Shop = () => {
  const dispatch = useDispatch();
  const shopItems = useSelector((state) => Object.values(state.shop));

  useEffect(() => {
    dispatch(getShopItems());
  }, [dispatch]);

  return (
    <div className={styles.shopContainer}>
      {/* {shopItems?.map((item) => {
        return <ShopItem item={item} key={item.id} />;
      })} */}
      {/* <ShopItem
        item={
          "https://png.pngtree.com/png-clipart/20220303/original/pngtree-metallic-game-avatar-frame-vector-icon-png-image_7393471.png"
        }
      /> */}
      <ShopItem
        item={
          "https://marketplace.canva.com/EAFKAwefFZs/1/0/1600w/canva-purple-aquamarine-art-pixel-art-discord-profile-banner-aw9UuWkrCts.jpg"
        }
      />
      <ShopItem
        item={
          "https://marketplace.canva.com/EAFSri5bYh0/1/0/1600w/canva-pink-fun-gaming-pixel-art-discord-profile-banner-x-tJlezAdIU.jpg"
        }
      />
      <ShopItem
        item={
          "https://marketplace.canva.com/EAFOOdUV12Y/1/0/1600w/canva-blue-green-brown-gaming-pixel-art-discord-profile-banner-FTz8fhcgPGQ.jpg"
        }
      />
      <ShopItem
        item={
          "https://marketplace.canva.com/EAEeO4Bb7ys/1/0/1600w/canva-purple-clouds-gamer-girl-twitch-banner-USDV23M__tU.jpg"
        }
      />
      <ShopItem
        item={
          "https://marketplace.canva.com/EAFIJI5vK_Q/1/0/1600w/canva-violet-dark-blue-anime-music-twitch-banner-iu2BU3SsufU.jpg"
        }
      />
      <ShopItem
        item={
          "https://marketplace.canva.com/EAFIJGWz8q4/1/0/1600w/canva-red-black-white-anime-podcast-twitch-banner-UWLRt79y-g4.jpg"
        }
      />
    </div>
  );
};

export default Shop;
