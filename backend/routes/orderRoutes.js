import express from "express";
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";
import upload from "../middlewares/multer.js";

import {
  allOrders,
  cancelOrder,
  // cancelOrder,
  createOrder,
  getOrderById,
  placeOrder,
  placeOrderOnline,
  placeCustomOrder,
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
orderRouter.put("/cancel", cancelOrder);

// user tasks
orderRouter.put("new-order", authUser, createOrder);

orderRouter.post("/physical", authUser, placeOrder);

// orderRouter.post("/online", authUser, placeOrderESewa);
orderRouter.post("/online", authUser, placeOrderOnline);
orderRouter.post(
  "/custom",
  authUser,
  upload.array("image", 4),
  placeCustomOrder
);
// orderRouter.get("/verify-esewa", verifyESewaPayment);

orderRouter.get("/myorder", authUser, userOrders);
orderRouter.put("/payment", authUser, updatePaymentStatus);

orderRouter.get("/:id", authUser, getOrderById);

export default orderRouter;
