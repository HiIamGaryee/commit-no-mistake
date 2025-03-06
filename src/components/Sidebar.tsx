import React from "react";
import { FaTachometerAlt, FaWallet, FaTable, FaTh, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* Logo */}
      <div className="text-2xl font-bold text-center mb-6">HORIZON</div>

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center p-3 hover:bg-gray-800 rounded">
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </Link>
        <Link to="/wallet" className="flex items-center p-3 hover:bg-gray-800 rounded">
          <FaWallet className="mr-3" />
          NFT Marketplace
        </Link>
        <Link to="/tables" className="flex items-center p-3 hover:bg-gray-800 rounded">
          <FaTable className="mr-3" />
          Tables
        </Link>
        <Link to="/kanban" className="flex items-center p-3 hover:bg-gray-800 rounded">
          <FaTh className="mr-3" />
          Kanban
        </Link>
        <Link to="/profile" className="flex items-center p-3 hover:bg-gray-800 rounded">
          <FaUser className="mr-3" />
          Profile
        </Link>
      </nav>

      {/* Sign Out Button */}
      <div className="mt-auto">
        <button className="flex items-center p-3 bg-red-600 hover:bg-red-700 w-full rounded">
          <FaSignOutAlt className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
