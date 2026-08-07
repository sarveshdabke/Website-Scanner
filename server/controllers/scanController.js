const { saveScan, getAllScans, getScanById } = require('../models/scanModel');
const { runSeoCheck } = require('../services/seoService');
const { runSecurityCheck } = require('../services/securityService');
const { runPerformanceCheck } = require('../services/performanceService');

const handleScan = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Ab teeno parallel mein chalenge
    const [seoResult, securityResult, performanceResult] = await Promise.all([
      runSeoCheck(url),
      runSecurityCheck(url),
      runPerformanceCheck(url)
    ]);

    const overallScore = Math.round(
      (seoResult.score + securityResult.score + performanceResult.score) / 3
    );

    const scanResult = {
      url: url,
      seo: seoResult,
      performance: performanceResult,
      security: securityResult,
      overallScore
    };

    const scanId = await saveScan(scanResult);

    res.status(200).json({ id: scanId, ...scanResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while scanning' });
  }
};

const handleGetAllScans = async (req, res) => {
  try {
    const scans = await getAllScans();
    res.status(200).json(scans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch scan history' });
  }
};

const handleGetScanById = async (req, res) => {
  const { id } = req.params;
  try {
    const scan = await getScanById(id);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.status(200).json(scan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch scan details' });
  }
};

module.exports = { handleScan, handleGetAllScans, handleGetScanById };