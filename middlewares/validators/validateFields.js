import { validationResult } from "express-validator";
import { customError } from "../../utils/customError.js";

export const validateFields = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const data = result.array().map((err) => err.msg);
    return next(customError(data, 400));
  }

  next();
};
