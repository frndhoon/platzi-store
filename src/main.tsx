import "@/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";

// 브라우저 DOM과 React 사이의 진입점 역할
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
