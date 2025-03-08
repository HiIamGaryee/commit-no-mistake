export const tokenSaleABI = [
    // Minimal ABI for the functions we actually call:
    "function buyTokens() payable",
    "function burnTokens()",
    "function rate() view returns (uint256)",
    "function owner() view returns (address)",
    "function withdraw()"
  ];
  