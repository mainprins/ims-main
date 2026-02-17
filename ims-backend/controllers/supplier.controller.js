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

// Update a supplier (admin only)
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a supplier (admin only)
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
