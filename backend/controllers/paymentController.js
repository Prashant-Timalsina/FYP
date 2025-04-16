// controllers/paymentController.js
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import axios from "axios";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import qs from "qs";

const SECRET_KEY = process.env.ESEWA_SECRET;
const MERCHANT_CODE = "EPAYTEST";

export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res
        .status(400)
        .json({ message: "Order ID and amount are required" });
    }

    const transaction_uuid = uuidv4();

    const payment = await Payment.create({
      transaction_uuid,
      orderId,
      amount,
    });

    const hashString = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(hashString)
      .digest("base64");

    res.status(200).json({
      paymentId: payment._id,
      transaction_uuid,
      signature,
      success_url: "http://localhost:5173/payment-success",
      failure_url: "http://localhost:5173/payment-failure",
    });
  } catch (err) {
    console.error("Error initiating payment:", err);
    res
      .status(500)
      .json({ message: "Payment initiation failed", error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { refId, transaction_uuid, amt } = req.body;

  try {
    const payment = await Payment.findOne({ transaction_uuid });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const verifyRes = await axios.post(
      "https://rc.esewa.com.np/api/epay/transaction/status",
      qs.stringify({
        amt,
        pid: transaction_uuid,
        rid: refId,
        scd: MERCHANT_CODE,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (verifyRes.data.includes("<response_code>Success</response_code>")) {
      payment.status = "PAID";
      payment.refId = refId;
      await payment.save();

      await Order.findByIdAndUpdate(payment.orderId, { status: "PAID" });

      return res
        .status(200)
        .json({ message: "Payment verified and order updated" });
    } else {
      payment.status = "FAILED";
      await payment.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res
      .status(500)
      .json({ message: "Payment verification error", error: err.message });
  }
};
