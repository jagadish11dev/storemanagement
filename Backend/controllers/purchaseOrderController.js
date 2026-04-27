const asyncHandler = require('express-async-handler');
const PurchaseOrder = require('../models/PurchaseOrder');

// create purchase order
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { purchaseId, supplier, items, totalAmount, status, orderDate } = req.body;
  if (!purchaseId || !supplier || !items || items.length === 0 || !totalAmount) {
    res.status(400);
    throw new Error('Purchase ID, Supplier, items, and total amount are required');
  }
  const purchaseOrder = await PurchaseOrder.create({
    purchaseId,
    supplier,
    items,
    totalAmount,
    status: status || 'pending',
    orderDate: orderDate || new Date(),
    createdBy: req.user._id
  });
  res.status(201).json(purchaseOrder);
});

// get purchase orders
const getPurchaseOrders = asyncHandler(async (req, res) => {
  const purchaseOrders = await PurchaseOrder.find()
    .populate('supplier', 'name')
    .populate('items.product', 'name')
    .sort({ createdAt: -1 });
  res.json(purchaseOrders);
});

// update purchase order
const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);
  if (!purchaseOrder) {
    res.status(404);
    throw new Error('Purchase order not found');
  }
  const { purchaseId, supplier, items, totalAmount, status, orderDate } = req.body;
  purchaseOrder.purchaseId = purchaseId || purchaseOrder.purchaseId;
  purchaseOrder.supplier = supplier || purchaseOrder.supplier;
  purchaseOrder.items = items || purchaseOrder.items;
  purchaseOrder.totalAmount = totalAmount || purchaseOrder.totalAmount;
  purchaseOrder.status = status || purchaseOrder.status;
  purchaseOrder.orderDate = orderDate || purchaseOrder.orderDate;
  const updated = await purchaseOrder.save();
  res.json(updated);
});

// delete purchase order
const deletePurchaseOrder = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);
  if (!purchaseOrder) {
    res.status(404);
    throw new Error('Purchase order not found');
  }
  await purchaseOrder.remove();
  res.json({ message: 'Purchase order removed' });
});

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder
};