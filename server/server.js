require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scanRoutes = require('./routes/scanRoutes');
const { initializeDB } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Website Scanner API is running' });
});

app.use('/api', scanRoutes);

// Server start karne se pehle DB initialize karo
const startServer = async () => {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();