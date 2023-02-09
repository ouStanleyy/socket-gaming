import styles from "./ProfilePicture.module.css";
import { Modal } from "../../context/Modal";
import { UserModal } from "../Users";
import { useState } from "react";

// size : "xsmall", "small", "medium", "large", "xlarge", "xxlarge"
const ProfilePicture = ({
  clickable = false,
  user,
  size = "large",
  onClose,
  hasBorder = false,
}) => {
  let style;
  switch (size) {
    case "xsmall":
      style = styles.profileXSmall;
      break;
    case "small":
      style = styles.profileSmall;
      break;
    case "medium":
      style = styles.profileMedium;
      break;
    case "large":
      style = styles.profileLarge;
      break;
    case "xlarge":
      style = styles.profileXLarge;
      break;
    default:
      style = styles.profileXXLarge;
  }
  const [userModal, setUserModal] = useState(false);
  const avatarImage = user?.items.find(
    ({ id }) => id === user.avatar_id
  )?.image;

  const toggleUserModal = () => {
    setUserModal((state) => !state);
  };

  return (
    <>
      <div
        onClick={clickable ? toggleUserModal : undefined}
        className={`${style} ${clickable && styles.clickable} ${
          hasBorder && styles.border
        }`}
      >
        {avatarImage?.endsWith(".mp4") ? (
          <video
            loop
            autoPlay
            muted
            src={
              avatarImage ||
              "https://marketplace.canva.com/EAFEinVJ1ic/1/0/800w/canva-pastel-angry-cat-animated-twitch-profile-picture-A_oQXHIwRhQ.mp4"
            }
            alt="profile"
          />
        ) : (
          <img
            src={
              avatarImage ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232"
            }
            alt="profile"
          />
        )}
      </div>
      {userModal && (
        <Modal onClose={toggleUserModal}>
          <UserModal user={user} onClose={toggleUserModal} />
        </Modal>
      )}
    </>
  );
};

export default ProfilePicture;
