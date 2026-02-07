import Product from "../models/product.model.js";
import InventoryLog from "../models/inventoryLog.model.js";
import Purchase from "../models/purchase.model.js";
import Sale from "../models/sale.model.js";

// 1️⃣ Low-stock products
export const getLowStockReport = async (req, res) => {
  try {
    const lowStock = await Product.find({
      $expr: { $lte: ["$quantity", "$minStockLevel"] }
    });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 2️⃣ Product stock movement history
export const getProductHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const logs = await InventoryLog.find({ product: productId })
      .populate("performedBy", "name email")
      .populate("product", "name sku")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Purchase report
export const getPurchaseReport = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name email phone")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Sales report (similar)
export const getSalesReport = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name email phone")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
