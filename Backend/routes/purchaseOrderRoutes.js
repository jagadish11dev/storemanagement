const express = require('express');
const router = express.Router();
const {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder
} = require('../controllers/purchaseOrderController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', getPurchaseOrders);
router.post('/', protect, authorize('admin', 'manager'), createPurchaseOrder);
router.put('/:id', protect, authorize('admin', 'manager'), updatePurchaseOrder);
router.delete('/:id', protect, authorize('admin'), deletePurchaseOrder);

module.exports = router;