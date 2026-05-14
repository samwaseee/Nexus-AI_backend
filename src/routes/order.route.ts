import { Router } from "express";
import { getMyOrders } from "../controllers/user.controller"; 
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

// 2. Fetch the private orders
router.get("/", getMyOrders);

export default router;