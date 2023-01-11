import { Router } from "express";
import { check } from "express-validator";

// CONTROLLERS
import { getUlt, createUlt } from "../controllers/index.js";

// MIDDLEWARES
import { validateFields } from "../middlewares/index.js";

const ultRoutes = Router();

const middlewares = {
  getUlt: [validateFields],
  create: [
    check("user").isMongoId(),
    check("message", "Message is required").notEmpty(),
    // TODO: if ult in body, add the created ult as a comment for the other ult
    validateFields,
  ],
};

ultRoutes.get("/:ult", middlewares.getUlt, getUlt);
ultRoutes.post("/", middlewares.create, createUlt);

export default ultRoutes;
