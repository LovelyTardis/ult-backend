export const generalError = (error, req, res, next) => {
  res.status(error.code).json(error);
};
