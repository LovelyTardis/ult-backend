import dotenv from "dotenv";
import Server from "./server.js";

dotenv.config();

const server = new Server();

server.start();
