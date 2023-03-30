import { Router } from "express";
import { check } from "express-validator";

// CONTROLLERS
import { getUlt, getAllUlts, createUlt } from "../controllers/index.js";

// MIDDLEWARES
import {
  validateFields,
  validateUlt,
  validateJwt,
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
    validateJwt,
    check("message", "Message is required").notEmpty(),
    validateFields,
  ],
};

ultRoutes.get("/all", getAllUlts);
ultRoutes.get("/:ult", middlewares.getUlt, getUlt);
ultRoutes.post("/create", middlewares.create, createUlt);
ultRoutes.use(generalError);

export default ultRoutes;
