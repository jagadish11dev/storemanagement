import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPurchaseOrder } from "../features/purchaseOrders/purchaseOrderSlice";
import { fetchSuppliers } from "../features/suppliers/supplierSlice";
import { fetchProducts } from "../features/products/productSlice";

export default function AddPurchaseOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suppliers, loading: suppliersLoading } = useSelector((s) => s.suppliers);
  const { products, loading: productsLoading } = useSelector((s) => s.products);
  const { addLoading } = useSelector((s) => s.purchaseOrders);

  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    purchaseId: "",
    supplier: "",
    items: [{ product: "", qty: 1, price: 0 }],
    status: "pending",
    orderDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchProducts());
  }, [dispatch]);

  if (suppliersLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
        <span className="text-gray-600">Loading form data...</span>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product: "", qty: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (form.items.length > 1) {
      const newItems = form.items.filter((_, i) => i !== index);
      setForm({ ...form, items: newItems });
    }
  };

  const calculateTotal = () => {
    return form.items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);
    }, 0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate required fields
    if (!form.purchaseId || !form.purchaseId.trim()) {
      setFormError("Purchase ID is required");
      return;
    }

    if (!form.supplier) {
      setFormError("Supplier is required");
      return;
    }

    if (form.items.some(item => !item.product || !item.qty || item.price < 0)) {
      setFormError("All items must have product, quantity, and valid price");
      return;
    }

    const totalAmount = calculateTotal();

    const purchaseOrderData = {
      purchaseId: form.purchaseId.trim(),
      supplier: form.supplier,
      items: form.items.map(item => ({
        product: item.product,
        qty: parseInt(item.qty),
        price: parseFloat(item.price)
      })),
      totalAmount,
      status: form.status,
      orderDate: form.orderDate
    };

    const result = await dispatch(addPurchaseOrder(purchaseOrderData));

    if (result.type === addPurchaseOrder.rejected.type) {
      const errorMsg = result.payload || "Failed to add purchase order";
      setFormError(errorMsg);
      return;
    }

    if (result.type === addPurchaseOrder.fulfilled.type) {
      navigate("/purchase-orders");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/purchase-orders")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
          >
            <span>←</span> Back to Purchase Orders
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Add New Purchase Order</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to add a new purchase order</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Message */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{formError}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Purchase ID */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Purchase ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="purchaseId"
                value={form.purchaseId}
                onChange={onChange}
                placeholder="Enter purchase ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                name="supplier"
                value={form.supplier}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers && suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Date */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Order Date
              </label>
              <input
                type="date"
                name="orderDate"
                value={form.orderDate}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Items */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Ordered Items <span className="text-red-500">*</span>
              </label>
              {form.items.map((item, index) => (
                <div key={index} className="flex gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-600">Product</label>
                    <select
                      value={item.product}
                      onChange={(e) => onItemChange(index, 'product', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Product</option>
                      {products && products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block mb-1 text-sm font-medium text-gray-600">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => onItemChange(index, 'qty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <label className="block mb-1 text-sm font-medium text-gray-600">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => onItemChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={form.items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>

            {/* Total Amount */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Total Amount
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                ${calculateTotal().toFixed(2)}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addLoading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addLoading ? "Adding..." : "Add Purchase Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}