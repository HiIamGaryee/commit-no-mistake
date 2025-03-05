import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const PRIVY_APP_ID = process.env.REACT_APP_PRIVY_APP_ID;

if (!PRIVY_APP_ID) {
  console.error("PRIVY_APP_ID is missing. Check your .env file.");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/logo192.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
