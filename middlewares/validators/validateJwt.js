import { request } from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../../models/index.js";
import { FindById } from "../../database/helpers/findInDatabase.js";
import { customError } from "../../utils/customError.js";

export const validateJwt = async (req = request, _, next) => {
  const token = req.header("user-token");

  if (!token)
    return next(customError("Bad request - user-token header required", 400));

  try {
    const { uid: id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const found = await FindById(UserModel, { id });

    if (!found)
      return next(customError("Bad request - user not in the database", 400));

    req.user = found;

    next();
  } catch (err) {
    return next(customError(err));
  }
};
