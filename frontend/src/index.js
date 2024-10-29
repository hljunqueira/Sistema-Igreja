import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import theme from "./theme"; // Importe o tema
import { ThemeProvider } from "@mui/material/styles"; // Importe o ThemeProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {" "}
      {/* Envolva sua aplicação com o ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
