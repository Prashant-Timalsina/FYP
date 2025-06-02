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
  userData,
  verifyUser,
  updateUserRole,
} from "../controllers/userController.js"; // Import the user controller
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// User Routes
userRouter.post("/register", createUser);
userRouter.get("/verify-email", verifyUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// Route to get all users (requires authentication)
userRouter.get("/list", adminAuth, getAllUsers);

// Route to get a user by ID (requires authentication)
userRouter.get("/single/me", authUser, userData);

// Route to check if a user exists
// userRouter.get("/:id", adminAuth, checkUserExists);

// Route to delete a user by ID (requires authentication)
userRouter.delete("/remove/:id", adminAuth, deleteUser);

// Route to update a user (requires authentication)
userRouter.put(
  "/update",
  authUser,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateUser
);

// Route to request a password reset (send reset email)
userRouter.post("/forgot-password", requestPasswordReset);

// Route to reset the password using the token
userRouter.post("/reset-password", resetPassword);

// Route to update user role (admin <-> user, superadmin can demote admin)
userRouter.put("/updaterole/:id", adminAuth, updateUserRole);

export default userRouter;
