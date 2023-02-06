import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import { ProfilePicture } from "../Elements";
import EditModal from "./EditModal";
import { getUserById } from "../../store/users";
import { createNewRoom } from "../../store/rooms";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const user = useSelector((state) => state.users[userId]);
  const isOwner = useSelector(
    (state) => state.session.user.id === parseInt(userId)
  );
  const bannerImage = user?.items.find(({ id }) => id === user.banner_id).image;
  const [loaded, setLoaded] = useState(false);
  const [editModal, setEditModal] = useState({
    show: false,
    editType: "",
  });

  const toggleEditModal =
    (editType = "") =>
    () => {
      setEditModal((state) => ({
        show: !state.show,
        editType,
      }));
    };

  // const confirmChoice = async () => {
  //   await dispatch(setBanner(item.id));
  //   toggleBannerModal();
  // };

  const handleMessageClick = async () => {
    try {
      const roomId = await dispatch(createNewRoom(userId));
      history.push(`/messages/${roomId}`);
    } catch (err) {}
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getUserById(userId));
      } catch (err) {}
      setLoaded(true);
    })();
  }, [dispatch, userId]);

  const redirectMessage = (
    <>
      <h3>Sorry, this page isn't available.</h3>
      <p>
        The link you followed may be broken, or the page may have been removed.
        <Link to="/">Go back to games.</Link>
      </p>
    </>
  );

  return (
    loaded &&
    (!user ? (
      redirectMessage
    ) : (
      <>
        <div
          className={styles.userHeader}
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundPosition: "center",
            backgroundSize: "100% 100%",
            // backgroundRepeat: "no-repeat",
            // height: "150px",
            // width: "300px",
          }}
        >
          <ProfilePicture user={user} size={"XLarge"} />
          <div className={styles.userDetails}>
            <div className={styles.detailsHeader}>
              <p className={styles.username}>{user.username}</p>
              {!isOwner ? (
                <>
                  {/* <FriendRequestButton user={user} /> */}
                  <button>Add Friend</button>
                  <button
                    className={styles.messageButton}
                    onClick={handleMessageClick}
                  >
                    Message
                  </button>
                </>
              ) : (
                <button onClick={toggleEditModal("Banners")}>
                  Edit Banner
                </button>
              )}
            </div>
            <div className={styles.detailsStats}>
              <p>
                <span>{user?.posts?.length || 0}</span> wins
              </p>
              <p>
                <span>{user?.num_of_followers || 0}</span> losses
              </p>
            </div>
          </div>
          {editModal.show && (
            <Modal onClose={toggleEditModal()}>
              <EditModal
                editType={editModal.editType}
                userId={userId}
                onClose={toggleEditModal()}
              />
            </Modal>
          )}
        </div>
      </>
    ))
  );
};
export default UserProfile;
