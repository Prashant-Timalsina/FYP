import bcrypt from "bcrypt"; // For hashing passwords
import userModel from "../models/userModel.js"; // Import the user model
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// CREATE: Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userAvailable = await userModel.findOne({ email });
    if (userAvailable) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    // Check password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    const user = await newUser.save();

    // Generate token for the user
    const token = createToken(user._id);

    // Respond with success and the token
    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// READ: Get user by email
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.params;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res.status(200).json({ success: true, token });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// READ: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ message: "All users", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
};
