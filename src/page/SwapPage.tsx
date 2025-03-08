import React, { useEffect, useState } from "react";
import { BrowserProvider, parseEther, Contract } from "ethers";
import { tokenSaleABI } from "abi/tokenSaleABI";

// Your deployed TokenSale contract address
const TOKEN_SALE_CONTRACT_ADDRESS =
  "0x20cF02fc3ebf01189b9dC384Db5927f7B4E70B6A";

function SwapPage() {
  const [storedWalletAddress, setStoredWalletAddress] = useState("");
  const [swapSuccess, setSwapSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // On mount, load the wallet address from localStorage
  useEffect(() => {
    const addr = localStorage.getItem("walletAddress") || "";
    setStoredWalletAddress(addr);
  }, []);

  /**
   * Attempt to do a transaction from the localStorage address
   * by passing an override { from: storedWalletAddress }.
   *
   * If Metamask is not actually set to that address, it will likely fail or
   * ignore the override. There's no guaranteed way to forcibly change the
   * 'from' in the injected provider.
   */
  const handleBuyTokens = async () => {
    setSwapSuccess("");
    setErrorMessage("");
    try {
      if (!window.ethereum) {
        throw new Error(
          "No Ethereum browser wallet found. Please install Metamask."
        );
      }
      if (!storedWalletAddress) {
        throw new Error(
          "No walletAddress in localStorage. Please connect on the home page."
        );
      }

      // Create an Ethers v6 provider and signer from Metamask
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const saleContract = new Contract(
        TOKEN_SALE_CONTRACT_ADDRESS,
        tokenSaleABI,
        signer
      );

      /**
       * Attempt to pass { from: storedWalletAddress } as an override.
       * Many providers ignore this if it doesn't match the active account in Metamask.
       */
      const tx = await saleContract.buyTokens({
        from: storedWalletAddress, // Attempt an override
        value: parseEther("0.00001"),
      });
      await tx.wait();

      setSwapSuccess("Successfully bought 100 tokens!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Transaction failed");
    }
  };

  const handleBurnTokens = async () => {
    setSwapSuccess("");
    setErrorMessage("");
    try {
      if (!window.ethereum) {
        throw new Error(
          "No Ethereum browser wallet found. Please install Metamask."
        );
      }
      if (!storedWalletAddress) {
        throw new Error(
          "No walletAddress in localStorage. Please connect on the home page."
        );
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const saleContract = new Contract(
        TOKEN_SALE_CONTRACT_ADDRESS,
        tokenSaleABI,
        signer
      );

      const tx = await saleContract.burnTokens({
        from: storedWalletAddress, // Attempt override
      });
      await tx.wait();

      setSwapSuccess("Successfully burned 5 tokens!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Burn failed");
    }
  };

  return (
    <div className="bg-[#0A0F0D] min-h-screen text-[#C2FFB3] p-6">
      <h2 className="text-3xl font-bold mb-6">Swap Page</h2>

      {/* Show the stored wallet address */}
      <p className="mb-4">
        Using stored address:{" "}
        {storedWalletAddress || "No address found in localStorage"}
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {/* Buy Button */}
        <button
          onClick={handleBuyTokens}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Buy 100 tokens (costs 0.00001 ETH)
        </button>

        {/* Burn Button */}
        <button
          onClick={handleBurnTokens}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Burn 5 tokens
        </button>
      </div>

      {/* Success / Error Messages */}
      {swapSuccess && (
        <div className="mt-4 bg-green-700 text-white p-3 rounded">
          {swapSuccess}
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 bg-red-700 text-white p-3 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default SwapPage;
