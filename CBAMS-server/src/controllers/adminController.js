import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc    Get all users
 * @route   GET /admin/users
 * @access  Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Update a user's role
 * @route   PUT /admin/update-role/:userId
 * @access  Admin
 */
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["FARMER", "EXPERT", "ADMIN"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role }
        });

        res.json({ message: "User role updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

