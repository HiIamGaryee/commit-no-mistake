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
import DashboardChart from "../components/DashboardChart";
import Sidebar from "../components/Sidebar";

const AI_REPORT_API_URL = "http://localhost:5000/generate-report";

// Mock AI Smart Report Data
const MOCK_REPORT = {
  overallHealthScore: 72,
  suspiciousFindings: [
    { text: "Unusual gas fees detected in last 24 hours", level: "warning" },
    { text: "Large transaction to unknown contract (0xAb12...D3f4)", level: "critical" },
    { text: "Potential phishing attempt detected", level: "critical" },
  ],
  securityTips: [
    "Consider using a hardware wallet for better security.",
    "Enable two-factor authentication on connected accounts.",
    "Check contract addresses before approving transactions.",
  ],
  aiInsights: [
    "Your wallet is in the top 10% of active traders.",
    "Your last transaction had a gas fee of $12.50.",
    "Potential security risk detected on contract 0xF23D...12A1.",
  ],
};

// Styled Components
const DashboardScreenWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0A0F0D;
  color: #C2FFB3;

  .dashboard-content {
    flex-grow: 1;
    padding: 24px;
    overflow-x: hidden;
  }

  .grid-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    ${media.lg`
      grid-template-columns: repeat(2, 1fr);
    `}
    ${media.md`
      grid-template-columns: repeat(1, 1fr);
    `}
  }

  .card {
    background: #0E1614;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
    color: #39FF14;
  }

  .ai-report {
    background: #081210;
    padding: 16px;
    border-radius: 8px;
    text-align: left;
    color: #C2FFB3;
  }

  .risk-score {
    color: yellow;
  }

  .ai-report-title {
    font-size: 18px;
    font-weight: bold;
    color: #39FF14;
  }

  .warning-text {
    color: yellow;
  }

  .critical-text {
    color: red;
    font-weight: bold;
  }

  .security-tips {
    color: #39FF14;
  }

  .ai-insights {
    color: #8FD499;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState(mockData.data.transfers);
  const [smartReport, setSmartReport] = useState(MOCK_REPORT);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reportLoading, setReportLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [reportError, setReportError] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      setIsAuthenticated(true);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setReportLoading(true);
        const response = await axios.post(AI_REPORT_API_URL, {
          walletAddress,
          transactions,
        });

        if (response.data && response.data.report) {
          setSmartReport(response.data.report);
        } else {
          console.warn("Received unexpected API response:", response.data);
          setSmartReport(MOCK_REPORT);
        }
      } catch (error) {
        console.error("AI Report API Error:", error);
        setReportError(true);
        setSmartReport(MOCK_REPORT);
      } finally {
        setReportLoading(false);
      }
    };

    if (walletAddress) fetchReport();
  }, [walletAddress, transactions]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("walletAddress");
    logout().then(() => navigate("/"));
  };

  return (
    <DashboardScreenWrap>
      <Sidebar />
      <div className="dashboard-content">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <FaUserCircle size={28} />
            <span className="text-lg font-semibold">
              {walletAddress || "Not Connected"}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleOpen}
              className="neon-button bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded"
            >
              Open AiBot
            </button>
            <FaGlobe size={20} />
            <FaBell size={20} />
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="neon-button bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
              >
                <FaSignOutAlt size={16} className="inline-block mr-1" />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* AI Smart Report & Dashboard Chart Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Dashboard Chart */}
          <DashboardChart type="bar" title="Transaction Overview" />

          {/* AI Smart Report */}
          <div className="ai-report p-6 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-bold mb-3 text-green-400">AI Smart Report</h2>
            <p className="text-lg font-semibold text-green-300">
              Overall Health Score: {smartReport.overallHealthScore} / 100
            </p>

            {/* Suspicious Findings */}
            <h3 className="text-lg font-bold mt-4 text-yellow-300">Suspicious Findings</h3>
            <ul className="list-disc ml-5 text-gray-300">
              {smartReport.suspiciousFindings.map((finding, index) => (
                <li key={index} className={`${finding.level === "critical" ? "text-red-400 font-bold" : "text-yellow-300"}`}>
                  {finding.text}
                </li>
              ))}
            </ul>

            {/* Security Tips */}
            <h3 className="text-lg font-bold mt-4 text-green-300">Security Tips</h3>
            <ul className="list-disc ml-5 text-green-400">
              {smartReport.securityTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>

            {/* AI Insights */}
            <h3 className="text-lg font-bold mt-4 text-blue-300">AI Insights</h3>
            <ul className="list-disc ml-5 text-blue-400">
              {smartReport.aiInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsPage />
      </div>
    </DashboardScreenWrap>
  );
};

export default HomePage;
