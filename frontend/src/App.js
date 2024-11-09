// src/App.js
import React from "react";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./Routes";

function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
