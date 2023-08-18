import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./components/Home";
import SmartForm from "./components/SmartForm";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/form" Component={SmartForm} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
