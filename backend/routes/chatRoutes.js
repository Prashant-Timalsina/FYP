import express from "express";
import { handleChat } from "../controllers/chatController.js";

const chatRouter = express.Router();

// Define the chat route
chatRouter.post("/", handleChat);

export default chatRouter;
