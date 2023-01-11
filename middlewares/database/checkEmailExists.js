import { FindOne } from "../../database/helpers/index.js";
import { User } from "../../models/index.js";

const checkEmailExists = async (email) => {
  const exists = await FindOne(User, { filter: { email } });
  if (exists) throw new Error("Bad request - email already in use");
};

export default checkEmailExists;