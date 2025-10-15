import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["FARMER", "SELLER","EXPERT"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with default FARMER role
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role },
    });

    // Create empty profile automatically
    await prisma.profile.create({
      data: { userId: user.id },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken({ id: user.id, role: user.role });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
