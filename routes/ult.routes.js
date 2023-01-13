import { Router } from "express";
import { check } from "express-validator";

// CONTROLLERS
import { getUlt, createUlt } from "../controllers/index.js";

// MIDDLEWARES
import {
  validateFields,
  validateUlt,
} from "../middlewares/validators/index.js";
import { generalError } from "../middlewares/errors.js";

const ultRoutes = Router();

const middlewares = {
  getUlt: [
    check("ult", "Bad request - ult is required").notEmpty(),
    check("ult", "Bad request - not a Mongo Id").isMongoId(),
    validateUlt,
    validateFields,
  ],
  create: [
    check("user").isMongoId(),
    check("message", "Message is required").notEmpty(),
    // TODO: if ult in body, add the created ult as a comment for the other ult
    validateFields,
  ],
};

ultRoutes.get("/:ult", middlewares.getUlt, getUlt);
ultRoutes.post("/", middlewares.create, createUlt);
ultRoutes.use(generalError);

export default ultRoutes;
