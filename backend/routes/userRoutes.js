import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js"; // Import the user controller
import authUser from "../middlewares/UserAuth.js";

const userRouter = express.Router();

// Route to create a new user
userRouter.post("/register", createUser);

// Route for user login
userRouter.post("/login", loginUser);

// Route to get all users (requires authentication)
userRouter.get("/users", authUser, getAllUsers);

// Route to delete a user by ID (requires authentication)
userRouter.delete("/remove/:id", authUser, deleteUser);

// Route to update a user (requires authentication)
userRouter.put("/update", authUser, updateUser);

export default userRouter;
