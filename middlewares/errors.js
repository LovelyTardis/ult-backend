export const generalError = (error, req, res, next) => {
  console.log("GENERAL ERROR!!!", error.data);
  res.status(error.code).json(error);
};
