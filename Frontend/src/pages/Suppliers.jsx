import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSuppliers } from "../features/suppliers/supplierSlice";
import Table from "../components/Table";

export default function Suppliers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.suppliers);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen rounded-2xl flex justify-center items-center">
        <span className="text-gray-600">Loading suppliers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
        <p className="text-red-600">Failed to load suppliers: {error}</p>
      </div>
    );
  }

  const columns = [
    { key: "supplierId", title: "Supplier ID", dataIndex: "supplierId" },
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "email", title: "Email", dataIndex: "email" },
    { key: "address", title: "Address", dataIndex: "address" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Suppliers Management</h1>
        <button
          onClick={() => navigate("/suppliers/add")}
          className="bg-gradient-to-br from-green-400 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Supplier
        </button>
      </div>

      <Table columns={columns} data={list} />
    </div>
  );
}
