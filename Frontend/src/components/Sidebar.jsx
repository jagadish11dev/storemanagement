import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    "block px-3 py-2 rounded-md " + (isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100");

  return (
    <aside className="w-full md:w-64 bg-white border-r">
      <nav className="px-2 py-4 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        <NavLink to="/sales" className={linkClass}>Sales</NavLink>
        <NavLink to="/suppliers" className={linkClass}>Suppliers</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
      </nav>
    </aside>
  );
}
