import mongoose from "mongoose";
import Customer from "../models/Customer.js";
export async function getCustomers(req, res) {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        const customers = await Customer.find({
            owner: req.userId,
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
        res.status(200).json({
            success: true,
            customers,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Unable to load customers",
        });
    }
}
export async function createCustomer(req, res) {
    try {
        if (!req.userId ||
            !mongoose.isValidObjectId(req.userId)) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        const { name, email, phone, company, status, notes, } = req.body ?? {};
        if (typeof name !== "string" ||
            !name.trim() ||
            name.trim().length > 100) {
            res.status(400).json({
                success: false,
                message: "A valid customer name is required",
            });
            return;
        }
        const optionalStrings = {
            email,
            phone,
            company,
            notes,
        };
        for (const [field, value] of Object.entries(optionalStrings)) {
            if (value !== undefined && typeof value !== "string") {
                res.status(400).json({
                    success: false,
                    message: `Invalid ${field}`,
                });
                return;
            }
        }
        const allowedStatuses = ["lead", "active", "inactive"];
        if (status !== undefined &&
            !allowedStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: "Invalid customer status",
            });
            return;
        }
        const customer = await Customer.create({
            owner: req.userId,
            name: name.trim(),
            email,
            phone,
            company,
            status: status ?? "lead",
            notes,
        });
        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer,
        });
    }
    catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({
                success: false,
                message: "Invalid customer information",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Unable to create customer",
        });
    }
}
