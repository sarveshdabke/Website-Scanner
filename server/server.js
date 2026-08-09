require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scanRoutes = require('./routes/scanRoutes');
const { initializeDB } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Website Scanner API is running' });
});

app.use('/api', scanRoutes);

// Ab sync hai, await ki zarurat nahi
initializeDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});