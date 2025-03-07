import React from "react";
import { FaTachometerAlt, FaWallet, FaTable, FaTh, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#0A0F0D] text-white flex flex-col p-4 boarder-r boarder-[#39FF14]">
      {/* Logo */}
      <div className="text-2xl font-bold text-center mb-6 text-white">Commit No Mistake</div>

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center p-3 rounded hover:bg-[#081210] transition text-white">
          <FaTachometerAlt className="mr-3 text-[#39FF14]" />
          Dashboard
        </Link>
        <Link to="/wallet" className="flex items-center p-3 rounded hover:bg-[#081210] transition text-white">
          <FaWallet className="mr-3 text-white" />
          NFT Marketplace
        </Link>
        <Link to="/profile" className="flex items-center p-3 rounded hover:bg-[#081210] transition text-white">
          <FaUser className="mr-3 text-white" />
          Profile
        </Link>
      </nav>

    
    </div>
  );
};

export default Sidebar;
