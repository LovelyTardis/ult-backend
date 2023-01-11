import { FindOne } from "../../database/helpers/index.js";
import { User } from "../../models/index.js";

const checkUsernameExists = async (username) => {
  const exists = await FindOne(User, { filter: { username } });
  if (exists) throw new Error("Bad request - username already in use");
};

export default checkUsernameExists;
