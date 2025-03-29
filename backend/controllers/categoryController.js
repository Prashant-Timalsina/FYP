import categoryModel from "../models/categoryModel.js";
import Category from "../models/categoryModel.js";
import cloudinary from "cloudinary";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const dupCategory = await Category.findOne({ name });
    if (dupCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const image = req.files.image && req.files.image[0];

    let imageURL = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

    // Prepare the category data
    const categorylist = {
      name,
      description,
      price,
      image: imageURL,
      date: Date.now(),
    };

    const category = new categoryModel(categorylist);
    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: error.message,
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load categories",
      error: error.message,
    });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category",
      error: error.message,
    });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    console.log(price);

    const image = req.files.image && req.files.image[0];
    let imageURL = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, price, image: imageURL },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
