import React, { useEffect, useState, ReactElement } from "react";
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
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col">
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

      {/* Smart Report Section - Modified UI */}
      {isAuthenticated && (
        <div className="p-6 bg-gray-900 rounded-lg shadow-md mt-6 mx-6">
          <h2 className="text-2xl font-semibold mb-3 text-white">
            Smart Report
          </h2>

          {reportLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="bg-gray-800 p-5 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Health Score */}
                <div className="p-4 border border-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Overall Health Score
                  </h3>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      smartReport.overallHealthScore > 70
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {smartReport.overallHealthScore} / 100
                  </p>
                </div>

                {/* Suspicious Findings */}
                <div className="p-4 border border-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Suspicious Findings
                  </h3>
                  {smartReport.suspiciousFindings.length > 0 ? (
                    <ul className="list-disc ml-5 text-gray-300">
                      {smartReport.suspiciousFindings.map((finding, index) => (
                        <li
                          key={index}
                          className={`${
                            finding.level === "critical"
                              ? "text-red-400 font-bold"
                              : "text-yellow-300"
                          }`}
                        >
                          {finding.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">
                      No suspicious activity detected.
                    </p>
                  )}
                </div>

                {/* Security Tips */}
                <div className="p-4 border border-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Security Tips
                  </h3>
                  {smartReport.securityTips.length > 0 ? (
                    <ul className="list-disc ml-5 text-green-300">
                      {smartReport.securityTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">
                      No additional security recommendations.
                    </p>
                  )}
                </div>

                {/* AI Insights */}
                <div className="p-4 border border-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-300">
                    AI Insights
                  </h3>
                  {smartReport.aiInsights.length > 0 ? (
                    <p className="text-gray-300">{smartReport.aiInsights[0]}</p>
                  ) : (
                    <p className="text-gray-400">No AI insights available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transactions Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
        <TransactionsPage />
      </div>
    </div>
  );
};

export default HomePage;
