import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // return exclude the password

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

import mongoose from "mongoose";

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Please enter a valid User ID" });
        }

        const user = await User.find().select("-password"); // return exclude the password

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.json({ data: user, message: "User Retrieved" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

export default router;
