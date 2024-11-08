// backend/server.js
import express from 'express'
import  dotenv from "dotenv";
import  bodyParser from "body-parser";
import  authRoutes from "./routes/authRoutes.js";
import cors from "cors";


const app = express();
// Use CORS middleware with specific origin
app.use(cors({
    origin: "http://localhost:5173", // Allow your frontend's origin
    methods: ["GET", "POST"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies or other credentials if necessary
  }));
  
  
dotenv.config();

// Your other middlewares and routes
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
