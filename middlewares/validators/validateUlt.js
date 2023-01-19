import { FindById } from "../../database/helpers/index.js";
import { UltModel } from "../../models/index.js";
import { customError } from "../../utils/customError.js";

export const validateUlt = async (req, res, next) => {
  const { ult } = req.params;

  try {
    const found = await FindById(UltModel, {
      id: ult,
      populate: ["comments"],
    });

    if (!found) return next(customError("Not found - ult", 404));

    const { _id, name, username, profilePicture } = found.user;

    found.user = {
      _id,
      name,
      username,
      profilePicture,
    };

    req.ult = found;

    next();
  } catch (err) {
    return next(customError(err));
  }
};
