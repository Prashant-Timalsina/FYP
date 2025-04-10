// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  transaction_uuid: { type: String, required: true, unique: true },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
  refId: { type: String }, // returned by eSewa after payment
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
