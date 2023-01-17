import { FindById } from "../../database/helpers/index.js";
import { UserModel } from "../../models/index.js";
import { customError } from "../../utils/customError.js";

export const validateUserId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const found = await FindById(UserModel, {
      id,
      populate: ["ults"],
      populate2: ["likedUlts"],
    });

    if (!found) {
      return next(customError("Not found - username", 404));
    }

    req.user = found;

    next();
  } catch (err) {
    return next(customError(err));
  }
};
