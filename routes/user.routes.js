import { Router } from "express";
import { check } from "express-validator";

// CONTROLLERS
import { getUser, createUser, loginUser } from "../controllers/index.js";

// MIDDLEWARES
import {
  validateFields,
  validateUsername,
  validateLoginCredentials,
} from "../middlewares/validators/index.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../middlewares/checkers/index.js";

const userRoutes = Router();
const middlewares = {
  getUser: [check("username").notEmpty(), validateUsername, validateFields],
  create: [
    check("email", "Bad request - no email in body").notEmpty(),
    check("email", "Bad request - not a valid email").isEmail(),
    check("email").custom(checkEmailExists),
    check("name", "Bad request - no name in body").notEmpty(),
    check("username", "Bad request - no username in body").notEmpty(),
    check("username").custom(checkUsernameExists),
    check(
      "password",
      "Bad request - password must have 6 or more characters"
    ).isLength({
      min: 6,
    }),
    validateFields,
  ],
  login: [validateLoginCredentials, validateFields],
};

userRoutes.get("/:username", middlewares.getUser, getUser);
userRoutes.post("/", middlewares.create, createUser);
userRoutes.post("/login", middlewares.login, loginUser);

export default userRoutes;
