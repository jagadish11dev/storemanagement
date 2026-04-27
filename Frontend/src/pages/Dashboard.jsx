import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { fetchSales } from "../features/sales/salesSlice";
import ProductCard from "../components/ProductCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  // fetch data when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      dispatch(fetchSales());
    }
  }, [dispatch, user]);

  // products.items is an array with loading state
  const { items: products, loading: productsLoading, error: productsError } = useSelector((s) => s.products);
  // sales slice now contains records array, metadata and loading
  const { records: salesRecords, total: salesCount, page: salesPage, pages: salesPages, loading: salesLoading, error: salesError } = useSelector((s) => s.sales);

  // if either slice is loading, show spinner
  if (productsLoading || salesLoading) {
    return (
      <div className="flex-1 p-4 flex justify-center items-center">
        <span className="text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (productsError || salesError) {
    return (
      <div className="flex-1 p-4">
        <p className="text-red-600">Failed to load dashboard data: {productsError || salesError}</p>
      </div>
    );
  }

  // derive values safely
  const totalProducts = products.length;
  const totalSales = salesCount || salesRecords.length;
  const revenue = salesRecords.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  return (
    <div className="md:flex md:space-x-6">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-primary mb-4">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
          {(user && (user.role === 'admin' || user.role === 'manager')) && (
            <>
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">₹{revenue.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-3">Recent Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
