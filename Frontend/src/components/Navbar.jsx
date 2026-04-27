import { Link , useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { logoutUser } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log(user.token);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-black-300 shadow-md relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-bold">Store-Management</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="hover:text-secondary">Products</Link>
          <Link to="/sales" className="hover:text-secondary">Sales</Link>
          <Link to="/suppliers" className="hover:text-secondary">Suppliers</Link>
          <Link to="/reports" className="hover:text-secondary">Reports</Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="menu">☰</button>
          {user ? (
            <>
              <span className="hidden sm:inline">Hi, {user.name || user?.user?.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded-lg font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded-lg">Login</Link>
              <Link to="/register" className="hidden sm:inline border border-white px-3 py-1 rounded-lg">Register</Link>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-48 bg-primary text-black-300 shadow-lg z-10">
          <div className="flex flex-col gap-2 p-2">
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary">Dashboard</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary">Products</Link>
            <Link to="/sales" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary">Sales</Link>
            <Link to="/suppliers" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary">Suppliers</Link>
            <Link to="/purchase-orders" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary">Purchase Orders</Link>
            <Link to="/reports" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary">Reports</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
