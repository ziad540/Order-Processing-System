export const calculatePagination = ({ pageNumber = 1, pageSize = 10 }) => {
  if (Number(pageNumber) < 1) pageNumber = 1;
  if (pageSize < 1 || pageSize > 100) pageSize = 10;

  return { limit: pageSize, offset: (pageNumber - 1) * pageSize };
};
