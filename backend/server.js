const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Your Hardcover API token (you'll need to update this with a valid token)
const HARDCOVER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJIYXJkY292ZXIiLCJ2ZXJzaW9uIjoiOCIsImp0aSI6IjlkZDJlMmQ5LWRkNDQtNGI0My04MmI0LTI4MDczMjU1MWY1ZCIsImFwcGxpY2F0aW9uSWQiOjIsInN1YiI6IjUzNjk4IiwiYXVkIjoiMSIsImlkIjoiNTM2OTgiLCJsb2dnZWRJbiI6dHJ1ZSwiaWF0IjoxNzYyNTM5Njg5LCJleHAiOjE3OTQwNzU2ODksImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1yb2xlIjoidXNlciIsIlgtaGFzdXJhLXVzZXItaWQiOiI1MzY5OCJ9LCJ1c2VyIjp7ImlkIjo1MzY5OH19.WPC7OY1kGZQoVeWrrUkDZal1sjZ9J6lnP-p-NyQQlZc';

// Proxy endpoint for Hardcover API
app.post('/api/books', async (req, res) => {
  try {
    const { query } = req.body;

    console.log('Received query:', query);

    const response = await fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HARDCOVER_TOKEN}`
      },
      body: JSON.stringify({ query })
    });

    console.log('Hardcover API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hardcover API error:', errorText);
      return res.status(response.status).json({
        error: 'API request failed',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Hardcover API success:', data);

    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📚 Books API available at http://localhost:${PORT}/api/books`);
});