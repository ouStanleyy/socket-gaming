import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams, Link } from "react-router-dom";
import { getRooms } from "../../store/rooms";
import { ProfilePicture } from "../Elements";
import styles from "./Conversation.module.css";

const Conversation = ({ sessionUser, rooms, setRoomId }) => {
  const dispatch = useDispatch();
  const sio = useSelector((state) => state.socket.socket);
  const { roomId } = useParams();
  const room = rooms.find((room) => room.id === parseInt(roomId));
  const messages = room?.messages;
  const [message, setMessage] = useState("");

  const isToday = (date) =>
    new Date().toDateString() === new Date(date).toDateString();

  const isOverHour = (newDate, oldDate) =>
    (new Date(newDate) - new Date(oldDate)) / 1000 / 60 > 15;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      sio?.emit("message", { message, room: roomId, uid: sessionUser.id });
      setMessage("");
    }
  };

  useEffect(() => {
    const message = () => {
      dispatch(getRooms());
    };

    sio.on("message", message);

    return () => sio.off("message", message);
  }, [sio]);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getRooms());
      } catch (err) {}
    })();
  }, [roomId]);

  useEffect(() => {
    setRoomId(roomId);
    return () => setRoomId("");
  }, [roomId]);

  return (
    rooms.length > 0 &&
    (!room ? (
      <Redirect to="/messages" />
    ) : (
      <>
        <div className={styles.convoHeader}>
          <Link className={styles.userContainer} to={`/users/${room.user.id}`}>
            <div className={styles.profilePicture}>
              <ProfilePicture user={room.user} size={"xsmall"} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.username}>{room.user?.username}</p>
              <div
                className={`${styles.status} ${
                  room.user?.is_online && styles.online
                }`}
              ></div>
            </div>
          </Link>
        </div>
        <div className={styles.conversationWrapper}>
          <div className={styles.conversation}>
            {messages.map(({ id, message, user_id, time_sent }, idx) => (
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
                    {user_id !== sessionUser.id &&
                      user_id !== messages[idx + 1]?.user_id && (
                        <ProfilePicture user={room.user} size="xsmall" />
                      )}
                  </div>
                  <p
                    className={`${styles.message} ${
                      user_id === sessionUser.id
                        ? styles.outgoing
                        : styles.incoming
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
      </>
    ))
  );
};

export default Conversation;
