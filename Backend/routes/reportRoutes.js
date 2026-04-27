const express = require('express');
const router = express.Router();
const { salesSummary } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// sales summary for admin/manager
// router.get('/sales-summary',  salesSummary);
router.get('/sales-summary', protect, authorize('admin', 'manager'), salesSummary);

module.exports = router;
