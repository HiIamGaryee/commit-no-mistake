import React, { useState } from "react";

// ✅ Move `mockData` to the top to ensure it's defined before being used
export const mockData = {
  data: {
    transfers: [
      {
        id: "0xabc123-1",
        from: "0xAnotherWalletAddress",
        to: "0xCoinbaseWalletAddress",
        value: "500000000000000000",
        timestamp: "1675560000",
      },
      {
        id: "0xdef456-2",
        from: "0xCoinbaseWalletAddress",
        to: "0xYetAnotherAddress",
        value: "1000000000000000000",
        timestamp: "1675550000",
      },
    ],
  },
  metrics: {
    totalBalance: "3.2 ETH ($9,870 USD)",
    totalTransactions: 178,
    successfulTransactions: 165,
    failedTransactions: 13,
    highestGasFeePaid: "$45.30",
    mostUsedDapp: "Uniswap",
    riskScore: "Moderate",
    avgTransactionTime: "14.2s",
    topConnections: ["Metamask", "Trust Wallet", "Phantom"],
  },
};

const TransactionsPage: React.FC = () => {
  const [transactions] = useState(mockData.data.transfers);
  const metrics = mockData.metrics; // Access the merged metrics

  // Function to format timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      {/* Dashboard Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Balance */}
        <div className="p-4 border border-gray-600 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Total Balance</h3>
          <p className="text-3xl font-bold text-green-400">{metrics.totalBalance}</p>
        </div>

        {/* Total Transactions */}
        <div className="p-4 border border-gray-600 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Total Transactions</h3>
          <p className="text-3xl font-bold">{metrics.totalTransactions}</p>
        </div>

        {/* Risk Score */}
        <div className="p-4 border border-gray-600 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Risk Score</h3>
          <p className={`text-3xl font-bold ${metrics.riskScore === "High" ? "text-red-400" : "text-yellow-400"}`}>
            {metrics.riskScore}
          </p>
        </div>
      </div>

      {/* Transactions Section */}
      <h1 className="text-3xl font-bold mb-4">Transaction History</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        {transactions.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="p-2">Tx ID</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Amount (ETH)</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2 text-blue-400 truncate">{tx.id}</td>
                  <td className="p-2 text-red-400 truncate">{tx.from}</td>
                  <td className="p-2 text-green-400 truncate">{tx.to}</td>
                  <td className="p-2">{parseFloat(tx.value) / 1e18} ETH</td>
                  <td className="p-2">{formatDate(tx.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
