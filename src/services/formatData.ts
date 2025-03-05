// /src/services/formatData.ts

import { Transfer, SubgraphData } from "./subgraph";

// Define the interface for the final formatted data
export interface FormattedData {
  data: {
    transfers: Transfer[];
  };
}

export function formatTransactionData(subgraphData: SubgraphData | null): FormattedData {
  if (!subgraphData || !subgraphData.transfers) {
    return { data: { transfers: [] } };
  }

  const transfers = subgraphData.transfers.map((tx) => ({
    id: tx.id,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    timestamp: tx.timestamp,
  }));

  return {
    data: {
      transfers,
    },
  };
}
