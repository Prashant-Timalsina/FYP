import express from "express";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import productRouter from "./routes/productRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

dbConnect();

app.use(express.json());
app.use(cors());

//API endpoints
app.use("/api/product", productRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log("Server Started on port: " + port));
