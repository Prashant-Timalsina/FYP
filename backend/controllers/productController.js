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

    let imagesURL = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

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
    res.status(200).json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error("Error adding product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to add furniture",
      error: error.message,
    });
  }
  res.status({
    success: true,
    message: "Product Added",
  });
};

const removeProduct = async (req, res) => {
  res.status({
    success: true,
    message: "Product deleted",
  });
};

const singleProduct = async (req, res) => {
  res.status({
    success: true,
    message: "1 product",
  });
};

const listProduct = async (req, res) => {
  res.status({
    success: true,
    message: "All products",
  });
};

export { addProduct, listProduct, removeProduct, singleProduct };
