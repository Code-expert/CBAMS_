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
import taskRoutes from "./routes/tasks.js";
// import { initTaskReminders } from "./services/taskCron.js";
import analyticsRoutes from './routes/cropAnalyticsRoutes.js';
import farmMetricsRoutes from './routes/farmMetrics.js';
import cropRecommendationRoutes from './routes/cropRecommendationRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000','https://cbams-o3j3.vercel.app','https://cbams.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

initSchedules();
// initTaskReminders();

app.get("/", (req, res) => {
  res.send("Welcome to the Agri Backend API");
});

// Your existing routes
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
app.use('/tasks', taskRoutes); 
app.use('/api/crop-recommendation', cropRecommendationRoutes);
app.use('/api/crops', analyticsRoutes); 
app.use('/api/farm-metrics', farmMetricsRoutes); 
export default app;
