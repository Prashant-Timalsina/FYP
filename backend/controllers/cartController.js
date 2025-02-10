import userModel from "../models/userModel.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }

    const { itemId, length, breadth, height } = req.body;
    const userID = req.user.id || req.user._id;

    if (!itemId || !length || !breadth || !height) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure cartData is an array
    if (!Array.isArray(user.cartData)) {
      user.cartData = []; // Reset to an empty array if it's not an array
    }

    // Find if the item exists in the cart
    const existingItem = user.cartData.find(
      (item) =>
        item.itemId === itemId &&
        item.length === length &&
        item.breadth === breadth &&
        item.height === height
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if item exists
    } else {
      user.cartData.push({ itemId, length, breadth, height, quantity: 1 }); // Add as new item
    }

    await user.save();
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE CART
export const updateCart = async (req, res) => {
  try {
    const { itemId, length, breadth, height, quantity } = req.body;
    const userId = req.user.id;

    if (!itemId || !length || !breadth || !height || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const itemIndex = user.cartData.findIndex(
      (item) =>
        item.itemId === itemId &&
        item.length === length &&
        item.breadth === breadth &&
        item.height === height
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity === 0) {
      user.cartData.splice(itemIndex, 1); // ✅ Remove item if quantity is 0
    } else {
      user.cartData[itemIndex].quantity = quantity; // ✅ Update quantity
    }

    await user.save();
    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cartData: user.cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export default {
//   // addToCart,
//   updateCart,
//   getCart,
// };
