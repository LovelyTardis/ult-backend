import express from "express";
import cors from "cors";

import dbConnection from "./database/config.js";
import { userRoutes, ultRoutes } from "./routes/index.js";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    this.routesPath = {
      user: "/user",
      ult: "/ult",
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log("App started. Listening on port", this.port);
    });
  }

  async database() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.routesPath.user, userRoutes);
    this.app.use(this.routesPath.ult, ultRoutes);
  }
}
