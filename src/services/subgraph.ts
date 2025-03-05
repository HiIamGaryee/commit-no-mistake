// /src/services/subgraph.ts

// Define TypeScript interfaces for the data structure
export interface Transfer {
    id: string;
    from: string;
    to: string;
    value: string;
    timestamp: string;
  }
  
  export interface SubgraphData {
    transfers: Transfer[];
  }
  
  export async function fetchTransactions(walletAddress: string): Promise<SubgraphData | null> {
    // GraphQL query to fetch transfers by sender address.
    const query = `
      query($account: String!) {
        transfers(where: { from: $account }) {
          id
          from
          to
          value
          timestamp
        }
      }
    `;
  
    // Ensure the wallet address is lowercase (if required by your subgraph)
    const variables = { account: walletAddress.toLowerCase() };
  
    // Replace with your subgraph URL using the provided details:
    // Subgraph Owner: 0xA1e9-7e3F93
    // Subgraph Slug: committestgroan
    const subgraphUrl = "https://api.thegraph.com/subgraphs/name/0xA1e9-7e3F93/committestgroan";
  
    try {
      const response = await fetch(subgraphUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const result = await response.json();
  
      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        return null;
      }
  
      console.log("Subgraph response:", result);
      return result.data as SubgraphData;
    } catch (error) {
      console.error("Error fetching transactions from subgraph", error);
      return null;
    }
  }
  