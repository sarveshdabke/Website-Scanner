const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

const initializeDB = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, 'scanner.db'),
    driver: sqlite3.Database
  });

  // Table banao agar exist nahi karti
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      seo_data TEXT,
      performance_data TEXT,
      security_data TEXT,
      overall_score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database connected and table ready');
  return dbInstance;
};

module.exports = { initializeDB };