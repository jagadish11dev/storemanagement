const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    partId: { type: String, required: false, unique: true, sparse: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0.0 },
    quantity: { type: Number, required: true, default: 0 },
    supplier: { type: String }, // Store supplier name as string
    image: { type: String }, // store filename or URL or base64
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
