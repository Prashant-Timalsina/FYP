import bcrypt from "bcrypt"; // For hashing passwords
import userModel from "../models/userModel.js"; // Import the user model
import jwt from "jsonwebtoken";
import validator from "validator";
import sendEmail from "../utils/emailService.js"; // Adjust path if needed
import crypto from "crypto";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const passwordValidation = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;

// CREATE: Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure req.files exists and handle the image
    const image = req.files?.image?.[0]; // Check if req.files exists and get the image

    // Upload the image to Cloudinary
    let imageURL = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

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

    // Validate Passord length should be more then 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length must be greater then 6",
      });
    }

    //Validate with regex
    if (!password.match(passwordValidation)) {
      return res.status(400).json({
        success: false,
        message: `Password must contain at least one uppercase letter and one number.
          Pasword must be at least 6 characters long`,
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      avatar: imageURL,
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
    return res.status(200).json({
      success: true,
      message: "Logged in",
      token,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 🔹 Superadmin Login (Fixed Email & Password)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: "superadmin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        token,
        role: "superadmin",
      });
    }

    // 🔹 Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    // 🔹 Ensure the user has admin privileges
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access is not allowed for this account",
      });
    }

    // 🔹 Validate password (check against hashed password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔹 Generate JWT Token for Admin
    const token = jwt.sign(
      { email, role: "admin", userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      token,
      role: "admin",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userData = async (req, res) => {
  try {
    const { id } = req.user;

    // Check if the authenticated user matches the ID in the request
    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "You can only access your own data" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE: Update user details
export const updateUser = async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;
    const avatar = req.files?.image?.[0]; // Check if an image is uploaded

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let imageURL = user.avatar; // Default to current avatar
    if (avatar) {
      const result = await cloudinary.uploader.upload(avatar.path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (avatar) user.avatar = imageURL; // Update avatar if provided

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

// 1️⃣ Request Password Reset (Sends Email)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token & expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry

    console.log("Generated reset token:", resetToken);
    console.log("Before saving user:", user);

    await user.save();

    // Send reset email
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset", `Click here: ${resetLink}`);

    res.json({ success: true, message: "Reset email sent!" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Check if password meets the criteria
    if (!passwordValidation.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter and one number",
      });
    }

    console.log("Received token:", token);
    console.log("Checking database for user with this token...");

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    console.log("Found user:", user);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
