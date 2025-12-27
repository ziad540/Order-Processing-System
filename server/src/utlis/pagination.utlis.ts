export const calculatePagination = ({ pageNumber = 1, pageSize = 10 }) => {
  pageNumber = Number(pageNumber); // Ensure number
  if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
  if (pageSize < 1 || pageSize > 1000) pageSize = 10;

  return { limit: pageSize, offset: (pageNumber - 1) * pageSize };
};
