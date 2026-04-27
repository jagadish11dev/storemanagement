const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true }, // snapshot of product price at sale time
    totalPrice: { type: Number, required: true },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    soldAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
