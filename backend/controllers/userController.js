import bcrypt from "bcrypt"; // For hashing passwords
import userModel from "../models/userModel.js"; // Import the user model
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// CREATE: Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // // Log the received input data
    // console.log("Received data:", { name, email, password });

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Validate input data
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
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

// LOGIN: Authenticate user and generate token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input data
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find the user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = createToken(user._id);
    return res.status(200).json({ success: true, token });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};

// UPDATE: Update user details
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, email, password } = req.body;

    // Validate input data
    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user to the database
    const updatedUser = await user.save();

    // Respond with success and the updated user
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// READ: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ message: "All users", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);
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
