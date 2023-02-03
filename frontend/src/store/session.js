// constants
const SET_USER = "session/SET_USER";
const CLEAR_SESSION = "session/CLEAR_SESSION";
const LOAD_ITEMS = "session/LOAD_ITEMS";
const ADD_ITEM = "session/ADD_ITEM";

// actions
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const clearSession = () => ({
  type: CLEAR_SESSION,
});

const loadItems = (items) => ({
  type: LOAD_ITEMS,
  items,
});

export const addItem = (item) => ({
  type: ADD_ITEM,
  item,
});

// thunks
export const authenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
    dispatch(loadItems(data.items));
  }
};

export const login = (username, password) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    dispatch(loadItems(data.items));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const logout = () => async (dispatch) => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    dispatch(clearSession());
  }
};

export const signUp = (username, password) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const editProfile =
  ({ profilePicture, username }) =>
  async (dispatch) => {
    const res = await fetch(`/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_picture: profilePicture,
        username,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(setUser(data));
      return null;
    } else if (res.status < 500) {
      const data = await res.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return ["An error occurred. Please try again."];
    }
  };

export const updatePassword =
  ({ oldPassword, newPassword }) =>
  async (dispatch) => {
    const res = await fetch("/api/users/profile/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(setUser(data));
    } else {
      const data = await res.json();
      if (data.errors) {
        return data.errors;
      }
    }
  };

// reducer
export default function reducer(state = { user: null, items: [] }, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case LOAD_ITEMS:
      return { ...state, items: action.items };
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.item] };
    case CLEAR_SESSION:
      return { user: null, items: [] };
    default:
      return state;
  }
}
