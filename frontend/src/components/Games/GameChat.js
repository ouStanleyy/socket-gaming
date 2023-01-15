import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Redirect, useParams, Link } from "react-router-dom";
import { addMessage, getRoomById } from "../../store/rooms";
import { ProfilePicture } from "../Elements";
import styles from "./GameChat.module.css";

const GameChat = ({ sessionId, game }) => {
  const dispatch = useDispatch();
  const sio = useSelector((state) => state.socket.socket);
  const room = useSelector((state) => state.rooms[game?.room_id]);
  const messages = room?.messages;
  const [message, setMessage] = useState("");

  const findUser = (userId) => room.users.find(({ id }) => id === userId);

  const isToday = (date) =>
    new Date().toDateString() === new Date(date).toDateString();

  const isOverHour = (newDate, oldDate) =>
    (new Date(newDate) - new Date(oldDate)) / 1000 / 60 > 15;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      sio?.emit("message", { message, room: String(room.id), uid: sessionId });
      setMessage("");
    }
  };

  useEffect(() => {
    const message = () => {
      dispatch(getRoomById(room.id));
    };

    sio.on("message", message);

    return () => sio.off("message", message);
  }, [sio, room]);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getRoomById(game.room_id));
      } catch (err) {}
    })();
  }, [game]);

  return (
    <div className={styles.convoContainer}>
      {/* <div className={styles.convoHeader}>
        <Link className={styles.userContainer} to={`/users/${room?.user.id}`}>
          <div className={styles.profilePicture}>
            <ProfilePicture user={room?.user} size={"xsmall"} />
          </div>
          <div className={styles.userDetails}>
            <p className={styles.username}>{room?.user?.username}</p>
            <div
              className={`${styles.status} ${
                room?.user?.is_online && styles.online
              }`}
            ></div>
          </div>
        </Link>
      </div> */}
      <div className={styles.conversationWrapper}>
        <div className={styles.conversation}>
          {messages?.map(({ id, message, user_id, time_sent }, idx) => (
            <div className={styles.messageWrapper} key={id}>
              {(isOverHour(time_sent, messages[idx - 1]?.time_sent) ||
                !idx) && (
                <h4 className={styles.timestamp}>
                  {!isToday(time_sent) &&
                    new Date(time_sent).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                  {new Date(time_sent).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </h4>
              )}
              <div className={styles.messageBubbles}>
                <div className={styles.profilePic}>
                  {user_id !== sessionId &&
                    user_id !== messages[idx + 1]?.user_id && (
                      <ProfilePicture user={findUser(user_id)} size="xsmall" />
                    )}
                </div>
                <p
                  className={`${styles.message} ${
                    user_id === sessionId ? styles.outgoing : styles.incoming
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>
          ))}
          <div id={styles.anchor}></div>
        </div>
      </div>
      <form className={styles.messageInput} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
};

export default GameChat;
