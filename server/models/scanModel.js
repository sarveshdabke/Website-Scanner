const { initializeDB } = require('../db/database');

const saveScan = (scanData) => {
  const db = initializeDB();

  const stmt = db.prepare(
    `INSERT INTO scans (url, seo_data, performance_data, security_data, overall_score)
     VALUES (?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    scanData.url,
    JSON.stringify(scanData.seo),
    JSON.stringify(scanData.performance),
    JSON.stringify(scanData.security),
    scanData.overallScore
  );

  return result.lastInsertRowid;
};

const getAllScans = () => {
  const db = initializeDB();
  const stmt = db.prepare('SELECT * FROM scans ORDER BY created_at DESC');
  return stmt.all();
};

const getScanById = (id) => {
  const db = initializeDB();
  const stmt = db.prepare('SELECT * FROM scans WHERE id = ?');
  return stmt.get(id);
};

module.exports = { saveScan, getAllScans, getScanById };