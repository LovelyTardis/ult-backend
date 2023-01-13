import { FindOne } from "../../database/helpers/index.js";
import { UserModel } from "../../models/index.js";
import { customError } from "../../utils/customError.js";

export const validateUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const found = await FindOne(UserModel, {
      filter: { username },
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
