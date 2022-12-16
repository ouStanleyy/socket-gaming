const normalizeErrors = (errorsArray) => {
  const errors = {};
  errorsArray.forEach((error) => {
    const [key, value] = error.split(" : ");
    errors[key] = value;
  });

  return errors;
};
export default normalizeErrors;
