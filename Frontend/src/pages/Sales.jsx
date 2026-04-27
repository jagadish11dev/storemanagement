import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSales } from "../features/sales/salesSlice";
import Table from "../components/Table";
import formatDate from "../utils/formatDate";

export default function Sales() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { records } = useSelector((s) => s.sales); // now an array of sale objects

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const columns = [
    { key: "invoiceId", title: "Invoice ID", dataIndex: "invoiceId" },
    { key: "product", title: "Product", render: (r) => r.product?.name || "N/A" },
    { key: "quantity", title: "Quantity", dataIndex: "quantity" },
    { key: "pricePerUnit", title: "Unit Price", render: (r) => `$${r.pricePerUnit?.toFixed(2)}` },
    { key: "totalPrice", title: "Total", render: (r) => `$${r.totalPrice?.toFixed(2)}` },
    { key: "soldBy", title: "Cashier", render: (r) => r.soldBy?.name || "N/A" },
    { key: "soldAt", title: "Date", render: (r) => formatDate(r.soldAt) },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Sales</h2>
        <button
          onClick={() => navigate("/sales/add")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Add New Sale
        </button>
      </div>
      <Table columns={columns} data={records} />
    </div>
  );
}
