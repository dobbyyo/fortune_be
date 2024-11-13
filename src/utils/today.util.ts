export const todayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const todayYear = () => {
  const date = new Date();
  return date.getFullYear();
};
