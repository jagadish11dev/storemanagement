import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AddSupplier from "./pages/AddSupplier";
import Sales from "./pages/Sales";
import AddSale from "./pages/AddSale";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import AddPurchaseOrder from "./pages/AddPurchaseOrder";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Table from "./components/Table";


export default function App() {
 

  return (
    <div className="flex flex-col min-h-screen bg-neutral">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/add" element={<AddSale />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/purchase-orders/add" element={<AddPurchaseOrder />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
          

        </Routes>
      </main>
      <Footer />
    </div>
  );
}
