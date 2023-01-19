import { FindOne } from "../../database/helpers/index.js";
import { UserModel } from "../../models/index.js";
import { customError } from "../../utils/customError.js";

export const validateLoginCredentials = async (req, res, next) => {
  const { email, username = "", password } = req.body;

  if ((!email && !username) || !password)
    return next(
      customError("Bad request - no username, email or password", 400)
    );

  try {
    const found = email
      ? await FindOne(UserModel, { filter: { email } })
      : await FindOne(UserModel, { filter: { username } });

    if (!found)
      return next(customError("Bad request - login credentials wrong", 400));

    req.user = found;

    next();
  } catch (err) {
    return next(customError(err));
  }
};
