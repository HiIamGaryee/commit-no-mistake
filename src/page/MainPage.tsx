import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { usePrivy } from "@privy-io/react-auth";
import walletImg from "../assets/CommitNoMistake.png";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

function MainPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCoinbaseConnected, setIsCoinbaseConnected] = useState(false);

  // Get Privy authentication state
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Check if user is authenticated and redirect to /home
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      localStorage.setItem("loginMethod", "Privy");
      localStorage.setItem("walletAddress", user.wallet.address);
      navigate("/home");
    }
  }, [authenticated, user, navigate]);

  // Initialize WalletConnect
  const initializeWalletConnect = useCallback(() => {
    const newConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (!newConnector.connected) {
      newConnector.createSession();
    }

    newConnector.on("connect", (error: Error | null, payload: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Wallet connected:", payload);
        setIsConnected(true);
        localStorage.setItem("loginMethod", "WalletConnect");
        localStorage.setItem("walletAddress", "0xWalletConnectAddress"); // Update dynamically
        navigate("/home");
      }
    });

    newConnector.on("disconnect", (error: Error | null) => {
      if (error) {
        console.error(error);
      }
      setIsConnected(false);
    });
  }, [navigate]);

  // Initialize Coinbase Wallet
  const initializeCoinbaseWallet = useCallback(() => {
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "Your App Name",
        appLogoUrl: "https://example.com/logo.png",
      });

      const ethereum = coinbaseWallet.makeWeb3Provider({
        jsonRpcUrl: "https://ethereum-rpc.publicnode.com",
        chainId: 1,
        options: "all",
      } as any);

      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          const walletAccounts = accounts as string[];
          console.log("Coinbase Wallet connected:", walletAccounts[0]);
          setIsCoinbaseConnected(true);
          localStorage.setItem("loginMethod", "Coinbase");
          localStorage.setItem("walletAddress", walletAccounts[0]);
          navigate("/home");
        })
        .catch((error) => {
          console.error("Failed to connect Coinbase Wallet:", error);
          setIsCoinbaseConnected(false);
        });
    } catch (error) {
      console.error("Failed to initialize Coinbase Wallet:", error);
      setIsCoinbaseConnected(false);
    }
  }, [navigate]);

  // Handle Login Actions
  const handleLogin = async (type: string) => {
    console.log("Logging in as:", type);
    if (type === "walletconnect") {
      initializeWalletConnect();
    } else if (type === "privy") {
      if (authenticated) {
        logout();
        localStorage.removeItem("loginMethod");
        localStorage.removeItem("walletAddress");
      } else {
        await login();
      }
    } else if (type === "coinbase") {
      initializeCoinbaseWallet();
    }
    setShowDialog(false);
  };

  // Open & Close Dialog
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  return (
    <div
  className="h-full bg-[#0A0F0D] text-[#C2FFB3] flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('/CTCLandingPage.png')" }}
  >

      {/* Page Content */}
      <div className="absolute top-1/3 left-16 text-left w-1/2">
  <h1 className="text-7xl font-bold text-white">
    Wallet Analytics Platform
  </h1>
  <p className="text-2xl text-white mt-4">
  Log in with your wallet to access and visualize your transaction
  history with detailed graphs.
</p>

        {/* Connect Wallet Button - Moved Below the Description */}
        <button
          onClick={openDialog}
          className="mt-6 px-6 py-3 bg-[#39FF14] text-black text-lg font-bold rounded-md hover:bg-[#2FE50E] transition duration-200"
        >
          Connect Wallet
        </button>
      </div>

      {/* Dialog for Login Options */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeDialog}
        >
          <div
            className="bg-[#081210] p-6 rounded-lg text-[#C2FFB3] w-[350px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Connect Wallet Now
            </h2>
            <div className="flex justify-center">
              <img
                src={walletImg}
                alt="Wallet"
                className="w-24 h-24 mb-4 object-contain"
              />
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleLogin("privy")}
                className="px-4 py-2 bg-[#39FF14] text-black font-semibold rounded-md hover:bg-[#2FE50E] transition duration-200"
              >
                {authenticated ? "Logout from Privy" : "Login with Privy"}
              </button>
              <button
                onClick={() => handleLogin("walletconnect")}
                className="px-4 py-2 bg-[#39FF14] text-black font-semibold rounded-md hover:bg-[#2FE50E] transition duration-200"
              >
                {authenticated
                  ? "Logout from WalletConnect"
                  : "Login with WalletConnect"}
              </button>
              <button
                onClick={() => handleLogin("coinbase")}
                className="px-4 py-2 bg-[#39FF14] text-black font-semibold rounded-md hover:bg-[#2FE50E] transition duration-200"
              >
                {authenticated ? "Logout from Coinbase" : "Login with Coinbase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
