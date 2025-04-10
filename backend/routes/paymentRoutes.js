// routes/paymentRoutes.js
import express from "express";
import {
  initiatePayment,
  verifyPayment,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/initiate", initiatePayment);
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;
