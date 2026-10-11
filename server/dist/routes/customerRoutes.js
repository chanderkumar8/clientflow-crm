import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCustomers, createCustomer, } from "../controllers/customerController.js";
const router = Router();
// All customer routes require authentication
router.use(protect);
router.get("/", getCustomers);
router.post("/", createCustomer);
export default router;
