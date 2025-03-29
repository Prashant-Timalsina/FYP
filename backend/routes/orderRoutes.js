import express from "express";
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";

import {
  allOrders,
  // cancelOrder,
  createOrder,
  placeOrder,
  placeOrderOnline,
  // placeOrderESewa,
  updateStatus,
  userOrders,
  // verifyESewaPayment,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

//Admin permissions
orderRouter.get("/all", adminAuth, allOrders);
orderRouter.put("/status/:orderId", updateStatus);

// user tasks
orderRouter.put("new-order", authUser, createOrder);

orderRouter.post("/physical", authUser, placeOrder);

// orderRouter.post("/online", authUser, placeOrderESewa);
orderRouter.post("/online", authUser, placeOrderOnline);
// orderRouter.get("/verify-esewa", verifyESewaPayment);

orderRouter.get("/myorder", authUser, userOrders);
// orderRouter.post("/cancel", authUser, cancelOrder);

export default orderRouter;
