import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "styled-components";
import { theme } from "./style/theme/theme"; // Ensure the correct path
import GlobalStyles from "./style/GlobalStyles"; // Ensure this file exists

const PRIVY_APP_ID = process.env.REACT_APP_PRIVY_APP_ID; // Ensure ENV variable

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
      <ThemeProvider theme={theme}>
        <GlobalStyles /> {/* ✅ Ensures global styles are applied */}
        <App />
      </ThemeProvider>
    </PrivyProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();