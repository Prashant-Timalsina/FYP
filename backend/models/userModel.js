import { mongoose } from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter User name"],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    email: {
      type: String,
      required: [true, "Enter email"],
      unique: [true, "User email already in use"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Enter Password"],
      minLength: [6, "Password should be more than 6 letters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cartData: { type: Object, default: {} },
    // Add these fields for email verification
    isVerified: {
      type: Boolean,
      default: false, // Initially, email is not verified
    },
    verificationToken: {
      type: String, // Store the verification token here
    },
    // **New fields for reset token functionality**
    resetToken: {
      type: String, // Store the reset token here
      default: null,
    },
    resetTokenExpiry: {
      type: Date, // Store the reset token expiration time here
      default: null,
    },
  },
  {
    minimize: false, // Keeps the empty fields as empty objects
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
