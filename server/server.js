import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

const DATA_FILE = path.join(__dirname, '..', 'data.csv');
const JSON_FILE = path.join(__dirname, '..', 'data.json');

// Initialize files if they don't exist
if (!fs.existsSync(JSON_FILE)) {
  fs.writeFileSync(JSON_FILE, '[]', 'utf8');
}

const escapeCsv = (str) => {
  if (str === null || str === undefined) return '""';
  const escaped = String(str).replace(/"/g, '""');
  return `"${escaped}"`;
};

app.post('/api/submit', (req, res) => {
  try {
    const payload = req.body;
    payload.timestamp = new Date().toISOString();

    // 1. Save to CSV (Dynamic Headers)
    let headers = [];
    if (!fs.existsSync(DATA_FILE) || fs.statSync(DATA_FILE).size === 0) {
      headers = Object.keys(payload);
      fs.writeFileSync(DATA_FILE, headers.map(escapeCsv).join(',') + '\n', 'utf8');
    } else {
      // Read first line to get headers
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const firstLine = content.split('\n')[0];
      // Basic split (ignoring commas inside quotes for header reading simplicity)
      headers = firstLine.split(',').map(h => h.replace(/(^"|"$)/g, ''));
    }

    const csvRow = headers.map(header => escapeCsv(payload[header] || '')).join(',') + '\n';
    fs.appendFileSync(DATA_FILE, csvRow, 'utf8');

    // 2. Save to JSON
    const currentData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    currentData.push(payload);
    fs.writeFileSync(JSON_FILE, JSON.stringify(currentData, null, 2), 'utf8');

    res.status(200).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API server is running on http://localhost:${PORT}`);
});
