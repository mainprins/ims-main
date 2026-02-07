import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String },

    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },

    minStockLevel: { type: Number, default: 5 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
