
import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { protect, type AuthRequest } from "../middleware/authMiddleware.js";
import type { Response } from "express";
import User from "../models/User.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Only authenticated users can access this endpoint
router.get("/me", protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId)
      .select("name email role createdAt");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to fetch user profile",
    });
  }
});

export default router;
