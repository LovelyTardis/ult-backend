import { Router } from "express";
import { check } from "express-validator";

// CONTROLLERS
import {
  getUlt,
  getAllUlts,
  createUlt,
  deleteUlt,
  likeUlt,
} from "../controllers/index.js";

// MIDDLEWARES
import {
  validateFields,
  validateUlt,
  validateJwt,
} from "../middlewares/validators/index.js";
import { generalError } from "../middlewares/errors.js";

const ultRoutes = Router();

const middlewares = {
  get: [
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
  like: [
    validateJwt,
    check("ult", "Bad request - ult is required").notEmpty(),
    check("ult", "Bad request - not a Mongo Id").isMongoId(),
    check("like", "Bad request - like is required").notEmpty(),
    validateUlt,
    validateFields,
  ],
  delete: [
    check("ult", "Bad request - ult is requiered").notEmpty(),
    check("ult", "Bad request - not a mongo id").isMongoId(),
    validateUlt,
    validateFields,
  ],
};

ultRoutes.get("/all", getAllUlts);
ultRoutes.get("/:ult", middlewares.get, getUlt);
ultRoutes.post("/create", middlewares.create, createUlt);
ultRoutes.put("/like/:ult", middlewares.like, likeUlt);
ultRoutes.delete("/delete/:ult", middlewares.delete, deleteUlt);
ultRoutes.use(generalError);

export default ultRoutes;
