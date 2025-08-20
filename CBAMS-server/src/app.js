import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import expertRoutes from "./routes/expert.js";
import sellerRoutes from "./routes/seller.js";
import marketplaceRoutes from "./routes/marketplace.js";
import orderRoutes from "./routes/order.js";
import adminOrderRoutes from "./routes/adminOrders.js";
import scheduleRoutes from "./routes/schedule.js";
import sessionRoutes from "./routes/session.js";
import { initSchedules } from "./services/scheduleCron.js";

dotenv.config();
const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

initSchedules();

app.get("/", (req, res) => {
  res.send("Welcome to the Agri Backend API");
});
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/expert", expertRoutes);
app.use("/seller", sellerRoutes);
app.use("/marketplace", marketplaceRoutes);
app.use("/orders", orderRoutes);
app.use("/admin/orders", adminOrderRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/session", sessionRoutes);


export default app;
