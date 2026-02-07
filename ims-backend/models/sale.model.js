import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    customerName: { type: String },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
