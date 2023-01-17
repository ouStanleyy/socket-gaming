import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Switch, Route } from "react-router-dom";
import { getRooms } from "../../store/rooms";
import Conversation from "./Conversation";
import { ProfilePicture } from "../Elements";
import NewMessage from "./NewMessage";
import { Modal } from "../../context/Modal";
import styles from "./Messages.module.css";

const Messages = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const sio = useSelector((state) => state.socket.socket);
  const rooms = useSelector((state) => Object.values(state.rooms)).sort(
    (a, b) =>
      a.messages.length && b.messages.length
        ? new Date(b.messages[b.messages.length - 1].time_sent) -
          new Date(a.messages[a.messages.length - 1].time_sent)
        : a.messages.length
        ? -1
        : +1
  );
  const [newMessageModal, setNewMessageModal] = useState(false);
  const [roomId, setRoomId] = useState("");

  const toggleNewMessageModal = () => {
    setNewMessageModal((state) => !state);
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getRooms());
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
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
  }, [sio]);

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesList}>
        <div className={styles.messagesListHeader}>
          <h3 className={styles.sessionUser}>{sessionUser.username}</h3>
          <div
            className={styles.newConvoButton}
            onClick={toggleNewMessageModal}
          >
            <i className="fa-regular fa-share-from-square fa-lg" />
            {/* <svg
              aria-label="New message"
              // class="_ab6-"
              color="#262626"
              fill="#262626"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <path
                d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="16.848"
                x2="20.076"
                y1="3.924"
                y2="7.153"
              ></line>
            </svg> */}
          </div>
        </div>
        <h3 className={styles.title}>Messages</h3>
        {rooms.map((room) => (
          <Link key={room.id} to={`/messages/${room.id}`}>
            <div
              className={`${styles.userContainer} ${
                roomId && room.id === parseInt(roomId) && styles.activeUser
              }`}
            >
              <div className={styles.profilePicture}>
                <div
                  className={`${styles.status} ${
                    room.user?.is_online && styles.online
                  }`}
                >
                  <ProfilePicture
                    path={`/messages/${room.id}`}
                    user={room.user}
                    size={"large"}
                  />
                </div>
              </div>
              <div className={styles.userDetails}>
                <p className={styles.username}>{room.user?.username}</p>

                <p className={styles.msgPreview}>
                  {room.messages[room.messages.length - 1]?.message}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.convoContainer}>
        <Switch>
          <Route path="/messages/:roomId" exact={true}>
            <Conversation
              sessionUser={sessionUser}
              rooms={rooms}
              setRoomId={setRoomId}
            />
          </Route>
          <Route path="/messages">
            <div className={styles.noConvo}>
              {/* <i className="fa-regular fa-comments fa-5x" /> */}
              <i className="fa-solid fa-paper-plane fa-5x" />
              {/* <svg
                aria-label="Direct"
                // class="_ab6-"
                color="#262626"
                fill="#262626"
                height="96"
                role="img"
                viewBox="0 0 96 96"
                width="96"
              >
                <circle
                  cx="48"
                  cy="48"
                  fill="none"
                  r="47"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></circle>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  x1="69.286"
                  x2="41.447"
                  y1="33.21"
                  y2="48.804"
                ></line>
                <polygon
                  fill="none"
                  points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></polygon>
              </svg> */}
              <h3>Your Messages</h3>
              <p>Send private messages to a friend.</p>
              <button onClick={toggleNewMessageModal}>Send Message</button>
            </div>
          </Route>
        </Switch>
      </div>
      {newMessageModal && (
        <Modal onClose={toggleNewMessageModal}>
          <NewMessage onClose={toggleNewMessageModal} />
        </Modal>
      )}
    </div>
  );
};

export default Messages;
