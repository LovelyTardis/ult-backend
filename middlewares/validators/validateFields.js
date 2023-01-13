import { validationResult } from "express-validator";
import { customError } from "../../utils/customError.js";

export const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(customError(errors, 400));
  }

  next();
};
