// constants
const SET_SOCKET = "socket/SET_SOCKET";

// actions
export const setSocket = (socket) => ({
  type: SET_SOCKET,
  socket,
});

// thunks

// reducer
const socketReducer = (state = { socket: {} }, action) => {
  switch (action.type) {
    case SET_SOCKET:
      return { socket: action.socket };
    default:
      return state;
  }
};

export default socketReducer;
