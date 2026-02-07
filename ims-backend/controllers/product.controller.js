import Product from "../models/product.model.js";

// Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, price, quantity, minStockLevel } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) return res.status(400).json({ message: "SKU already exists" });

    const product = await Product.create({
      name,
      sku,
      category,
      price,
      quantity,
      minStockLevel,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
