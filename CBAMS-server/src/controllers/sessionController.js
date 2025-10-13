import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
const prisma = new PrismaClient();

export const bookSession = async (req, res) => {
  try {
    const { expertId, date } = req.body;

    // Ensure only FARMER can book
    if (req.user.role !== "FARMER") {
      return res.status(403).json({ message: "Only farmers can book sessions" });
    }

    // Validate expert existence
    const expert = await prisma.user.findUnique({ where: { id: expertId } });
    if (!expert || expert.role !== "EXPERT") {
      return res.status(400).json({ message: "Invalid expert ID" });
    }

    // Prevent duplicate pending sessions for the same date
    const existingSession = await prisma.session.findFirst({
      where: {
        farmerId: req.user.id,
        expertId,
        date: new Date(date),
        status: "PENDING",
      },
    });

    if (existingSession) {
      return res.status(400).json({ message: "Session already requested for this date" });
    }

    const session = await prisma.session.create({
      data: {
        farmerId: req.user.id,
        expertId,
        date: new Date(date),
      },
    });

    res.status(201).json({ message: "Session requested successfully", session });
  } catch (err) {
    console.error("Error booking session:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const confirmSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only EXPERT can confirm
    if (req.user.role !== "EXPERT") {
      return res.status(403).json({ message: "Only experts can confirm sessions" });
    }

    // Fetch session
    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Ensure the expert is confirming *their own* session
    if (session.expertId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to confirm this session" });
    }

    // Generate unique room ID
    const roomId = uuid();

    const updatedSession = await prisma.session.update({
      where: { id: Number(id) },
      data: {
        status: "CONFIRMED",
        videoRoomId: roomId, // save only room ID
      },
    });

    res.json({
      message: "Session confirmed successfully",
      session: updatedSession,
    });
  } catch (err) {
    console.error("Error confirming session:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📅 Farmer views all their sessions
export const getFarmerSessions = async (req, res) => {
  try {
    if (req.user.role !== "FARMER") {
      return res.status(403).json({ message: "Only farmers can access this" });
    }

    const sessions = await prisma.session.findMany({
      where: { farmerId: req.user.id },
      include: {
        expert: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });

    res.json({ sessions });
  } catch (err) {
    console.error("Error fetching farmer sessions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📅 Expert views all their sessions
export const getExpertSessions = async (req, res) => {
  try {
    if (req.user.role !== "EXPERT") {
      return res.status(403).json({ message: "Only experts can access this" });
    }

    const sessions = await prisma.session.findMany({
      where: { expertId: req.user.id },
      include: {
        farmer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });

    res.json({ sessions });
  } catch (err) {
    console.error("Error fetching expert sessions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};