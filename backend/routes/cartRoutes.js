import express from "express";
import {
  addToCart,
  updateCart,
  getCart,
} from "../controllers/cartController.js";
import authUser from "../middlewares/UserAuth.js";

const cartRouter = express.Router();

// Add to cart
cartRouter.post("/add", authUser, addToCart);

// Update cart
cartRouter.put("/update", authUser, updateCart);

// Get cart
cartRouter.get("/get", authUser, getCart);

export default cartRouter;
