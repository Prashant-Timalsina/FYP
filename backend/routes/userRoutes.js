import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  adminLogin,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js"; // Import the user controller
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";

const userRouter = express.Router();

// User Routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

//Route for admin Login
userRouter.post("/admin", adminLogin);

// Route to get all users (requires authentication)
userRouter.get("/list", adminAuth, getAllUsers);

// Route to delete a user by ID (requires authentication)
userRouter.delete("/remove/:id", deleteUser);

// Route to update a user (requires authentication)
userRouter.put("/update", authUser, updateUser);

// Route to request a password reset (send reset email)
userRouter.post("/forgot-password", requestPasswordReset);

// Route to reset the password using the token
userRouter.post("/reset-password", resetPassword);

export default userRouter;
