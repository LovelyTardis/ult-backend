import { FindOne } from "../../database/helpers/index.js";
import { UserModel } from "../../models/index.js";

export const checkUsernameExists = async (username) => {
  const exists = await FindOne(UserModel, { filter: { username } });
  if (exists) throw new Error("Bad request - username already in use");
};
