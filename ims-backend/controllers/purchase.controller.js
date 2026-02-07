import mongoose from "mongoose";
import Purchase from "../models/purchase.model.js";
import Product from "../models/product.model.js";
import InventoryLog from "../models/inventoryLog.model.js";

export const createPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplier, items, totalAmount } = req.body;

    // 1. Create purchase
    const purchase = await Purchase.create(
      [
        {
          supplier,
          items,
          totalAmount,
          createdBy: req.user?._id,
        },
      ],
      { session }
    );

    // 2. Update stock + logs
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } },
        { session }
      );

      await InventoryLog.create(
        [
          {
            product: item.product,
            type: "IN",
            quantity: item.quantity,
            referenceModel: "Purchase",
            referenceId: purchase[0]._id,
            performedBy: req.user?._id,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Purchase recorded successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};


export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('supplier', 'name email phone')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};