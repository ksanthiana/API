const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'News Dashboard API'
    });
});

// API proxy endpoint (optional - for hiding API key)
app.get('/api/news', async (req, res) => {
    try {
        const { query, category, country } = req.query;
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }
        
        let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&pageSize=50`;
        
        if (query) {
            url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${encodeURIComponent(query)}&pageSize=50&sortBy=publishedAt`;
        }
        
        if (category && !query) url += `&category=${category}`;
        if (country && !query) url += `&country=${country}`;
        
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 News Dashboard running on port ${PORT}`);
    console.log(`📱 Access at: http://localhost:${PORT}`);
});