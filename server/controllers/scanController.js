const { saveScan, getAllScans, getScanById } = require('../models/scanModel');
const { runSeoCheck } = require('../services/seoService');
const { runSecurityCheck } = require('../services/securityService');
const { runPerformanceCheck } = require('../services/performanceService');
const { generateAIFixes } = require('../services/groqService');

const handleScan = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const [seoResult, securityResult, performanceResult] = await Promise.all([
      runSeoCheck(url),
      runSecurityCheck(url),
      runPerformanceCheck(url)
    ]);

    const overallScore = Math.round(
      (seoResult.score + securityResult.score + performanceResult.score) / 3
    );

    const scanResult = {
      url,
      seo: seoResult,
      performance: performanceResult,
      security: securityResult,
      overallScore
    };

    const scanId = saveScan(scanResult); // await hata diya

    res.status(200).json({ id: scanId, ...scanResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while scanning' });
  }
};

const handleGetAllScans = async (req, res) => {
  try {
    const scans = getAllScans(); // await hata diya
    res.status(200).json(scans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch scan history' });
  }
};

const handleGetScanById = async (req, res) => {
  const { id } = req.params;
  try {
    const scan = getScanById(id); // await hata diya
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.status(200).json(scan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch scan details' });
  }
};

const handleAIAnalysis = async (req, res) => {
  const { id } = req.params;
  try {
    const scan = getScanById(id); // await hata diya
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    const scanData = {
      url: scan.url,
      overallScore: scan.overall_score,
      seo: JSON.parse(scan.seo_data),
      performance: JSON.parse(scan.performance_data),
      security: JSON.parse(scan.security_data)
    };

    const aiResult = await generateAIFixes(scanData);
    res.status(200).json(aiResult);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
};

const handleScanStream = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = (stage, status, data = null) => {
    res.write(`data: ${JSON.stringify({ stage, status, data })}\n\n`);
  };

  try {
    sendEvent('received', 'complete');

    sendEvent('seo', 'running');
    const seoResult = await runSeoCheck(url);
    sendEvent('seo', 'complete', seoResult);

    sendEvent('performance', 'running');
    const performanceResult = await runPerformanceCheck(url);
    sendEvent('performance', 'complete', performanceResult);

    sendEvent('security', 'running');
    const securityResult = await runSecurityCheck(url);
    sendEvent('security', 'complete', securityResult);

    sendEvent('aggregating', 'running');
    const overallScore = Math.round(
      (seoResult.score + securityResult.score + performanceResult.score) / 3
    );

    const scanResult = {
      url,
      seo: seoResult,
      performance: performanceResult,
      security: securityResult,
      overallScore
    };

    const scanId = saveScan(scanResult); // await hata diya
    sendEvent('aggregating', 'complete');

    sendEvent('done', 'complete', { id: scanId, ...scanResult });
    res.end();

  } catch (error) {
    sendEvent('error', 'failed', { message: error.message });
    res.end();
  }
};

module.exports = { handleScan, handleGetAllScans, handleGetScanById, handleAIAnalysis, handleScanStream };