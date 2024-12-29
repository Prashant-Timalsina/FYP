import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
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

const aProduct = async (req, res) => {
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

export { addProduct, listProduct, removeProduct, aProduct };
