import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

/**
 * @desc Create a shop
 * @route POST /seller/shops
 * @access Seller
 */
export const createShop = async (req, res) => {
  try {
    const { name, description } = req.body;
    const shop = await prisma.shop.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
      },
    });
    res.status(201).json({ message: "Shop created successfully", shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update a shop
 * @route PUT /seller/shops/:id
 * @access Seller
 */
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const shop = await prisma.shop.findUnique({ where: { id: parseInt(id) } });
    if (!shop || shop.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this shop" });
    }

    const updatedShop = await prisma.shop.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.json({ message: "Shop updated successfully", updatedShop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete a shop
 * @route DELETE /seller/shops/:id
 * @access Seller
 */
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await prisma.shop.findUnique({ where: { id: parseInt(id) } });
    if (!shop || shop.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this shop" });
    }
    await prisma.shop.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Add fertilizer to a shop
 * @route POST /seller/fertilizers
 * @access Seller
 */

const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const addFertilizer = async (req, res) => {
  try {
    const { shopId, name, mrp, sellingPrice, stock, features, description } =
      req.body;

    if (!shopId || !name || !mrp || !sellingPrice || !stock) {
      return res.status(400).json({
        message: "Required fields: shopId, name, mrp, sellingPrice, stock",
      });
    }

    let imageUrl = null;
    let subImages = [];

    if (req.file) {
      const uploadRes = await streamUpload(req.file.buffer, "fertilizers");
      imageUrl = uploadRes.secure_url;
    }

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadRes = await streamUpload(file.buffer, "fertilizers");
        subImages.push(uploadRes.secure_url);
      }
    }

    const fertilizer = await prisma.fertilizer.create({
      data: {
        shopId: Number(shopId),
        name,
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        stock: Number(stock),
        features,
        description,
        subImages,
      },
    });

    res.json({
      message: "Fertilizer added successfully",
      fertilizer,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Failed to add fertilizer", error });
  }
};

/**
 * @desc    Get all fertilizers added by the logged-in seller
 * @route   GET /seller/fertilizers
 * @access  Seller
 */
export const getMyFertilizers = async (req, res) => {
  try {
    const fertilizers = await prisma.fertilizer.findMany({
      where: {
        shop: { ownerId: req.user.id }, // only seller's fertilizers
      },
      include: {
        shop: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(fertilizers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update a fertilizer
 * @route PUT /seller/fertilizers/:id
 * @access Seller
 */
export const updateFertilizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const fertilizer = await prisma.fertilizer.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true },
    });

    if (!fertilizer || fertilizer.shop.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this fertilizer" });
    }

    const updatedFertilizer = await prisma.fertilizer.update({
      where: { id: parseInt(id) },
      data: { name, price, stock },
    });

    res.json({ message: "Fertilizer updated successfully", updatedFertilizer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete a fertilizer
 * @route DELETE /seller/fertilizers/:id
 * @access Seller
 */
export const deleteFertilizer = async (req, res) => {
  try {
    const { id } = req.params;

    const fertilizer = await prisma.fertilizer.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true },
    });

    if (!fertilizer || fertilizer.shop.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this fertilizer" });
    }

    await prisma.fertilizer.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Fertilizer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
