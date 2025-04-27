import express from "express";
import {
  addFeedback,
  getProductFeedback,
  getUserProductFeedback,
  updateFeedback,
} from "../controllers/feedbackController.js";
import authUser from "../middlewares/UserAuth.js";

const feedbackRouter = express.Router();

// Add feedback for a product
feedbackRouter.post("/add", authUser, addFeedback);

// Get all feedback for a product
feedbackRouter.get("/product/:productId", getProductFeedback);

// Get user's feedback for a product
feedbackRouter.get("/user/:productId", authUser, getUserProductFeedback);

// Update feedback
feedbackRouter.put("/update/:feedbackId", authUser, updateFeedback);

export default feedbackRouter;
