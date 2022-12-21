// constants
const LOAD_GAMES = "games/LOAD_GAMES";
const LOAD_GAME_DETAILS = "games/LOAD_GAME_DETAILS";
const ADD_GAME = "games/ADD_GAME";
const REMOVE_GAME = "games/REMOVE_GAME";

// actions
const loadGames = (games) => ({
  type: LOAD_GAMES,
  games,
});

const loadGameDetails = (game) => ({
  type: LOAD_GAME_DETAILS,
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
