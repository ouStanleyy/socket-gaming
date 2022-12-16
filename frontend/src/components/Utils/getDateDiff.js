const getDateDiff = (createdAt) => {
  const today = new Date();
  const created = new Date(createdAt);
  const minsDiff = (today - created) / 1000 / 60;
  const hoursDiff = minsDiff / 60;
  const dayDiff = hoursDiff / 24;
  const weekDiff = dayDiff / 7;

  let result;

  if (minsDiff <= 60) {
    result = `${Math.floor(minsDiff)}m`;
  } else if (hoursDiff <= 24) {
    result = `${Math.floor(hoursDiff)}h`;
  } else if (dayDiff <= 7) {
    result = `${Math.floor(dayDiff)}d`;
  } else {
    result = `${Math.floor(weekDiff)}w`;
  }

  return result;
};

export default getDateDiff;
