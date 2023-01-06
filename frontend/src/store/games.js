// constants
const LOAD_GAMES = "games/LOAD_GAMES";
const LOAD_GAME_DETAILS = "games/LOAD_GAME_DETAILS";
const UPDATE_GAME_SCORES = "games/UPDATE_GAME_SCORES";
const ADD_GAME = "games/ADD_GAME";
const REMOVE_GAME = "games/REMOVE_GAME";

// actions
const loadGames = (games) => ({
  type: LOAD_GAMES,
  games,
});

export const loadGameDetails = (game) => ({
  type: LOAD_GAME_DETAILS,
  game,
});

export const updateGameScores = (game) => ({
  type: UPDATE_GAME_SCORES,
  game,
});

const addGame = (game) => ({
  type: ADD_GAME,
  game,
});

const removeGame = (gameId) => ({
  type: REMOVE_GAME,
  gameId,
});

// thunks
export const getGames = () => async (dispatch) => {
  const res = await fetch(`/api/games/`);
  const { Games } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    Games.forEach((game) => (normalizedData[game.id] = game));
    dispatch(loadGames(normalizedData));
    return normalizedData;
  }
};

export const getGameById = (gameId) => async (dispatch) => {
  const res = await fetch(`/api/games/${gameId}`);
  const game = await res.json();

  if (res.ok) {
    dispatch(loadGameDetails(game));
    return game;
  }
};

export const createNewGame = (game_type) => async (dispatch) => {
  const res = await fetch(`/api/games/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game_type }),
  });
  const game = await res.json();
  console.log("store", game);
  if (res.ok) {
    dispatch(addGame(game));
    return game.id;
  }
};

export const joinGame = (gameId) => async (dispatch) => {
  const res = await fetch(`/api/games/${gameId}/join`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  const game = await res.json();

  if (res.ok) {
    dispatch(loadGameDetails(game));
    return game;
  }
};

export const leaveGame = (gameId) => async (dispatch) => {
  const res = await fetch(`/api/games/${gameId}/leave`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  const game = await res.json();

  if (res.ok) {
    dispatch(loadGameDetails(game));
    return game;
  }
};

export const deleteGame = (gameId) => async (dispatch) => {
  const res = await fetch(`/api/games/${gameId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    dispatch(removeGame(gameId));
  }
};

export const updateReadyState = (gameId, ready_state) => async (dispatch) => {
  const res = await fetch(`/api/games/${gameId}/ready`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ready_state }),
  });
  const game = await res.json();

  if (res.ok) {
    dispatch(loadGameDetails(game));
    return game;
  }
};

export const startGame = (gameId, initPositions) => async (dispatch) => {
  const res = await fetch(`/api/games/${gameId}/start`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(initPositions),
  });
  const game = await res.json();

  if (res.ok) return game;
};

// reducer
const gamesReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GAMES:
      return { ...action.games };
    case LOAD_GAME_DETAILS:
      return {
        ...state,
        [action.game.id]: { ...state[action.game.id], ...action.game },
      };
    case UPDATE_GAME_SCORES:
      console.log("action", action.game);
      console.log("state", state[action.game.gameId]);
      return {
        ...state,
        [action.game.gameId]: {
          ...state[action.game.gameId],
          game_data: {
            ...state[action.game.gameId].game_data,
            ...action.game.scores,
          },
        },
      };
    case ADD_GAME:
      return { ...state, [action.game.id]: action.game };
    case REMOVE_GAME:
      const newState = { ...state };
      delete newState[action.gameId];
      return newState;
    default:
      return state;
  }
};

export default gamesReducer;
