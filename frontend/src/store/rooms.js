// constants
const LOAD_ROOMS = "rooms/LOAD_ROOMS";
const ADD_ROOM = "rooms/ADD_ROOM";
const UPDATE_ROOM = "rooms/UPDATE_ROOM";
const ADD_MESSAGE = "rooms/ADD_MESSAGE";
const SET_HIDE_MESSAGES = "rooms/SET_HIDE_MESSAGES";
const SET_ROOM_ID = "rooms/SET_ROOM_ID";
const SET_ACTIVE_CONVO = "rooms/SET_ACTIVE_CONVO";

// actions
const loadRooms = (rooms) => ({
  type: LOAD_ROOMS,
  rooms,
});

const addRoom = (room) => ({
  type: ADD_ROOM,
  room,
});

export const updateRoom = (room) => ({
  type: UPDATE_ROOM,
  room,
});

export const addMessage = (message, roomId) => ({
  type: ADD_MESSAGE,
  message,
  roomId,
});

export const setHideMessages = (state = null) => ({
  type: SET_HIDE_MESSAGES,
  state,
});

export const setRoomId = (roomId) => ({
  type: SET_ROOM_ID,
  roomId,
});

export const setActiveConvo = (state = null) => ({
  type: SET_ACTIVE_CONVO,
  state,
});

// thunks
export const getRooms = () => async (dispatch) => {
  const res = await fetch(`/api/rooms/`);
  const { Rooms } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    Rooms.forEach((room) => (normalizedData[room.id] = room));
    dispatch(loadRooms(normalizedData));
    return normalizedData;
  }
};

export const getRoomById = (roomId) => async (dispatch) => {
  const res = await fetch(`/api/rooms/${roomId}`);
  const room = await res.json();

  if (res.ok) {
    dispatch(addRoom(room));
    return room;
  }
};

export const createNewRoom = (user_id) => async (dispatch) => {
  const res = await fetch(`/api/rooms/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  });
  const room = await res.json();

  if (res.ok) {
    dispatch(addRoom(room));
    return room.id;
  }
};

// reducer
const roomsReducer = (
  state = { chat: { hideMessages: true, roomId: "", activeConvo: false } },
  action
) => {
  switch (action.type) {
    case LOAD_ROOMS:
      return { ...state, ...action.rooms };
    case ADD_ROOM:
      return { ...state, [action.room.id]: action.room };
    case UPDATE_ROOM:
      return {
        ...state,
        [action.room.id]: { ...state[action.room.id], ...action.room },
      };
    case ADD_MESSAGE:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          messages: [...state[action.roomId].messages, action.message],
        },
      };
    case SET_HIDE_MESSAGES:
      return {
        ...state,
        chat: {
          ...state.chat,
          hideMessages:
            action.state !== null ? action.state : !state.chat.hideMessages,
        },
      };
    case SET_ROOM_ID:
      return {
        ...state,
        chat: {
          ...state.chat,
          roomId: action.roomId,
        },
      };
    case SET_ACTIVE_CONVO:
      return {
        ...state,
        chat: {
          ...state.chat,
          activeConvo:
            action.state !== null ? action.state : !state.chat.activeConvo,
        },
      };
    default:
      return state;
  }
};

export default roomsReducer;
