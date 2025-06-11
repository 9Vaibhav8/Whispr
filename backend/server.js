import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import { GoogleGenerativeAI } from "@google/generative-ai"
import router from './routes/upload.js';
import cors from 'cors';
import diaryRoutes from './routes/diaryRoutes.js';
import connectDB from './config/db.js';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

const allowedOrigins = [
  "https://whispr-frontend-u1do.onrender.com"
];

const corsOptions = {
  origin: "https://whispr-frontend-u1do.onrender.com",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ← Mobile needs OPTIONS
  exposedHeaders: ['Set-Cookie'] 
};
app.use(cors(corsOptions));

// Add this AFTER CORS middleware:
app.options('*', cors(corsOptions)); 



app.use(express.json());


app.use(cookieParser());
app.use('/api/diary',  diaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', router);


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Expected { prompt: string }" });
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
  
    res.status(500).json({ error: "Gemini API failed", details: error.message });
  }
});

const PORT = process.env.PORT ;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
  });
});
