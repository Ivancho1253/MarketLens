import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for Twelve Data
  app.get("/api/market/price", async (req, res) => {
    const { symbol } = req.query;
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Twelve Data API key missing" });
    }

    try {
      const response = await axios.get(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price" });
    }
  });

  app.get("/api/market/time_series", async (req, res) => {
    const { symbol, interval } = req.query;
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Twelve Data API key missing" });
    }

    try {
      const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval || '1h'}&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time series" });
    }
  });

  // API Proxy for NewsAPI
  app.get("/api/news", async (req, res) => {
    const { q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "NewsAPI key missing" });
    }

    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${q || 'finance'}&sortBy=publishedAt&apiKey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
