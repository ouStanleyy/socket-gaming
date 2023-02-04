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
  const user = useSelector((state) => state.session.user);
  const isLogo = type === "Icon" || type === "Logo";
  const isCoin = type === "Coin";
  const style = isLogo ? styles.logo : styles.navItem;
  const profilePicture = (
    <>
      <div className={styles.profilePicture}>
        <ProfilePicture user={user} size={"xsmall"} />
        {/* <img src={user?.profile_picture} alt={`${user?.full_name} profile`} /> */}
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
      <span>{isLogo ? "" : isCoin ? "500" : type}</span>
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
