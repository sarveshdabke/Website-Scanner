require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scanRoutes = require('./routes/scanRoutes');
const { initializeDB } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Production mein sirf apni Vercel URL allow karo, dev mein sab allow
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL // Vercel URL yahan env variable se aayegi
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

const startServer = async () => {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();