import { mongoose } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter Product Name"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Enter Product Price"],
    },
    image: { type: Array, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    woodName: {
      type: String,
      required: [true, "Add Wood Name"],
    },
    length: {
      type: Number,
      default: null, // Default to null if not provided
    },
    breadth: {
      type: Number,
      default: null, // Default to null if not provided
    },
    height: {
      type: Number,
      default: null, // Default to null if not provided
    },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.product || mongoose.model("Product", productSchema);
export default productModel;
