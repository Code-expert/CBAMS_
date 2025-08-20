import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc Cancel an order (user)
 * @route PUT /orders/:id/cancel
 * @access User (can only cancel if PENDING)
 */
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { buyer: true }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ensure this is the user's own order
        if (order.buyerId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        // Check if order is still PENDING
        if (order.status !== "PENDING") {
            return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
        }

        const cancelledOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status: "CANCELLED" }
        });

        res.json({ message: "Order cancelled successfully", order: cancelledOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Get all orders for the logged-in farmer
 * @route GET /orders
 * @access Farmer
 */
export const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { buyerId: req.user.id },
            include: {
                fertilizer: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        shop: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
