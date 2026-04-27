const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc Create a new product
// @route POST /api/products
// @access Private (admin/manager)
const createProduct = asyncHandler(async (req, res) => {
  console.log("Create product - req.body:", req.body);
  console.log("Create product - req.file:", req.file ? "File received" : "No file");
  console.log("Create product - req.user:", req.user ? `User: ${req.user._id}` : "No user");
  
  const { name, partId, description, price, quantity, supplier } = req.body;
  let image = req.body.image;

  // Validate required fields
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Name is required');
  }

  // Validate price
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    res.status(400);
    throw new Error('Valid price is required');
  }

  // Validate quantity
  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity < 0) {
    res.status(400);
    throw new Error('Valid quantity is required');
  }

  // Handle file upload from multer
  if (req.file) {
    image = req.file.buffer.toString('base64');
  }

  // Check for duplicate product name (case-insensitive)
  const existing = await Product.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
  if (existing) {
    res.status(400);
    throw new Error('Product with this name already exists');
  }

  // Check for duplicate Part ID if provided
  if (partId && partId.trim()) {
    const existingPartId = await Product.findOne({ partId: partId.trim() });
    if (existingPartId) {
      res.status(400);
      throw new Error('Product with this Part ID already exists');
    }
  }

  const userId = req.user._id; // Should always exist due to protect middleware

  const productData = {
    name: name.trim(),
    price: parsedPrice,
    quantity: parsedQuantity,
    createdBy: userId
  };

  if (partId && partId.trim()) {
    productData.partId = partId.trim();
  }
  if (description && description.trim()) {
    productData.description = description.trim();
  }
  if (supplier && supplier.trim()) {
    productData.supplier = supplier.trim();
  }
  if (image) {
    productData.image = image;
  }

  console.log("Product data to create:", productData);
  
  const product = await Product.create(productData);
  console.log("Product created:", product._id);
  
  res.status(201).json(product);
});

// @desc Get list of products (with simple pagination)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  // Build query object
  let query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  const [products, count] = await Promise.all([
    Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(query)
  ]);

  // Return products array directly for frontend compatibility
  res.status(200).json(products);
});

// @desc Get product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private (owner, admin, manager)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, partId, description, price, quantity, supplier } = req.body;
  let image = req.body.image;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user is admin/manager or the creator of the product
  if (req.user.role !== 'admin' && req.user.role !== 'manager' && product.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden: You can only edit products you created');
  }

  // Handle file upload from multer
  if (req.file) {
    image = req.file.buffer.toString('base64');
  }

  // Update fields if provided
  if (name && name.trim()) {
    product.name = name.trim();
  }
  if (partId && partId.trim()) {
    product.partId = partId.trim();
  }
  if (description) {
    product.description = description.trim();
  }
  if (price !== undefined && price !== '') {
    product.price = parseFloat(price);
  }
  if (quantity !== undefined && quantity !== '') {
    product.quantity = parseInt(quantity);
  }
  if (supplier && supplier.trim()) {
    product.supplier = supplier.trim();
  }
  if (image) {
    product.image = image;
  }

  const updated = await product.save();
  res.json(updated);
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private (owner, admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user is admin or the creator of the product
  if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden: You can only delete products you created');
  }

  // Delete the product
  await Product.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
