import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { Toaster } from "./components/ui/toaster.tsx";
import { SocketContextProvider } from "./context/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
      <Toaster />
    </RecoilRoot>
  </React.StrictMode>
);
