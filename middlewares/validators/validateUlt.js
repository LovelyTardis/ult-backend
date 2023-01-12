import { FindById } from "../../database/helpers/index.js";
import { Ult } from "../../models/index.js";

export const validateUlt = async (req, res, next) => {
  const { ult } = req.params;

  try {
    const found = await FindById(Ult, { id: ult, populate: ["user"] });

    if (!found)
      return res.status(404).json({
        code: 404,
        error: true,
        data: "Not found - ult",
      });

    const { _id, name, username, profilePicture } = found.user;

    found.user = {
      _id,
      name,
      username,
      profilePicture,
    };

    req.ult = found;

    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: true,
      data: error,
    });
  }
};
