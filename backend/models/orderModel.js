import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, required: true },
        category: {
          type: String,
          // type: mongoose.Schema.Types.ObjectId,
          // ref: "Category",
          required: true,
        },
        wood: {
          type: String,
          // type: mongoose.Schema.Types.ObjectId,
          // ref: "Wood",
          required: true,
        },
        length: { type: Number, required: true },
        breadth: { type: Number, required: true },
        height: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, default: 1 },
        // isCustom: { type: Boolean, default: false }, // Flag for custom orders
      },
    ],
    address: { type: Object, required: true },
    amount: { type: Number, required: true },

    payment: { type: Number, default: 0 },
    status: {
      type: String,
      default: "Pending", // Remove enum but set a default value
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },

    refundAmount: { type: Number, default: 0 },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.model("Order", orderSchema) || mongoose.models.order;
export default orderModel;
