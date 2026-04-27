const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String },
    address: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
