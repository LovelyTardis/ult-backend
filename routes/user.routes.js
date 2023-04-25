import { Router } from "express";
import { check } from "express-validator";

// CONTROLLERS
import {
  getUser,
  createUser,
  loginUser,
  autoLogin,
} from "../controllers/index.js";

// MIDDLEWARES
import {
  validateFields,
  validateUserId,
  validateUsername,
  validateLoginCredentials,
  validateJwt,
} from "../middlewares/validators/index.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../middlewares/checkers/index.js";
import { generalError } from "../middlewares/errors.js";

const userRoutes = Router();
const middlewares = {
  getByUsername: [
    check("username").notEmpty(),
    validateUsername,
    validateFields,
  ],
  getById: [check("id").isMongoId(), validateUserId, validateFields],
  register: [
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
  autoLogin: [validateJwt, validateFields],
};

userRoutes.get("/id/:id", middlewares.getById, getUser);
userRoutes.get("/:username", middlewares.getByUsername, getUser);
userRoutes.post("/register", middlewares.register, createUser);
userRoutes.post("/login", middlewares.login, loginUser);
userRoutes.post("/autologin", middlewares.autoLogin, autoLogin);
userRoutes.use(generalError);

export default userRoutes;
