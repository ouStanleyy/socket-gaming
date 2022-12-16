import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, useParams, Link } from "react-router-dom";
import { getRooms } from "../../store/rooms";
import { ProfilePicture } from "../Elements";
import styles from "./Conversation.module.css";

const Conversation = ({ sessionUser, rooms, setRoomId }) => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const room = rooms.find((room) => room.id === parseInt(roomId));
  const oldMessages = room?.messages;
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);
  const [sio, setSio] = useState("");
  const [sid, setSid] = useState("");
  // const [loading, setLoading] = useState(true);

  const isToday = (date) =>
    new Date().toDateString() === new Date(date).toDateString();

  const isOverHour = (newDate, oldDate) =>
    (new Date(newDate) - new Date(oldDate)) / 1000 / 60 > 15;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      sio.emit("message", { message, room: roomId, uid: sessionUser.id });
      setMessage("");
    }
  };

  useEffect(() => {
    if (sio) {
      sio.once("message", (data) => {
        if (data) {
          // if (sid) console.log("compare", sid === data?.sid);
          dispatch(getRooms());
          // setMessages([...messages, data]);
        }
      });
    }
  }, [sid, dispatch, oldMessages]);

  useEffect(() => {
    // const socket = io("http://127.0.0.1:5000/", {
    //   transports: ["websocket"],
    //   cors: {
    //     origin: "http://localhost:3000/",
    //   },
    //   query: `room=${roomId}`,
    // });

    const socket = io({ query: `room=${roomId}` });

    setSio(socket);

    socket.on("connect", (data) => {
      if (data) {
        // console.log("sid", data);
        setSid(data?.sid);
      }
    });

    // setLoading(false);

    // socket.on("disconnect", (data) => {
    //   console.log(data);
    // });

    return () => {
      socket.disconnect();
      setSid("");
      // setMessages([]);
    };
  }, [roomId]);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getRooms());
        // setLoaded(true);
      } catch (err) {}
    })();
  }, [dispatch, roomId]);

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
              <p className={styles.fullName}>{room.user?.full_name}</p>
            </div>
          </Link>
        </div>
        <div className={styles.conversationWrapper}>
          <div className={styles.conversation}>
            {oldMessages.map(({ id, message, user_id, time_sent }, idx) => (
              <div className={styles.messageWrapper} key={id}>
                {(isOverHour(time_sent, oldMessages[idx - 1]?.time_sent) ||
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
                      user_id !== oldMessages[idx + 1]?.user_id && (
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
            {/* {messages.map((data, idx) => (
              <p
                key={idx}
                className={`${styles.message} ${
                  data.sid === sid ? styles.outgoing : styles.incoming
                }`}
              >
                {data.message}
              </p>
            ))} */}
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
