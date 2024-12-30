import express from "express";
import upload from "../middlewares/multer.js";

import {
  addProduct,
  singleProduct,
  listProduct,
  removeProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Add a product (POST request for creating a resource)
productRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Get a single product by ID (GET request for reading a resource)
productRouter.get("/single/:id", singleProduct);

// List all products (GET request for reading multiple resources)
productRouter.get("/list", listProduct);

// Remove a product (DELETE request for deleting a resource)
productRouter.delete("/remove/:id", removeProduct);

export default productRouter;
