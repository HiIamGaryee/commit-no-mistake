import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { media } from "../style/theme/theme";
import { FaUserCircle, FaBell, FaGlobe, FaSignOutAlt, FaWallet, FaTasks, FaChartLine } from "react-icons/fa";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TransactionsPage, { mockData } from "./TransactionsPage";
import TailwindDialog from "../components/TailwindDialog";
import AiBot from "../components/AiBots";
import Sidebar from "../components/Sidebar";  // ✅ Sidebar Component
import DashboardChart from "../components/DashboardChart";  // ✅ Chart Component

const AI_REPORT_API_URL = "http://localhost:5000/generate-report";

// ✅ AI Smart Report (Mock Data)
const MOCK_REPORT = {
  overallHealthScore: Math.floor(Math.random() * 100) + 1,
  suspiciousFindings: [
    { text: "Unusual gas fees detected in last 24 hours", level: "warning" },
    { text: "Large transaction to unknown contract (0xAb12...D3f4)", level: "critical" },
  ],
  securityTips: [
    "Consider using a hardware wallet for better security.",
    "Enable two-factor authentication on connected accounts.",
  ],
  aiInsights: [
    "Your wallet is in the top 10% of active traders.",
    "Your last transaction had a gas fee of $12.50.",
  ],
};

const DashboardScreenWrap = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  height: 100vh;
  background: #0f172a;

  .content-area {
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: #1e293b;
    border-radius: 8px;
  }

  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;

    ${media.md`
      grid-template-columns: repeat(2, 1fr);
    `}
    ${media.sm`
      grid-template-columns: repeat(1, 1fr);
    `}
  }

  .card {
    background: #1e293b;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    color: white;
    font-size: 18px;
    font-weight: bold;
  }

  .charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    ${media.md`
      grid-template-columns: repeat(1, 1fr);
    `}
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [smartReport, setSmartReport] = useState(MOCK_REPORT);
  const [reportLoading, setReportLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setReportLoading(true);
        const reportResponse = await axios.post(AI_REPORT_API_URL, { walletAddress });
        setSmartReport(reportResponse.data.report);
        console.log("Smart Report Data:", reportResponse.data.report);
      } catch (error) {
        console.error("AI Report API Error:", error);
        setSmartReport(MOCK_REPORT);
      } finally {
        setReportLoading(false);
      }
    };
    fetchReport();
  }, [walletAddress]);

  return (
    <DashboardScreenWrap>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="content-area">
        {/* Header */}
        <div className="header">
          <span className="text-lg font-semibold text-white">
            {walletAddress || "Not Connected"}
          </span>
          <div className="flex gap-4">
            <button onClick={handleOpen} className="neon-button px-4 py-1 rounded">
              Open AiBot
            </button>
            <FaGlobe size={20} className="text-white" />
            <FaBell size={20} className="text-white" />
            {authenticated && (
              <button onClick={logout} className="neon-button bg-red-600 px-4 py-1 rounded">
                <FaSignOutAlt size={16} className="inline-block mr-1" />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="dashboard-cards">
          <div className="card">
            <FaWallet size={24} className="mb-2 text-green-400" />
            Earnings <br /> **$350.4**
          </div>
          <div className="card">
            <FaChartLine size={24} className="mb-2 text-blue-400" />
            Spend this Month <br /> **$682.5**
          </div>
          <div className="card">
            <FaTasks size={24} className="mb-2 text-yellow-400" />
            Sales <br /> **$682.5** (+32% from last month)
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts">
          <DashboardChart type="line" title="Total Spent" />
          <DashboardChart type="bar" title="Weekly Revenue" />
        </div>

        {/* Transactions Section */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2 text-white">Recent Transactions</h2>
          <TransactionsPage />
        </div>
      </div>

      {/* AiBot Dialog */}
      <TailwindDialog open={isOpen} onClose={handleClose}>
        <AiBot onClose={handleClose} />
      </TailwindDialog>
    </DashboardScreenWrap>
  );
};

export default HomePage;
