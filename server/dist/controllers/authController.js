import jwt from "jsonwebtoken";
import User from "../models/User.js";
function createToken(userId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ userId }, secret, {
        expiresIn: "1d",
    });
}
// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            password.length < 8) {
            res.status(400).json({
                success: false,
                message: "Valid name, email and password (minimum 8 characters) are required",
            });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email already registered",
            });
            return;
        }
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "user",
        });
        const token = createToken(String(user._id));
        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error instanceof Error ? error.name : "Unknown error");
        res.status(500).json({
            success: false,
            message: "Unable to register",
        });
    }
};
// Login existing user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const token = createToken(String(user._id));
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error instanceof Error ? error.name : "Unknown error");
        res.status(500).json({
            success: false,
            message: "Unable to log in",
        });
    }
};
