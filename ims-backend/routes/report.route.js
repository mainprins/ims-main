import express from "express";
import { getLowStockReport, getProductHistory, getPurchaseReport, getSalesReport } from "../controllers/report.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";


const reportRouter = express.Router();

// Only admin can access reports
reportRouter.use(protect, authorize("admin"));

// Low-stock report
reportRouter.get("/low-stock", getLowStockReport);

// Stock movement history for a product
reportRouter.get("/product/:productId", getProductHistory);

// Purchase report
reportRouter.get("/purchases", getPurchaseReport);

// Sales report
reportRouter.get("/sales", getSalesReport);
export default reportRouter;