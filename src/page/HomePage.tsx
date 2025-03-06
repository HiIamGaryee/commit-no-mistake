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
import DashboardChart from "../components/DashboardChart";  // ✅ Fixed import
import Sidebar from "../components/Sidebar";  // ✅ Fixed import

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
  background: #0b1437;
  color: white;

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
    background: #1b254b;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
  }

  .ai-report {
    background: #111c44;
    padding: 16px;
    border-radius: 8px;
    text-align: left;
    color: white;
  }

  .risk-score {
    color: yellow;
  }

  .ai-report-title {
    font-size: 18px;
    font-weight: bold;
    color: #4caf50;
  }

  .warning-text {
    color: yellow;
  }

  .critical-text {
    color: red;
    font-weight: bold;
  }

  .security-tips {
    color: #4caf50;
  }

  .ai-insights {
    color: #a3aed0;
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
  const [reportError, setReportError] = useState(false);  // ✅ Fixed missing state

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
          setSmartReport(MOCK_REPORT); // Use mock data if API fails
        }
      } catch (error) {
        console.error("AI Report API Error:", error);
        setReportError(true);  // ✅ Fixed incorrect function call
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

        {/* Dashboard Grid */}
        <div className="grid-layout mt-6">
          {/* AI Smart Report */}
          {isAuthenticated && !reportLoading && (
            <div className="ai-report">
              <h3 className="ai-report-title">AI Smart Report</h3>
              <p className="text-xl">
                **Overall Health Score:** {smartReport.overallHealthScore} / 100
              </p>

              <h4 className="warning-text mt-4">Suspicious Findings</h4>
              <ul>
                {smartReport.suspiciousFindings.map((finding, index) => (
                  <li key={index} className={finding.level === "critical" ? "critical-text" : "warning-text"}>
                    {finding.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DashboardChart type="bar" title="Transaction Overview" />  {/* ✅ Fixed missing props */}
        <TransactionsPage />
      </div>
    </DashboardScreenWrap>
  );
};

export default HomePage;
