const express = require('express');
const router = express.Router();
const { handleScan, handleGetAllScans, handleGetScanById, handleAIAnalysis, handleScanStream} = require('../controllers/scanController');

router.post('/scan', handleScan);
router.get('/history', handleGetAllScans);
router.get('/scan/:id', handleGetScanById);
router.post('/ai-analysis/:id', handleAIAnalysis);
router.get('/scan-stream', handleScanStream);

module.exports = router;