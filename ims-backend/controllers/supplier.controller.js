import Supplier from "../models/supplier.model.js";

// Create a supplier (admin only)
export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Optional: check if supplier with same name already exists
    const existing = await Supplier.findOne({ name });
    if (existing) return res.status(400).json({ message: "Supplier already exists" });

    const supplier = await Supplier.create({ name, email, phone, address });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ isActive: true });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
