import express from "express";
import { createSupplier, getSuppliers, updateSupplier, deleteSupplier } from "../controllers/supplier.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const supplierRouter = express.Router();

// Admin can create supplier
supplierRouter.post("/", protect, authorize("admin"), createSupplier);

// Any logged-in user can view suppliers
supplierRouter.get("/", protect, getSuppliers);

// Admin can update supplier
supplierRouter.put("/:id", protect, authorize("admin"), updateSupplier);

// Admin can delete supplier
supplierRouter.delete("/:id", protect, authorize("admin"), deleteSupplier);

export default supplierRouter;
