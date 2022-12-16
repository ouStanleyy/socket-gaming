/*
  Accepts: the current user object and an array of users from store
  Returns: random unique suggestions
*/
const getRandomSuggestion = (loggedInUser, arrayofUsers, following) => {
  const followingIds = following.map((user) => user.following_id);
  const NUM_OF_SUGGESTIONS = 5;
  const shuffled = [...arrayofUsers]
    .filter(
      (user) =>
        user.id !== loggedInUser.id &&
        Object.keys(user).length !== 0 &&
        !followingIds.includes(user.id)
    )
    .sort(() => 0.5 - Math.random());

  return shuffled.slice(0, NUM_OF_SUGGESTIONS);
};

export default getRandomSuggestion;
