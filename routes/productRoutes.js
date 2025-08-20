import express from "express";
import Product from "../models/product.js";
import mongoose from "mongoose";

const router = express.Router();

// Create a new product
router.post("/", async (req, res) => {
    try {
        const { userId, name, description, price, category, imageUrl, stock, isAvailable } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            imageUrl,
            stock,
            isAvailable,
            createdBy: userId
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
});

// Edit / Update a product
router.put("/:id", async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updateProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updateProduct);

    } catch (error) {
        res.status(400).json({ message: "Error updating product", error: error.message });
    }
});

// View All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("createdBy", "name email");
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: "Error fetching products", error: error.message });
    }
});

// View All Products Created By Others (no userId needed)
router.get("/others", async (req, res) => {
    try {
        const products = await Product.find().populate("createdBy", "name email");

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found from other users" });
        }

        res.json(products);

    } catch (error) {
        res.status(400).json({ message: "Error fetching products", error: error.message });
    }
});

// View Only Products Created By Me
router.get("/my-products/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const products = await Product.find({ createdBy: userId }).populate("createdBy", "name email");

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this user" });
        }

        res.json(products);

    } catch (error) {
        res.status(400).json({ message: "Error fetching your products", error: error.message });
    }
});

// View Only Products Created By Others (exclude one user)
router.get("/others/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Please enter a valid User ID" });
        }

        const products = await Product.find({ createdBy: { $ne: userId } }).populate("createdBy", "name email");

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found from other users" });
        }

        res.json(products);

    } catch (error) {
        res.status(400).json({ message: "Error fetching products", error: error.message });
    }
});

// View Single Product (keep this **last** so it doesn’t catch `/others`)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "name email");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(400).json({ message: "Error fetching product", error: error.message });
    }
});

export default router;
