// constants
const LOAD_ROOMS = "rooms/LOAD_ROOMS";
const ADD_ROOM = "rooms/ADD_ROOM";

// actions
const loadRooms = (rooms) => ({
  type: LOAD_ROOMS,
  rooms,
});

const addRoom = (room) => ({
  type: ADD_ROOM,
  room,
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
    default:
      return state;
  }
};

export default roomsReducer;
