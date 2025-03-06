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

// Mock Report Data for UI Testing
const MOCK_REPORT = {
  overallHealthScore: 75,
  suspiciousFindings: [
    { text: "Unusual gas fees detected", level: "warning" },
    { text: "Large transaction to unknown contract", level: "critical" },
  ],
  securityTips: [
    "Consider using a hardware wallet",
    "Enable two-factor authentication",
  ],
  aiInsights: ["Your wallet has interacted with a high-risk contract."],
};

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
          &:nth-child(3) { grid-column: 1 / 4; }
          &:nth-child(4) { grid-column: 4 / 9; }
          &:nth-child(5) { grid-column: 1 / 4; min-width: 400px; }
          &:nth-child(6) { grid-column: 4 / 9; }
        }
      `}

      ${media.lg`
        & > div {
          &:nth-child(1) { grid-column: 1 / 9; }
          &:nth-child(2) { grid-column: 1 / 4; }
          &:nth-child(3) { grid-column: 4 / 9; }
          &:nth-child(4) { grid-column: 1 / 9; }
          &:nth-child(5) { grid-column: 1 / 5; min-width: 400px; }
          &:nth-child(6) { grid-column: 5 / 9; }
        }
      `}

      ${media.md`
        & > div {
          grid-column: 1 / 9 !important;
        }
      `}
    }

    ${media.xxxl`
      gap: 12px;
    `}
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
  const [transactions, setTransactions] = useState(mockData.data.transfers);
  const [smartReport, setSmartReport] = useState(MOCK_REPORT);
  const [reportError, setReportError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reportLoading, setReportLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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
        const reportResponse = await axios.post(AI_REPORT_API_URL, {
          walletAddress,
          transactions,
        });
        setSmartReport(reportResponse.data.report);
      } catch (error) {
        console.error("AI Report API Error:", error);
        setReportError(true);
        setSmartReport(MOCK_REPORT);
      } finally {
        setReportLoading(false);
      }
    };

    fetchReport();
  }, [walletAddress]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("walletAddress");
    logout().then(() => navigate("/"));
  };

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
        <TailwindDialog open={isOpen} onClose={handleClose}>
          <AiBot onClose={handleClose} />
        </TailwindDialog>
      </div>

      {/* Smart Report Section */}
      {isAuthenticated && (
        <div className="p-6 bg-gray-900 rounded-lg shadow-md mt-6 mx-6">
          <h2 className="text-2xl font-semibold mb-3 text-white">Smart Report</h2>

          {reportLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="bg-gray-800 p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-300">Overall Health Score</h3>
              <p className="text-3xl font-bold mt-2 text-green-400">
                {smartReport.overallHealthScore} / 100
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transactions Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
        <TransactionsPage />
      </div>
    </DashboardScreenWrap>
  );
};

export default HomePage;
