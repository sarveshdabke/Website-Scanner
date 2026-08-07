const express = require('express');
const router = express.Router();
const { handleScan, handleGetAllScans, handleGetScanById } = require('../controllers/scanController');

router.post('/scan', handleScan);
router.get('/history', handleGetAllScans);
router.get('/scan/:id', handleGetScanById);

module.exports = router;