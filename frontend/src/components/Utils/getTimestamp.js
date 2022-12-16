const getTimestamp = (timeSent) => {
  const isToday = (date) => {
    const today = new Date();

    if (today.toDateString() === date.toDateString()) {
      return true;
    }

    return false;
  };
  const timestamp = new Date(timeSent);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = timestamp.getMonth();
  const date = timestamp.getDate();
  const year = timestamp.getYear();

  return `${months[month]} ${date}, ${year}`;
};

export default getTimestamp;
