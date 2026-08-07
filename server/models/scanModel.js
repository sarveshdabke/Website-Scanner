const { initializeDB } = require('../db/database');

// Naya scan result save karo
const saveScan = async (scanData) => {
  const db = await initializeDB();

  const result = await db.run(
    `INSERT INTO scans (url, seo_data, performance_data, security_data, overall_score)
     VALUES (?, ?, ?, ?, ?)`,
    [
      scanData.url,
      JSON.stringify(scanData.seo),
      JSON.stringify(scanData.performance),
      JSON.stringify(scanData.security),
      scanData.overallScore
    ]
  );

  return result.lastID;
};

// Saare past scans nikalo (history ke liye)
const getAllScans = async () => {
  const db = await initializeDB();
  const scans = await db.all('SELECT * FROM scans ORDER BY created_at DESC');
  return scans;
};

// Ek specific scan nikalo ID se
const getScanById = async (id) => {
  const db = await initializeDB();
  const scan = await db.get('SELECT * FROM scans WHERE id = ?', [id]);
  return scan;
};

module.exports = { saveScan, getAllScans, getScanById };