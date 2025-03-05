import axios from "axios";
import OpenAI from "openai";

// Mock Data (Use this while waiting for real API data)
const MOCK_WALLET_DATA = {
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

// Fetch wallet data from The Graph API (returns mock data if API fails)
export const fetchWalletData = async (walletAddress: string) => {
    try {
        const GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/your-subgraph"; // Replace with actual subgraph URL

        const query = {
            query: `
        {
          wallet(id: "${walletAddress}") {
            transactions {
              id
              value
              gasUsed
              timestamp
            }
          }
        }
      `,
        };

        const response = await axios.post(GRAPH_API_URL, query);
        return response.data.data.wallet || MOCK_WALLET_DATA;
    } catch (error) {
        console.warn("Graph API request failed, using mock data instead.");
        return MOCK_WALLET_DATA; // Return mock data if API call fails
    }
};

// Generate AI Smart Report (Same logic as before)
export const generateSmartReport = async (walletData: any) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.REACT_APP_AIBOT_API_KEY, // Load from .env
            dangerouslyAllowBrowser: true, // Allow OpenAI to run in frontend
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content:
                        "Analyze this wallet's transaction history and generate a financial security report. Assign security marks, detect suspicious activities, and provide AI-driven recommendations.",
                },
                {
                    role: "user",
                    content: JSON.stringify(walletData),
                },
            ],
        });

        return response.choices[0]?.message?.content || "No response from AI.";
    } catch (error) {
        console.error("Error generating AI report:", error);
        return "Error generating report.";
    }
};
