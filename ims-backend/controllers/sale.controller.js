import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";
import InventoryLog from "../models/inventoryLog.model.js";

export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerName, items, totalAmount } = req.body;

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product || product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name}`);
      }
    }

    // Create sale
    const sale = await Sale.create(
      [
        {
          customerName,
          items,
          totalAmount,
          createdBy: req.user?._id,
        },
      ],
      { session }
    );

    // Update stock + logs
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { session }
      );

      await InventoryLog.create(
        [
          {
            product: item.product,
            type: "OUT",
            quantity: item.quantity,
            referenceModel: "Sale",
            referenceId: sale[0]._id,
            performedBy: req.user?._id,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Sale completed successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
};

// ✅ New function to fetch all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
