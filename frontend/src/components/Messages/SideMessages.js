import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Switch, Route } from "react-router-dom";
import { getRooms } from "../../store/rooms";
import Conversation from "./Conversation";
import { ProfilePicture } from "../Elements";
import NewMessage from "./NewMessage";
import { Modal } from "../../context/Modal";
import styles from "./SideMessages.module.css";

const SideMessages = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const sio = useSelector((state) => state.socket.socket);
  const rooms = useSelector((state) => Object.values(state.rooms))
    .filter(({ game }) => !game)
    .sort((a, b) =>
      a.messages.length && b.messages.length
        ? new Date(b.messages[b.messages.length - 1].time_sent) -
          new Date(a.messages[a.messages.length - 1].time_sent)
        : a.messages.length
        ? -1
        : +1
    );
  const [newMessageModal, setNewMessageModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [activeConvo, setActiveConvo] = useState(false);
  const [hideMessages, setHideMessages] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const toggleNewMessageModal = () => {
    setNewMessageModal((state) => !state);
  };

  const toggleMessages = () => {
    setHideMessages((state) => !state);
  };

  const toggleConvo =
    (roomId = "") =>
    () => {
      setRoomId(roomId);
      setActiveConvo((state) => !state);
    };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getRooms());
        setLoaded(true);
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    if (sio.id) {
      const updateList = () => {
        dispatch(getRooms());
      };

      sio.on("connected", updateList);
      sio.on("disconnected", updateList);
      sio.on("message", updateList);

      return () => {
        sio.off("connected", updateList);
        sio.off("disconnected", updateList);
        sio.off("message", updateList);
      };
    }
  }, [sio.id]);

  return (
    <>
      <div
        className={`${styles.toggleMessagesButton} ${styles.fixedRight} ${
          hideMessages && styles.hideMessages
        }`}
        onClick={toggleMessages}
      >
        <i
          className={
            hideMessages
              ? "fa-regular fa-comments fa-lg"
              : "fa-solid fa-xmark fa-lg"
          }
        />
        {/* <i className="fa-solid fa-up-right-and-down-left-from-center fa-lg" /> */}
      </div>
      <div
        className={`${styles.messagesContainer} ${
          hideMessages && styles.hideMessages
        }`}
      >
        <div className={styles.messagesList}>
          <div className={styles.messagesListHeader}>
            <h3 className={styles.title}>Messages</h3>
            <div
              className={styles.newConvoButton}
              onClick={toggleNewMessageModal}
            >
              {/* <i className="fa-regular fa-share-from-square fa-lg" /> */}
              <i className="fa-regular fa-pen-to-square fa-lg" />
            </div>
            {/* <div
                className={styles.toggleMessagesButton}
                onClick={toggleMessages}
              >
                <i className="fa-solid fa-up-right-and-down-left-from-center fa-lg" />
              </div> */}
          </div>
          {loaded &&
            rooms.map((room) => (
              <div
                className={`${styles.userContainer} ${
                  roomId && room.id === parseInt(roomId) && styles.activeUser
                }`}
                onClick={toggleConvo(room.id)}
                key={room.id}
              >
                <div className={styles.profilePicture}>
                  <div
                    className={`${styles.status} ${
                      room.user?.is_online && styles.online
                    }`}
                  >
                    <ProfilePicture user={room.user} size={"large"} />
                  </div>
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.username}>{room.user?.username}</p>

                  <p className={styles.msgPreview}>
                    {room.messages[room.messages.length - 1]?.message}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div
          className={`${styles.convoContainer} ${
            !activeConvo && styles.inactiveConvo
          }`}
        >
          <Conversation
            sessionUser={sessionUser}
            rooms={rooms}
            roomId={roomId}
            toggleConvo={toggleConvo}
            activeConvo={activeConvo}
          />
        </div>
        {newMessageModal && (
          <Modal onClose={toggleNewMessageModal}>
            <NewMessage
              onClose={toggleNewMessageModal}
              toggleConvo={toggleConvo}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default SideMessages;
