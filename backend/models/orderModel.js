import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderState: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.model("Order", orderSchema) || mongoose.models.order;
export default orderModel;
