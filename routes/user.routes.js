import { Router } from "express";
import { check } from "express-validator";

import { getUser, createUser } from "../controllers/index.js";

import { validateFields } from "../middlewares/index.js";

const userRoutes = Router();

const middlewares = {
  getUser: [
    check("username").notEmpty(),
    // check("username").custom(),
    validateFields,
  ],
  create: [
    check("email", "Bad request - no email in body").notEmpty(),
    check("email", "Bad request - not a valid email").isEmail(),
    // check if the email exists in the database
    check("name", "Bad request - no name in body").notEmpty(),
    check("username", "Bad request - no username in body").notEmpty(),
    // check if the username exists in the database
    check(
      "password",
      "Bad request - password must have 6 or more characters"
    ).isLength({
      min: 6,
    }),
    validateFields,
  ],
};

userRoutes.get("/:username", middlewares.getUser, getUser);
userRoutes.post("/create", middlewares.create, createUser);

export default userRoutes;
