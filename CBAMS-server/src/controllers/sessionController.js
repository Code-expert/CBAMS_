import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

// ✅ Generate 6-digit session code
function generateSessionCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const bookSession = async (req, res) => {
  try {
    const { expertId, date, time, mode, description } = req.body;

    // ✅ Validate required fields
    if (!expertId || !date) {
      return res.status(400).json({ message: "Expert ID and date are required" });
    }

    // Ensure only FARMER can book
    if (req.user.role !== "FARMER") {
      return res.status(403).json({ message: "Only farmers can book sessions" });
    }

    // Validate expert existence
    const expert = await prisma.user.findUnique({ 
      where: { id: Number(expertId) } 
    });
    
    if (!expert || expert.role !== "EXPERT") {
      return res.status(400).json({ message: "Invalid expert ID" });
    }

    // ✅ Generate 6-digit session code
    const sessionCode = generateSessionCode();

    // ✅ Create session with all fields
    const session = await prisma.session.create({
      data: {
        farmerId: req.user.id,
        expertId: Number(expertId),
        date: new Date(date),
        time: time || null,
        mode: mode || "VIDEO",
        description: description || null,
        videoRoomId: sessionCode, // Store 6-digit code
        status: "PENDING"
      },
      include: {
        expert: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true
          }
        }
      }
    });

    res.status(201).json({ 
      message: "Session requested successfully", 
      session 
    });
  } catch (err) {
    console.error("Error booking session:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
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

    // ✅ Keep existing videoRoomId, don't regenerate
    const updatedSession = await prisma.session.update({
      where: { id: Number(id) },
      data: {
        status: "CONFIRMED",
        // videoRoomId is already set during booking, don't overwrite
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true
          }
        }
      }
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
        expert: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            profile: true 
          } 
        },
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
    const expertId = req.user.id;
    const sessions = await prisma.session.findMany({
      where: { expertId },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true
          }
        },
      },
      orderBy: {
        date: 'desc'
      }
    });

    // ✅ Return array directly
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching expert sessions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const session = await prisma.session.findUnique({
      where: { id: Number(id) }
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is either the expert or farmer
    if (session.expertId !== userId && session.farmerId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSession = await prisma.session.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json({
      message: `Session ${status.toLowerCase()} successfully`,
      session: updatedSession
    });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
