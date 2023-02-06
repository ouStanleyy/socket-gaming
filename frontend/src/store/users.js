// constants
const LOAD_USERS = "users/LOAD_USERS";
const LOAD_USER_DETAILS = "users/LOAD_USER_DETAILS";
const LOAD_SEARCH_RESULTS = "users/LOAD_SEARCH_RESULTS";
const SET_ITEM = "users/SET_ITEM";

// ACTION
const loadUsers = (users) => ({
  type: LOAD_USERS,
  users,
});

const loadUserDetails = (user) => ({
  type: LOAD_USER_DETAILS,
  user,
});

const loadSearchResults = (users) => ({
  type: LOAD_SEARCH_RESULTS,
  users,
});

const setItem = (userId, itemSetting) => ({
  type: SET_ITEM,
  userId,
  itemSetting,
});

// THUNKS
export const getUsers = () => async (dispatch) => {
  const res = await fetch("/api/users/");
  const { users } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    users.forEach((user) => (normalizedData[user.id] = user));
    dispatch(loadUsers(normalizedData));
    return users;
  }
};

export const getUserById = (userId) => async (dispatch) => {
  const res = await fetch(`/api/users/${userId}`);
  const user = await res.json();

  if (res.ok) {
    dispatch(loadUserDetails(user));
    return user;
  }
};

export const searchUsers = (searchVal) => async (dispatch) => {
  const res = await fetch(`/api/users/search?username=${searchVal}`);
  const { users } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    users.forEach((user) => (normalizedData[user.id] = user));
    dispatch(loadSearchResults(normalizedData));
    return users;
  }
};

export const editItemSetting =
  (item_type, itemId, userId) => async (dispatch) => {
    const res = await fetch(`/api/items/${itemId}/set`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item_type }),
    });

    if (res.ok) {
      const item = await res.json();
      dispatch(setItem(userId, { [`${item_type}_id`]: item.id }));
      return item;
    }
  };

const usersReducer = (state = { searchResults: {} }, action) => {
  switch (action.type) {
    case LOAD_USERS:
      return { ...state, ...action.users };
    case LOAD_USER_DETAILS:
      return {
        ...state,
        [action.user.id]: { ...state[action.user.id], ...action.user },
      };
    case LOAD_SEARCH_RESULTS:
      return { ...state, searchResults: action.users };
    case SET_ITEM:
      return {
        ...state,
        [action.userId]: { ...state[action.userId], ...action.itemSetting },
      };
    default:
      return state;
  }
};

export default usersReducer;
