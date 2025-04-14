import express from "express";
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";

import {
  allOrders,
  cancelOrder,
  // cancelOrder,
  createOrder,
  placeOrder,
  placeOrderOnline,
  updatePaymentStatus,
  // placeOrderESewa,
  updateStatus,
  userOrders,
  // verifyESewaPayment,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

//Admin permissions
orderRouter.get("/all", adminAuth, allOrders);
orderRouter.put("/status", updateStatus);
orderRouter.put("/cancel", adminAuth, cancelOrder);

// user tasks
orderRouter.put("new-order", authUser, createOrder);

orderRouter.post("/physical", authUser, placeOrder);

// orderRouter.post("/online", authUser, placeOrderESewa);
orderRouter.post("/online", authUser, placeOrderOnline);
// orderRouter.get("/verify-esewa", verifyESewaPayment);

orderRouter.get("/myorder", authUser, userOrders);
orderRouter.put("/payment", authUser, updatePaymentStatus);

export default orderRouter;
