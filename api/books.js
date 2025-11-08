export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    console.log('Received query:', query);

    const response = await fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HARDCOVER_TOKEN}`
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
}