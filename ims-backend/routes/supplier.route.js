import express from "express";
import { createSupplier, getSuppliers } from "../controllers/supplier.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const supplierRouter = express.Router();

// Admin can create supplier
supplierRouter.post("/", protect, authorize("admin"), createSupplier);

// Any logged-in user can view suppliers
supplierRouter.get("/", protect, getSuppliers);

export default supplierRouter;
