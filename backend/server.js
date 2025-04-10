import express from "express";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import userRouter from "./routes/userRoutes.js";
import woodRouter from "./routes/woodRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import sendEmail from "./middlewares/NodeMailer.js";
import orderRouter from "./routes/orderRoutes.js";
import favRouter from "./routes/favoriteRoutes.js";
import bodyParser from "body-parser";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Initialize database and Cloudinary connections
dbConnect();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173", // allow Vite frontend
    credentials: true,
  })
);

//Routes
app.post("/send-email", sendEmail);

// API endpoints
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/wood", woodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/fav", favRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log("Server Started on port: " + port));
