const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');

// Simple sales summary endpoint
// @route GET /api/reports/sales-summary?from=2025-01-01&to=2025-01-31
// @access Private (admin/manager)
const salesSummary = asyncHandler(async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(0);
  const to = req.query.to ? new Date(req.query.to) : new Date();

  const result = await Sale.aggregate([
    {
      $match: {
        soldAt: { $gte: from, $lte: to }
      }
    },
    {
      $group: {
        _id: null,
        totalSalesCount: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ]);

  const summary = result[0] || { totalSalesCount: 0, totalQuantity: 0, totalRevenue: 0 };
  res.json(summary);
});

module.exports = { salesSummary };
