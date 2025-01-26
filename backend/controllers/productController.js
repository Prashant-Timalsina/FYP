import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      woodName,
      length,
      breadth,
      height,
    } = req.body;

    // Ensure req.files exists and handle the images
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Create an array of images and filter out any undefined entries
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesURL = [];
    if (images.length > 0) {
      imagesURL = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    //Prepare the product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      woodName,
      image: imagesURL,
      length,
      breadth,
      height,
      date: Date.now(),
    };

    console.log(productData);

    //Create a new product instance and save it
    const product = new productModel(productData);
    await product.save();

    //Send a response indicating success
    res.status(201).json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error("Error adding product: ", error);

    res.status(500).json({
      success: false,
      message: "Failed to add furniture",
      error: error.message,
    });
  }
};

// Remove a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Get a single product by ID
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// List all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find().populate("category", "name");
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load products",
      error: error.message,
    });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      woodName,
      length,
      breadth,
      height,
    } = req.body;

    // Ensure req.files exists and handle the images
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Create an array of images and filter out any undefined entries
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesURL = [];
    if (images.length > 0) {
      imagesURL = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    // Prepare the updated product data
    const updatedProductData = {
      name,
      description,
      category,
      woodName,
      image: imagesURL.length > 0 ? imagesURL : undefined,
      length,
      breadth,
      height,
    };

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid price value",
        });
      }
      updatedProductData.price = numericPrice;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedProductData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct };
