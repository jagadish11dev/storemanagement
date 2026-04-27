const express = require('express');
const router = express.Router();
const {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// router.get('/', getSuppliers);
// router.post('/',  createSupplier);
// router.put('/:id',  updateSupplier);
// router.delete('/:id',  deleteSupplier);
router.get('/', getSuppliers);
router.post('/', protect, authorize('admin', 'manager'), createSupplier);
router.put('/:id', protect, authorize('admin', 'manager'), updateSupplier);
router.delete('/:id', protect, authorize('admin'), deleteSupplier);

module.exports = router;
