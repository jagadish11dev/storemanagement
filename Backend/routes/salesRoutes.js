const express = require('express');
const router = express.Router();
const { recordSale, getSales } = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// router.post('/',  recordSale);
// router.get('/',  getSales);
router.post('/', protect, authorize('admin', 'manager', 'cashier'), recordSale);
router.get('/', protect, authorize('admin', 'manager'), getSales);
module.exports = router;
