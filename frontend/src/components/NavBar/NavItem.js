import { icons } from "./icons";
import { useSelector } from "react-redux";
import styles from "./NavItem.module.css";
import ProfilePicture from "../Elements/ProfilePIcture";

const NavItem = ({
  type,
  showSearch,
  hideSearch,
  showNotification,
  hideNotification,
  hasNotification,
}) => {
  const user = useSelector(
    (state) => state.users[state.session.user.id] || state.session.user
  );
  const coins = useSelector((state) => state.session.coins.amount);
  const coinsAnimation = useSelector((state) => state.session.coins.animation);
  const isLogo = type === "Icon" || type === "Logo";
  const isCoin = type === "Coin";
  const style = isLogo ? styles.logo : styles.navItem;
  const profilePicture = (
    <>
      <div className={styles.profilePicture}>
        <ProfilePicture user={user} size={"xsmall"} />
      </div>
      <span>Profile</span>
    </>
  );

  const iconButton = (
    <>
      {isLogo && <div className={styles.namedLogo}>{icons["Icon"]}</div>}
      <div className={`${styles.svgContainer} ${isLogo && styles.hideSvg}`}>
        {icons[type]}
        {type === "Notifications" && hasNotification && (
          <div className={styles.redCircle}></div>
        )}
      </div>
      <span>{isLogo ? "" : isCoin ? coins : type}</span>
      {isCoin && coinsAnimation.show && (
        <div
          className={`${styles.coinsAnimation} ${
            coinsAnimation.type === "decrement" && styles.decrement
          }`}
        >
          {icons[type]} {coinsAnimation.type === "decrement" ? "-" : "+"}
          {coinsAnimation.amount}
        </div>
      )}
    </>
  );

  return (
    <div
      className={`${style} ${showSearch && !hideSearch && styles.hideNavItem}
                  ${
                    type === "Search" &&
                    !showNotification &&
                    styles.searchBorder
                  }
                  ${isCoin && styles.coinItem}
                  ${showNotification && !hideNotification && styles.hideNavItem}
                  ${
                    type === "Notifications" &&
                    !showSearch &&
                    styles.notifBorder
                  }
      `}
    >
      {type === "Profile" ? profilePicture : iconButton}
    </div>
  );
};

export default NavItem;
