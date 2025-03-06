import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { media } from "../style/theme/theme";
import { FaUserCircle, FaBell, FaGlobe, FaSignOutAlt } from "react-icons/fa";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TransactionsPage, { mockData } from "./TransactionsPage";
import TailwindDialog from "../components/TailwindDialog";
import AiBot from "../components/AiBots";

const AI_REPORT_API_URL = "http://localhost:5000/generate-report";

// ✅ Use mockData.metrics for Dashboard Overview
const MOCK_REPORT = {
  overallHealthScore: Math.floor(Math.random() * 100) + 1,
  suspiciousFindings: mockData.metrics.riskScore === "High" ? [
    { text: "Large transaction to unknown contract (0xAb12...D3f4)", level: "critical" },
    { text: "Potential phishing attempt detected", level: "critical" },
  ] : [
    { text: "Unusual gas fees detected", level: "warning" },
    { text: "High transaction volume detected", level: "info" },
  ],
  securityTips: [
    "Consider using a hardware wallet",
    "Enable two-factor authentication",
    "Check contract addresses before approving transactions",
  ],
  aiInsights: [
    "Your wallet is in the top 10% of active traders.",
    "Your last transaction had a gas fee of $12.50.",
  ],
};

// ✅ Styled Dashboard Layout
const DashboardScreenWrap = styled.div`
  overflow-x: hidden;
  padding: 24px;

  .dboard-blocks-row {
    display: grid;
    gap: 20px;

    &.first-row {
      grid-template-columns: repeat(2, 1fr);
      ${media.xl`
        grid-template-columns: repeat(1, 1fr);
      `}
    }

    &.second-row {
      grid-template-columns: 2fr 400px 1fr;
      ${media.xxxl`
        grid-template-columns: repeat(8, 1fr);
        & > div {
          &:nth-child(1) { grid-column: 1 / 5; }
          &:nth-child(2) { grid-column: 5 / 9; }
        }
      `}
    }
  }

  .dashboard-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    ${media.md`
      grid-template-columns: repeat(2, 1fr);
    `}

    ${media.sm`
      grid-template-columns: repeat(1, 1fr);
    `}

    .metric-card {
      background: #2a2a2a;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
  }

  .home-content {
    background: #222;
    color: white;
    padding: 20px;
    border-radius: 8px;
  }

  .neon-button {
    background-color: #6b46c1;
    color: white;
    padding: 8px 16px;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
      background-color: #553c9a;
    }
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
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FaUserCircle size={28} />
          <span className="text-lg font-semibold">
            {walletAddress || "Not Connected"}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleOpen} className="neon-button px-4 py-1 rounded">
            Open AiBot
          </button>
          <FaGlobe size={20} />
          <FaBell size={20} />
          {authenticated && (
            <button onClick={logout} className="neon-button bg-red-600 px-4 py-1 rounded">
              <FaSignOutAlt size={16} className="inline-block mr-1" />
              Logout
            </button>
          )}
        </div>
        <TailwindDialog open={isOpen} onClose={handleClose}>
          <AiBot onClose={handleClose} />
        </TailwindDialog>
      </div>

      {/* Dashboard Metrics */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-300">Total Balance</h3>
          <p className="text-3xl font-bold text-green-400">{mockData.metrics.totalBalance}</p>
        </div>
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-300">Total Transactions</h3>
          <p className="text-3xl font-bold">{mockData.metrics.totalTransactions}</p>
        </div>
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-300">Risk Score</h3>
          <p className={`text-3xl font-bold ${mockData.metrics.riskScore === "High" ? "text-red-400" : "text-yellow-400"}`}>
            {mockData.metrics.riskScore}
          </p>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
        <TransactionsPage />
      </div>
    </DashboardScreenWrap>
  );
};

export default HomePage;
