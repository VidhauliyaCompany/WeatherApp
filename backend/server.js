require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

// Current weather: /api/weather?city=Delhi
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const r = await fetch(
      `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 5-day forecast: /api/forecast?city=Delhi
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const r = await fetch(
      `${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));