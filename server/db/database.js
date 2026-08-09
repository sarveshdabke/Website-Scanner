const Database = require('better-sqlite3');
const path = require('path');

let dbInstance = null;

const initializeDB = () => {
  if (dbInstance) return dbInstance;

  dbInstance = new Database(path.join(__dirname, 'scanner.db'));

  dbInstance.exec(`
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