import React, { useState } from "react";

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
};

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<
    { id: string; from: string; to: string; value: string; timestamp: string }[]
  >(mockData.data.transfers);

  // Function to format timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
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
              {transactions.map(
                (
                  tx: {
                    id: string;
                    from: string;
                    to: string;
                    value: string;
                    timestamp: string;
                  },
                  index: number
                ) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2 text-blue-400 truncate">{tx.id}</td>
                    <td className="p-2 text-red-400 truncate">{tx.from}</td>
                    <td className="p-2 text-green-400 truncate">{tx.to}</td>
                    <td className="p-2">{parseFloat(tx.value) / 1e18} ETH</td>
                    <td className="p-2">{formatDate(tx.timestamp)}</td>
                  </tr>
                )
              )}
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
