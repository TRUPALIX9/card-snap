import os from "os";
import mongoose from "mongoose";
import { ExpressHandler } from "../@types/express";

// Diagnostics for local development.
// /status is always available as a health check. /system and /db are only
// mounted when NODE_ENV is not "production" (see routes/playground/index.ts).
// Environment variables and database documents are never returned.

// GET /status
export const getApiStatus: ExpressHandler = async (_req, res) => {
  return res.json({
    name: "Card Snap API",
    status: "🟢 running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || "unknown",
    env: process.env.NODE_ENV || "development",
  });
};

// GET /system
export const getSystemInfo: ExpressHandler = async (_req, res) => {
  return res.json({
    platform: os.platform(),
    uptime: os.uptime(),
    memory: {
      total: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
      free: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
    },
    timestamp: new Date().toISOString(),
  });
};

// GET /db (collection names and counts only, no documents)
export const getDatabaseInfo: ExpressHandler = async (_req, res) => {
  const db = mongoose.connection.db;

  if (!db) {
    return res.status(503).json({ message: "Database not connected" });
  }

  try {
    const collections = await db.listCollections().toArray();

    const info = await Promise.all(
      collections.map(async (col) => {
        const count = await db.collection(col.name).estimatedDocumentCount();
        return { name: col.name, count };
      })
    );

    return res.json({
      totalCollections: info.length,
      collections: info,
    });
  } catch (err) {
    console.error("DB Info Error:", err);
    return res.status(500).json({ message: "Failed to fetch database info" });
  }
};
