const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');

// create supplier
const createSupplier = asyncHandler(async (req, res) => {
  const { supplierId, name, contactNumber, email, address } = req.body;
  if (!supplierId || !name) {
    res.status(400);
    throw new Error('Supplier ID and Name are required');
  }
  const supplier = await Supplier.create({
    supplierId,
    name,
    contactNumber,
    email,
    address,
    createdBy: req.user._id
  });
  res.status(201).json(supplier);
});

// get suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
});

// update supplier
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  const { supplierId, name, contactNumber, email, address } = req.body;
  supplier.supplierId = supplierId || supplier.supplierId;
  supplier.name = name || supplier.name;
  supplier.contactNumber = contactNumber || supplier.contactNumber;
  supplier.email = email || supplier.email;
  supplier.address = address || supplier.address;
  const updated = await supplier.save();
  res.json(updated);
});

// delete supplier
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  await supplier.remove();
  res.json({ message: 'Supplier removed' });
});

module.exports = {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
};
