import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      {/* <Navbar /> */}
      
      <main className="min-h-screen p-8 bg-blue-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to Store Management</h1>
        <p className="text-lg mb-6">
          Manage your products, inventory, and sales efficiently.
        </p>
        

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to='/products'>
             <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-xl mb-2">Products</h2>
            <p>View and manage all your products.</p>
          </div>
          </Link>
         
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-xl mb-2">Inventory</h2>
            <p>Keep track of your stock and quantities.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-xl mb-2">Sales</h2>
            <p>Monitor sales and revenue reports.</p>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
