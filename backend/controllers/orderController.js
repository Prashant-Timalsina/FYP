import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/emailService.js";
import ApiFeature from "../utils/ApiFeature.js";

import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import qs from "querystring";

export const createOrder = async (req, res) => {};

// export const placeOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       amount,
//       address,
//       // paymentType,
//       // paidAmount
//     } = req.body;

//     const userId = req.user.id;

//     const user = await userModel.findById(userId);
//     // console.log(user);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const orderData = {
//       orderId: uuidv4(),
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "physical",
//       payment: 0,
//       date: new Date(),
//       // paidAmount,
//       // paymentStatus: paymentType === "online" ? "full" : "partial",
//       // status: "pending",
//     };

//     const order = new orderModel(orderData);
//     await order.save();

//     await userModel.findByIdAndUpdate(userId, { cartData: [] });

//     // Prepare email content
//     const subject = "Order Confirmation - TimberCraft";
//     const message = `
//       Dear ${user.name},

//       Thank you for placing an order with TimberCraft!

//       Your order details:
//       - **Order ID:** ${order._id}
//       - **Total Amount:** NRs.${amount}
//       - **Status:** Pending (awaiting approval)
//       - **Delivery Address:** ${address.street}, ${address.city}, ${address.zipcode}
//       - **Payment Method:** {Physical Payment pending}

//       We will process your order shortly. You will receive updates as your order moves through different stages.

//       If you have any questions, feel free to contact our support team.

//       Best regards,
//       **TimberCraft Team**
//     `;

//     // Send email
//     await sendEmail(user.email, subject, message);

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully. Email sent!",
//       order,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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

// export const placeOrderOnline = async (req, res) => {
//   try {
//     const {
//       items,
//       amount,
//       address,
//       // paymentType,
//       // paidAmount
//     } = req.body;

//     const userId = req.user.id;

//     const user = await userModel.findById(userId);
//     // console.log(user);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const orderData = {
//       orderId: uuidv4(),
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "online",
//       payment: 0,
//       date: new Date(),
//       // paidAmount,
//       // paymentStatus: paymentType === "online" ? "full" : "partial",
//       // status: "pending",
//     };

//     const order = new orderModel(orderData);
//     await order.save();

//     // await userModel.findByIdAndUpdate(userId, { cartData: [] });

//     // Prepare email content
//     const subject = "Order Confirmation - TimberCraft";
//     const message = `
//       Dear ${user.name},

//       Thank you for placing an order with TimberCraft!

//       Your order details:
//       - **Order ID:** ${order._id}
//       - **Total Amount:** NRs.${amount}
//       - **Status:** Pending (awaiting approval)
//       - **Delivery Address:** ${address.street}, ${address.city}, ${address.zipcode}
//       - **Payment Method:** {Payment pending}

//       We will process your order shortly. You will receive updates as your order moves through different stages.

//       If you have any questions, feel free to contact our support team.

//       Best regards,
//       **TimberCraft Team**
//     `;

//     // Send email
//     await sendEmail(user.email, subject, message);

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully. Email sent!",
//       order,
//       orderId: order.orderId,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Admin: Fetch all orders

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

// // A single user can see his order list
// export const userOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     let query = orderModel
//       .find({ userId })
//       .populate("items.category")
//       .populate("items.wood");

//     const apiFeature = new ApiFeature(query, req.query).pagination(6);
//     const orders = await apiFeature.query;

//     // // Fetch orders for the user
//     // const orders = await orderModel
//     //   .find({ userId }) // Use find() instead of findById()
//     //   .populate("items.category") // Correct path
//     //   .populate("items.wood");

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const userOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const resultPerPage = Number(req.query.limit) || 5; // Default to 5 if not provided
//     const currentPage = Number(req.query.page) || 1;

//     // Calculate the total number of orders for the user
//     const totalOrders = await orderModel.countDocuments({ userId });

//     // Fetch orders for the current page
//     const orders = await orderModel
//       .find({ userId })
//       .sort({ date: -1 }) // Sort by date in descending order
//       .skip(resultPerPage * (currentPage - 1))
//       .limit(resultPerPage)
//       .populate("items.category")
//       .populate("items.wood");

//     res.status(200).json({
//       success: true,
//       orders,
//       totalOrders, // Send total number of orders
//     });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//Admin can change the state of order from pending to processing to delivered
// export const updateStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params; // Get the orderId from the URL params
//     const { status } = req.body; // Get the status from the body

//     // Validate if status is a valid string
//     const validStatuses = ["pending", "processing", "delivered"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value",
//       });
//     }

//     // Find and update the order based on orderId (not _id)
//     const order = await orderModel
//       .findOneAndUpdate({ orderId }, { status }, { new: true })
//       .populate("userId", "name email");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Save the order with the new status
//     order.status = status;
//     await order.save();

//     // Send email to the user with the updated status
//     const subject = `Order Status Update: ${status}`;
//     const message = `Hello ${order.userId.name},\n\nYour order (ID: ${order.orderId}) status has been updated to "${status}".\n\nThank you for shopping with us!\nTimberCraft Team`;

//     await sendEmail(order.userId.email, subject, message);

//     res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Admin: Update order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await orderModel
      .findOneAndUpdate({ orderId }, { status }, { new: true })
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const subject = `Order Status Update: ${status}`;
    const message = `
Hello ${order.userId.name},

Your order (ID: ${order.orderId}) status has been updated to "${status}".

Thank you for shopping with us!
TimberCraft Team
    `;

    await sendEmail(order.userId.email, subject, message);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
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
    const { orderId } = req.params;

    const order = await orderModel.findOne({ orderId });

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

    await sendEmail(
      order.userId.email,
      "Order Cancelled",
      `Your order (ID: ${order.orderId}) has been cancelled.`
    );

    res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
