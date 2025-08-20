import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc Update order status (admin)
 * @route PUT /admin/orders/:id/status
 * @access Admin
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["PENDING", "ACCEPTED", "SHIPPED", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Get all orders (admin)
 * @route GET /admin/orders
 * @access Admin
 */
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                buyer: { select: { id: true, name: true, email: true } },
                fertilizer: {
                    select: { id: true, name: true, price: true, shop: { select: { name: true } } }
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
