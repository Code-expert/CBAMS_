import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc Get all shops
 * @route GET /marketplace/shops
 * @access Public
 */
export const getAllShops = async (req, res) => {
    try {
        const shops = await prisma.shop.findMany({
            include: {
                owner: { select: { id: true, name: true, email: true } }
            }
        });
        res.json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Get fertilizers by shop
 * @route GET /marketplace/shops/:id/fertilizers
 * @access Public
 */
export const getFertilizersByShop = async (req, res) => {
    try {
        const { id } = req.params;
        const fertilizers = await prisma.fertilizer.findMany({
            where: { shopId: parseInt(id) }
        });
        res.json(fertilizers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Place an order for a fertilizer
 * @route POST /marketplace/orders
 * @access Farmer (or any logged-in user)
 */
export const placeOrder = async (req, res) => {
    try {
        const { fertilizerId, quantity } = req.body;

        const fertilizer = await prisma.fertilizer.findUnique({
            where: { id: fertilizerId }
        });

        if (!fertilizer) {
            return res.status(404).json({ message: "Fertilizer not found" });
        }

        if (quantity > fertilizer.stock) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        const totalPrice = fertilizer.price * quantity;

        const order = await prisma.order.create({
            data: {
                fertilizerId,
                quantity,
                totalPrice,
                buyerId: req.user.id
            }
        });

        // Reduce stock
        await prisma.fertilizer.update({
            where: { id: fertilizerId },
            data: { stock: fertilizer.stock - quantity }
        });

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Get my orders
 * @route GET /marketplace/orders
 * @access Logged-in user
 */
export const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { buyerId: req.user.id },
            include: {
                fertilizer: {
                    select: { id: true, name: true, price: true }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};