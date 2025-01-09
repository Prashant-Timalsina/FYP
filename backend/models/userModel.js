import { mongoose } from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter User name"],
      trim: true,
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
      minLength: [6, "Password should be more then 6 letters"],
    },
    cartData: { type: Object, default: {} },
  },
  {
    minimize: false, // Keeps the empty fields as empty objects
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
