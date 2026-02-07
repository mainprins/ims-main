import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/database.js";
import purchaseRouter from "./routes/purchase.route.js";
import saleRouter from "./routes/sale.route.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import supplierRouter from "./routes/supplier.route.js";
import reportRouter from "./routes/report.route.js";

dotenv.config();

// Connect DB FIRST
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Inventory API running");
});

// Routes
app.use("/api/purchases", purchaseRouter);
app.use("/api/sales", saleRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/reports", reportRouter);

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
