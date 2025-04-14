import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/emailService.js";
import ApiFeature from "../utils/ApiFeature.js";

import { v4 as uuidv4 } from "uuid";

export const createOrder = async (req, res) => {};

export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orderData = {
      orderId: uuidv4(),
      userId,
      items,
      address,
      amount,
      paymentMethod: "physical",
      payment: 0,
      date: new Date(),
      status: "pending",
    };

    const order = new orderModel(orderData);
    await order.save();

    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    const subject = "Order Confirmation - TimberCraft";
    const message = `
Dear ${user.name},

Thank you for placing an order with TimberCraft!

Your order details:
- Order ID: ${order._id}
- Total Amount: NRs. ${amount}
- Status: Pending (awaiting approval)
- Delivery Address: ${address.street}, ${address.city}, ${address.zipcode}
- Payment Method: Physical Payment (Pending)

We will process your order shortly. You will receive updates as your order moves through different stages.

If you have any questions, feel free to contact our support team.

Best regards,  
TimberCraft Team
    `;

    await sendEmail(user.email, subject, message);

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Email sent!",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const placeOrderOnline = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orderData = {
      orderId: uuidv4(),
      userId,
      items,
      address,
      amount,
      paymentMethod: "online",
      payment: 0,
      date: new Date(),
      status: "pending",
    };

    const order = new orderModel(orderData);
    await order.save();

    // await userModel.findByIdAndUpdate(userId, { cartData: [] });

    const subject = "Order Confirmation - TimberCraft";
    const message = `
Dear ${user.name},

Thank you for placing an order with TimberCraft!

Your order details:
- Order ID: ${order._id}
- Total Amount: NRs. ${amount}
- Status: Pending (awaiting payment confirmation)
- Delivery Address: ${address.street}, ${address.city}, ${address.zipcode}
- Payment Method: Online Payment (Pending)

We will process your order shortly. You will receive updates as your order moves through different stages.

If you have any questions, feel free to contact our support team.

Best regards,  
TimberCraft Team
    `;

    await sendEmail(user.email, subject, message);

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Email sent!",
      order,
      orderId: order._id,
      amount: order.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Fetch all orders
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("userId", "name email");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get their own orders (paginated)
export const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const resultPerPage = Number(req.query.limit) || 5;
    const currentPage = Number(req.query.page) || 1;

    const totalOrders = await orderModel.countDocuments({ userId });

    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 })
      .skip(resultPerPage * (currentPage - 1))
      .limit(resultPerPage)
      .populate("items.category")
      .populate("items.wood");

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Update order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const validStatuses = ["pending", "processing", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ⚠️ Guard: Don't allow setting to delivered if payment is pending
    if (
      status === "delivered" &&
      order.paymentStatus.toLowerCase() === "pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark as delivered. Payment is still pending.",
      });
    }

    // 🚫 No need to update if status is already same
    if (order.status === status) {
      return res.status(200).json({
        success: true,
        message: "Status is already set to the requested value.",
        order,
      });
    }

    order.status = status;
    await order.save();

    const subject = `Order Status Update: ${status}`;
    const message = `
Hello ${order.userId.name},

Your order (ID: ${order._id}) status has been updated to "${status}".

Thank you for shopping with us!
TimberCraft Team
    `;

    await sendEmail(order.userId.email, subject, message);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// cancel order
// export const cancelOrder =

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel
      .findOne({ _id: orderId })
      .populate("userId", "name email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    await order.save();

    const subject = "Order Cancelled - TimberCraft";
    const message = `
Hello ${order.userId.name},

We regret to inform you that your order (ID: ${order._id}) has been cancelled.

If this was a mistake or you have any concerns, feel free to contact our support team.

Best regards,  
TimberCraft Team
    `;

    await sendEmail(order.userId.email, subject, message);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, payment } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (payment > order.amount) {
      return res.status(400).json({
        success: false,
        message: "Payment cannot exceed order total",
      });
    }

    // Update payment and payment status
    order.payment = payment;

    if (payment === 0) {
      order.paymentStatus = "Pending";
    } else if (payment < order.amount) {
      order.paymentStatus = "Partial";
    } else if (payment === order.amount) {
      order.paymentStatus = "Paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated",
      order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
