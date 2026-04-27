const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// @desc Record a sale
// @route POST /api/sales
// @access Private (cashier/manager/admin)
const recordSale = asyncHandler(async (req, res) => {
  const { date, invoiceId, productName, quantity, unitPrice, total, cashier } = req.body;
  if (!invoiceId || !productName || !quantity || quantity <= 0 || !unitPrice || unitPrice <= 0) {
    res.status(400);
    throw new Error('invoiceId, productName, quantity, and unitPrice are required');
  }

  const product = await Product.findOne({ name: productName });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.quantity < quantity) {
    res.status(400);
    throw new Error('Insufficient product quantity in stock');
  }

  const totalPrice = unitPrice * quantity;

  // decrement product quantity
  product.quantity = product.quantity - quantity;
  await product.save();

  // create sale record
  const sale = await Sale.create({
    invoiceId,
    product: product._id,
    quantity,
    pricePerUnit: unitPrice,
    totalPrice,
    soldBy: req.user._id,
    soldAt: date ? new Date(date) : new Date()
  });

  // Return sale with populated product info for immediate display
  const populatedSale = await Sale.findById(sale._id).populate('product', 'name partId').populate('soldBy', 'name email');

  res.status(201).json(populatedSale);
});

// @desc Get all sales (paginated)
// @route GET /api/sales
// @access Private (admin/manager)
const getSales = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const [sales, count] = await Promise.all([
    Sale.find().populate('product', 'name partId').populate('soldBy', 'name email').skip(skip).limit(limit).sort({ soldAt: -1 }),
    Sale.countDocuments()
  ]);

  res.json({
    sales,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

module.exports = {
  recordSale,
  getSales
};
