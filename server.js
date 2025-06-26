const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const agent = new https.Agent({ rejectUnauthorized: false }); // Ignore SSL errors (for local testing only)
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      httpsAgent: agent
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const patterns = [];

    // 1. Subscription prompt
    if ($('button:contains("Subscribe")').length > 0) {
      patterns.push('Subscription prompt detected');
    }

    // 2. Urgency messages (e.g., "Only 1 room left!")
    if ($('body').text().match(/only \d+ room left/i)) {
      patterns.push('Urgency message detected');
    }

    // 3. Countdown timers (class or id contains 'countdown')
    if ($('[class*=countdown], [id*=countdown]').length > 0) {
      patterns.push('Countdown timer detected');
    }

    // 4. Pre-checked checkboxes
    $('input[type=checkbox]').each((i, el) => {
      if ($(el).prop('checked')) {
        patterns.push('Pre-checked checkbox detected');
      }
    });

    // 5. Misleading button labels (e.g., "Yes, upgrade me!" or "No, I don't want savings")
    $('button').each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes("upgrade me") || text.includes("don't want savings") || text.includes("no thanks")) {
        patterns.push('Potentially misleading button label detected');
      }
    });

    res.json({ url, patterns, success: true });
  } catch (err) {
    console.error('Error analyzing URL:', err);
    res.status(500).json({ error: 'Failed to fetch or analyze the website.' });
  }
});

app.get('/', (req, res) => {
  res.send('Dark Patterns API is running.');
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No Content
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 