import { Router } from "express";

const userRoutes = Router();

const middlewares = {};

userRoutes.get("/", () => console.log("Get userRoutes"));
userRoutes.post("/", () => console.log("Post userRoutes"));

export default userRoutes;
