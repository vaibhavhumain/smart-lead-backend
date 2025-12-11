import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import leadsRouter from './routes/leads.js';
import { startSyncJob } from './cron/syncJob.js';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected");

    const app = express();

    app.use(
      cors({
        origin: "https://hilarious-beijinho-ea84a5.netlify.app",
        methods: ["GET", "POST"],
        credentials: false,
        allowedHeaders: ["Content-Type"],
      })
    );

    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Smart Lead Backend Running");
    });

    app.use('/api/leads', leadsRouter);

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));

    startSyncJob();

  } catch (err) {
    console.error("Error starting server:", err);
  }
}

start();
