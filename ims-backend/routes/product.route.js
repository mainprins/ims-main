import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { createProduct, getProducts } from "../controllers/product.controller.js";

const productRouter = express.Router();

// Admin only: create product
productRouter.post("/", protect, authorize("admin"), createProduct);

// Any logged-in user can view products
productRouter.get("/", protect, getProducts);

export default productRouter;