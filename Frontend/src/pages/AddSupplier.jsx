import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSupplier } from "../features/suppliers/supplierSlice";

export default function AddSupplier() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
    name: "",
    email: "",
    address: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    // Validate required fields
    if (!form.supplierId || !form.supplierId.trim()) {
      setFormError("Supplier ID is required");
      setIsLoading(false);
      return;
    }

    if (!form.name || !form.name.trim()) {
      setFormError("Supplier name is required");
      setIsLoading(false);
      return;
    }

    const result = await dispatch(addSupplier({
      supplierId: form.supplierId.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    }));

    if (result.type === addSupplier.rejected.type) {
      const errorMsg = result.payload || "Failed to add supplier";
      setFormError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (result.type === addSupplier.fulfilled.type && result.payload) {
      setIsLoading(false);
      navigate("/suppliers");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/suppliers")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
          >
            <span>←</span> Back to Suppliers
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Add New Supplier</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to add a new supplier</p>
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
            {/* Supplier ID */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Supplier ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="supplierId"
                value={form.supplierId}
                onChange={onChange}
                placeholder="Enter supplier ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter supplier name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Email (Mail ID)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Enter email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Enter supplier address"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding Supplier..." : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}