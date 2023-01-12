import { FindOne } from "../../database/helpers/index.js";
import { User } from "../../models/index.js";

export const validateLoginCredentials = async (req, res, next) => {
  const { email, username = "", password } = req.body;
  let found = null;

  if ((!email && !username) || !password)
    return res.status(400).json({
      code: 400,
      error: true,
      data: "Bad request - no username, email or password",
    });

  try {
    found = email
      ? await FindOne(User, { filter: { email } })
      : await FindOne(User, { filter: { username } });

    if (!found)
      return res.status(404).json({
        code: 404,
        error: true,
        data: "Not found - email, username or password wrong",
      });

    req.user = found;

    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: true,
      data: error,
    });
  }
};
