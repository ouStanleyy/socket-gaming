// constants
const LOAD_ROOMS = "rooms/LOAD_ROOMS";
const ADD_ROOM = "rooms/ADD_ROOM";
const UPDATE_ROOM = "rooms/UPDATE_ROOM";
const ADD_MESSAGE = "rooms/ADD_MESSAGE";

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
const roomsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_ROOMS:
      return { ...action.rooms };
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
    default:
      return state;
  }
};

export default roomsReducer;
