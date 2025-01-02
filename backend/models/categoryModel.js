import { mongoose } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter Product Name"],
    },
    description: {
      type: String,
      required: [true, "Enter Product Description"],
    },
    image: {
      type: String,
      required: false,
    },
    // isbox: { type: Boolean, default: false },
    // boxCount: {type: Number}
  },
  { timestamps: true }
);

const categoryModel =
  mongoose.models.product || mongoose.model("Category", categorySchema);
export default categoryModel;
