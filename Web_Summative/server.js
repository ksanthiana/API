import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY; // Store key securely in environment variable

app.get("/news", async (req, res) => {
  try {
    const { q = "bitcoin", category = "", country = "us" } = req.query;
    const url = `https://newsapi.org/v2/top-headlines?q=${q}&category=${category}&country=${country}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
