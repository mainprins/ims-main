import express from 'express';
import { createPurchase, getPurchases } from '../controllers/purchase.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';

const purchaseRouter = express.Router();
purchaseRouter.post('/',protect,authorize("admin","manager"),createPurchase);
purchaseRouter.get('/', protect, authorize("admin","manager"), getPurchases);

export default purchaseRouter;