// src/App.js
import React from "react";
import { CssBaseline } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import AppRoutes from "./Routes";

function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <Navigation />
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
