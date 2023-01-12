import { FindOne } from "../database/helpers/index.js";
import { User } from "../models/index.js";

export const validateUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const found = await FindOne(User, {
      filter: { username },
      populate: ["ults"],
      populate2: ["likedUlts"],
    });

    if (!found)
      return res.status(404).json({
        code: 404,
        error: true,
        data: "Not found - username",
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
