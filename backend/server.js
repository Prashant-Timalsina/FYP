import express from "express";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import userController from "./controllers/userController.js";

const app = express();
const port = process.env.PORT || 4000;

// Initialize database and Cloudinary connections
dbConnect();
connectCloudinary();

app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log("Server Started on port: " + port));
