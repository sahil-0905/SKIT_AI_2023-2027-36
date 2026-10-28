
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/ProblemRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/interviews", interviewRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
