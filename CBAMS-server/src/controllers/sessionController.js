import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
const prisma = new PrismaClient();

// Farmer books session
export const bookSession = async (req, res) => {
  try {
    const { expertId, date } = req.body;

    if (req.user.role !== "FARMER") {
      return res.status(403).json({ message: "Only farmers can book sessions" });
    }

    const session = await prisma.session.create({
      data: {
        farmerId: req.user.id,
        expertId,
        date: new Date(date),
      },
    });

    res.status(201).json({ message: "Session requested", session });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Expert confirms session
export const confirmSession = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "EXPERT") {
      return res.status(403).json({ message: "Only experts can confirm sessions" });
    }

    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: {
        status: "CONFIRMED",
        videoLink: `https://videocall.example.com/${uuid()}`
      }
    });

    res.json({ message: "Session confirmed", session });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all sessions for a farmer
export const getFarmerSessions = async (req, res) => {
  try {
    if (req.user.role !== "FARMER") {
      return res.status(403).json({ message: "Only farmers can access this" });
    }

    const sessions = await prisma.session.findMany({
      where: { farmerId: req.user.id },
      include: { expert: true },
      orderBy: { date: "desc" }
    });

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all sessions for an expert
export const getExpertSessions = async (req, res) => {
  try {
    if (req.user.role !== "EXPERT") {
      return res.status(403).json({ message: "Only experts can access this" });
    }

    const sessions = await prisma.session.findMany({
      where: { expertId: req.user.id },
      include: { farmer: true },
      orderBy: { date: "desc" }
    });

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
