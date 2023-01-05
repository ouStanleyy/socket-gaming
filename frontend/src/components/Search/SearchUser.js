import { Link } from "react-router-dom";
import { ProfilePicture } from "../Elements";
import styles from "./SearchUser.module.css";

function SearchUser({ user, onClose }) {
  return (
    <Link to={`/users/${user.id}`}>
      <div onClick={onClose} className={styles.userContainer}>
        <div className={styles.profilePicture}>
          <ProfilePicture user={user} size={"medium"} />
        </div>
        <div className={styles.userDetails}>
          <p className={styles.username}>{user?.username}</p>
          <p className={styles.fullName}>{user?.full_name}</p>
        </div>
      </div>
    </Link>
  );
}

export default SearchUser;
