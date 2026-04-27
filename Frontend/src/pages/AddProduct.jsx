import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../features/products/productSlice";

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    partId: "",
    description: "",
    price: 0,
    quantity: 0,
    supplier: "",
    image: "",
  });

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setForm({ ...form, image: files[0] });
    } else if (name === "price") {
      setForm({ ...form, [name]: value === "" ? "" : parseFloat(value) || 0 });
    } else if (name === "quantity") {
      setForm({ ...form, [name]: value === "" ? "" : parseInt(value) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    // Validate required fields
    if (!form.name || !form.name.trim()) {
      setFormError("Product name is required");
      setIsLoading(false);
      return;
    }

    const priceValue = parseFloat(form.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError("Valid price (greater than 0) is required");
      setIsLoading(false);
      return;
    }

    const quantityValue = parseInt(form.quantity);
    if (isNaN(quantityValue) || quantityValue < 0) {
      setFormError("Valid quantity is required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("price", priceValue.toString());
    formData.append("quantity", quantityValue.toString());

    if (form.partId && form.partId.trim()) {
      formData.append("partId", form.partId.trim());
    }
    if (form.description && form.description.trim()) {
      formData.append("description", form.description.trim());
    }
    if (form.supplier && form.supplier.trim()) {
      formData.append("supplier", form.supplier.trim());
    }
    if (form.image && form.image instanceof File) {
      formData.append("image", form.image);
    }

    const result = await dispatch(addProduct(formData));

    if (result.type === addProduct.rejected.type) {
      const errorMsg = result.payload || "Failed to add product";
      setFormError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (result.type === addProduct.fulfilled.type && result.payload) {
      setIsLoading(false);
      navigate("/products");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/products")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
          >
            <span>←</span> Back to Products
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to add a new product</p>
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
            {/* Product Name */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Part ID and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Part ID</label>
                <input
                  type="text"
                  name="partId"
                  value={form.partId}
                  onChange={onChange}
                  placeholder="Enter part ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Quantity and Supplier Row */}
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
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Supplier Name</label>
                <input
                  type="text"
                  name="supplier"
                  value={form.supplier}
                  onChange={onChange}
                  placeholder="Enter supplier name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Enter product description"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Product Image</label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  name="image"
                  onChange={onChange}
                  accept="image/*"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                {form.image && form.image instanceof File && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>✓</span>
                    <span>{form.image.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding Product..." : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/products")}
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
