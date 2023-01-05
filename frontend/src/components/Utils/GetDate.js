const getDate = (createdAt) => {
  const created = new Date(createdAt);
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  const month = created.getMonth();
  const date = created.getDate();
  const year = created.getFullYear();

  let result = `${months[month]} ${date} ${year}`;

  return result;
};

export default getDate;
