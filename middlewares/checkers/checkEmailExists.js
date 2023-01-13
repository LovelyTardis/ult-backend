import { FindOne } from "../../database/helpers/index.js";
import { UserModel } from "../../models/index.js";

export const checkEmailExists = async (email) => {
  const exists = await FindOne(UserModel, { filter: { email } });
  if (exists) throw new Error("Bad request - email already in use");
};
