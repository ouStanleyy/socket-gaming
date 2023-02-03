// constants
const LOAD_SHOP_ITEMS = "shop/LOAD_SHOP_ITEMS";
// const LOAD_GAME_DETAILS = "games/LOAD_GAME_DETAILS";
// const UPDATE_GAME_SCORES = "games/UPDATE_GAME_SCORES";
// const ADD_GAME = "games/ADD_GAME";
// const REMOVE_GAME = "games/REMOVE_GAME";

// actions
const loadShopItems = (items) => ({
  type: LOAD_SHOP_ITEMS,
  items,
});

// export const loadGameDetails = (game) => ({
//   type: LOAD_GAME_DETAILS,
//   game,
// });

// export const updateGameScores = (game) => ({
//   type: UPDATE_GAME_SCORES,
//   game,
// });

// const addGame = (game) => ({
//   type: ADD_GAME,
//   game,
// });

// const removeGame = (gameId) => ({
//   type: REMOVE_GAME,
//   gameId,
// });

// thunks
export const getShopItems = () => async (dispatch) => {
  const res = await fetch(`/api/items/`);
  const { items } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    items.forEach((item) => (normalizedData[item.id] = item));
    dispatch(loadShopItems(normalizedData));
    return normalizedData;
  }
};

// export const getGameById = (gameId) => async (dispatch) => {
//   const res = await fetch(`/api/games/${gameId}`);
//   const game = await res.json();

//   if (res.ok) {
//     dispatch(loadGameDetails(game));
//     return game;
//   }
// };

// reducer
const shopReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SHOP_ITEMS:
      return { ...action.items };
    // case LOAD_GAME_DETAILS:
    //   return {
    //     ...state,
    //     [action.game.id]: { ...state[action.game.id], ...action.game },
    //   };
    // case UPDATE_GAME_SCORES:
    //   return {
    //     ...state,
    //     [action.game.gameId]: {
    //       ...state[action.game.gameId],
    //       game_data: {
    //         ...state[action.game.gameId].game_data,
    //         ...action.game.scores,
    //       },
    //     },
    //   };
    // case ADD_GAME:
    //   return { ...state, [action.game.id]: action.game };
    // case REMOVE_GAME:
    //   const newState = { ...state };
    //   delete newState[action.gameId];
    //   return newState;
    default:
      return state;
  }
};

export default shopReducer;
