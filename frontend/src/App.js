import React from "react";
import { CssBaseline } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import Routes from "./Routes";

function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <Navigation />
        <Routes />
      </div>
    </>
  );
}

export default App;
