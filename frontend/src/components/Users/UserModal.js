import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserById } from "../../store/users";
import { ProfilePicture } from "../Elements";
import {
  createNewRoom,
  setActiveConvo,
  setHideMessages,
  setRoomId,
} from "../../store/rooms";
import styles from "./UserModal.module.css";

function UserModal({ user, onClose }) {
  const dispatch = useDispatch();
  const isOwner = user.id === useSelector((state) => state.session.user.id);
  const chatRoomId = useSelector((state) => state.rooms.chat.roomId);
  const bannerImage = user?.items.find(({ id }) => id === user.banner_id).image;
  const [loaded, setLoaded] = useState(false);

  const handleMessageClick = async () => {
    if (!isOwner) {
      try {
        const roomId = await dispatch(createNewRoom(user.id));
        onClose();
        dispatch(setHideMessages(false));
        dispatch(setRoomId(roomId));
        if (roomId !== chatRoomId) dispatch(setActiveConvo());
        setTimeout(() => {
          dispatch(setActiveConvo(true));
        }, 200);
      } catch (err) {}
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getUserById(user.id));
      } catch (err) {}
      setLoaded(true);
    })();
  }, [dispatch, user]);

  return (
    loaded && (
      <div className={styles.userContainer}>
        <div
          className={styles.userHeader}
          style={{
            backgroundImage: `url(${bannerImage})`,
            // backgroundPosition: "center",
            // backgroundSize: "100%",
            // backgroundRepeat: "no-repeat",
            // height: "150px",
            // width: "300px",
          }}
        >
          <ProfilePicture user={user} size={"xlarge"} onClose={onClose} />
          <div className={styles.userDetails}>
            <Link to={`/users/${user.id}`}>
              <p onClick={onClose} className={styles.username}>
                {user?.username}
              </p>
            </Link>
            {/* <p className={styles.fullName}>{user?.full_name}</p> */}
          </div>
        </div>
        <div className={styles.detailsStats}>
          <p>
            <span>{user?.posts?.length || 0}</span> wins
          </p>
          <p>
            <span>{user?.num_of_followers || 0}</span> losses
          </p>
          {/* <p>
            <span>{user?.num_of_followings}</span> following
          </p> */}
        </div>
        <div className={styles.postsContainer}>
          {user?.posts?.slice(0, 3).map((post) => {
            return (
              <div key={post.id} className={styles.postContainer}>
                <Link to={`/posts/${post.id}`}>
                  <img
                    src={post.preview_media}
                    alt="preview media"
                    className={styles.previewMedia}
                  />
                </Link>
              </div>
            );
          })}
        </div>
        <div className={styles.userFooter}>
          {!isOwner && (
            <>
              <button onClick={handleMessageClick}>Message</button>
              <button>Add Friend</button>
            </>
          )}
        </div>
      </div>
    )
  );
}
export default UserModal;
