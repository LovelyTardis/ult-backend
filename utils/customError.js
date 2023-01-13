export const customError = (data, code = 500) => ({
  code,
  error: true,
  data,
});
