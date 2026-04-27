import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSale } from "../features/sales/salesSlice";
import { fetchProducts } from "../features/products/productSlice";

export default function AddSale() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { items: products } = useSelector((state) => state.products);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    invoiceId: "",
    productName: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
    cashier: user?.name || "",
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity" || name === "unitPrice") {
      const quantity = name === "quantity" ? parseInt(value) || 0 : form.quantity;
      const unitPrice = name === "unitPrice" ? parseFloat(value) || 0 : form.unitPrice;
      const total = quantity * unitPrice;

      setForm({
        ...form,
        [name]: name === "quantity" ? (value === "" ? "" : parseInt(value) || 0) : (value === "" ? "" : parseFloat(value) || 0),
        total: total
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    // Validate required fields
    if (!form.invoiceId || !form.invoiceId.trim()) {
      setFormError("Invoice ID is required");
      setIsLoading(false);
      return;
    }

    if (!form.productName) {
      setFormError("Product selection is required");
      setIsLoading(false);
      return;
    }

    const quantityValue = parseInt(form.quantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      setFormError("Valid quantity (greater than 0) is required");
      setIsLoading(false);
      return;
    }

    const unitPriceValue = parseFloat(form.unitPrice);
    if (isNaN(unitPriceValue) || unitPriceValue <= 0) {
      setFormError("Valid unit price (greater than 0) is required");
      setIsLoading(false);
      return;
    }

    if (!form.cashier || !form.cashier.trim()) {
      setFormError("Cashier name is required");
      setIsLoading(false);
      return;
    }

    const saleData = {
      date: form.date,
      invoiceId: form.invoiceId.trim(),
      productName: form.productName,
      quantity: quantityValue,
      unitPrice: unitPriceValue,
      total: form.total,
      cashier: form.cashier.trim(),
    };

    const result = await dispatch(addSale(saleData));

    if (result.type === addSale.rejected.type) {
      const errorMsg = result.payload || "Failed to add sale";
      setFormError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (result.type === addSale.fulfilled.type && result.payload) {
      setIsLoading(false);
      navigate("/sales");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/sales")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
          >
            <span>←</span> Back to Sales
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Add New Sale</h1>
          <p className="text-gray-600 mt-2">Record a new sale transaction</p>
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
            {/* Date and Invoice ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Invoice ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="invoiceId"
                  value={form.invoiceId}
                  onChange={onChange}
                  placeholder="Enter invoice ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <select
                name="productName"
                value={form.productName}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a product</option>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <option key={product._id} value={product.name}>
                      {product.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No products available</option>
                )}
              </select>
            </div>

            {/* Quantity and Unit Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={onChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Unit Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={onChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Total and Cashier Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Total <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="total"
                  value={form.total.toFixed(2)}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Cashier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cashier"
                  value={form.cashier}
                  onChange={onChange}
                  placeholder="Enter cashier name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Recording Sale..." : "Record Sale"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/sales")}
                className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}