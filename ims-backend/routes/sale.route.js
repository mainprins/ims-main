import express from 'express';
import { createSale, getSales } from '../controllers/sale.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';

const saleRouter = express.Router();
saleRouter.post('/',protect,authorize("staff", "manager", "admin"), createSale);
saleRouter.get("/", protect, authorize("admin", "manager"), getSales);


export default saleRouter;