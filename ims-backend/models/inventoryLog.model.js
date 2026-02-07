import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    quantity: { type: Number, required: true },

    referenceModel: {
      type: String,
      enum: ["Purchase", "Sale"],
      required: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryLog", inventoryLogSchema);
