import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    address: String,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
