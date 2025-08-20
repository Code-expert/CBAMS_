import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc    Get all experts
 * @route   GET /admin/experts
 * @access  Admin
 */
export const getExperts = async (req, res) => {
    try {
        const experts = await prisma.user.findMany({
            where: { role: "EXPERT" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile: true,
                createdAt: true
            }
        });
        res.json(experts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Promote a user to expert
 * @route   POST /admin/experts
 * @access  Admin
 */
export const addExpert = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role: "EXPERT" }
        });

        res.json({ message: "User promoted to Expert", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Update expert details
 * @route   PUT /admin/experts/:id
 * @access  Admin
 */
export const updateExpert = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const expert = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email }
        });

        res.json({ message: "Expert updated successfully", expert });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Remove expert (demote to FARMER)
 * @route   DELETE /admin/experts/:id
 * @access  Admin
 */
export const removeExpert = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role: "FARMER" }
        });

        res.json({ message: "Expert removed (demoted to Farmer)", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
