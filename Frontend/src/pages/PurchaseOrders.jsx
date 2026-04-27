import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPurchaseOrders } from "../features/purchaseOrders/purchaseOrderSlice";
import Table from "../components/Table";

export default function PurchaseOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.purchaseOrders);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen rounded-2xl flex justify-center items-center">
        <span className="text-gray-600">Loading purchase orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
        <p className="text-red-600">Failed to load purchase orders: {error}</p>
      </div>
    );
  }

  const columns = [
    {
      key: "purchaseId",
      title: "Purchase ID",
      dataIndex: "purchaseId"
    },
    {
      key: "supplier",
      title: "Supplier",
      dataIndex: "supplier",
      render: (supplier) => supplier?.name || "N/A"
    },
    {
      key: "items",
      title: "Items",
      dataIndex: "items",
      render: (items) => items?.length || 0
    },
    {
      key: "totalAmount",
      title: "Total Amount",
      dataIndex: "totalAmount",
      render: (amount) => `$${amount?.toFixed(2)}`
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      key: "orderDate",
      title: "Order Date",
      dataIndex: "orderDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "N/A"
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Purchase Orders Management</h1>
        <button
          onClick={() => navigate("/purchase-orders/add")}
          className="bg-gradient-to-br from-green-400 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Purchase Order
        </button>
      </div>

      <Table columns={columns} data={list} />
    </div>
  );
}