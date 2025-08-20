import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { sellerOnly } from "../middlewares/sellerMiddleware.js";
import upload from "../middlewares/upload.js";
import {
    createShop,
    updateShop,
    deleteShop,
    addFertilizer,
    updateFertilizer,
    deleteFertilizer,
    getMyFertilizers
} from "../controllers/sellerController.js";

const router = express.Router();

// Shop management
router.post("/shops", protect, sellerOnly, createShop);
router.put("/shops/:id", protect, sellerOnly, updateShop);
router.delete("/shops/:id", protect, sellerOnly, deleteShop);

// Fertilizer management
router.get("/fertilizers", protect, sellerOnly, getMyFertilizers);
router.post("/fertilizers", protect, sellerOnly, upload.array("subImages",5), addFertilizer);
router.put("/fertilizers/:id", protect, sellerOnly, updateFertilizer);
router.delete("/fertilizers/:id", protect, sellerOnly, deleteFertilizer);

export default router;
