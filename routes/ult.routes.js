import { Router } from "express";

const ultRoutes = Router();

const middlewares = {};

ultRoutes.get("/", () => console.log("Get ultRoutes"));
ultRoutes.post("/", () => console.log("Post ultRoutes"));

export default ultRoutes;
