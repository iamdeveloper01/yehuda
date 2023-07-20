import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Machine } from "./pages";
import "./index.css";
import { SmartForm } from "./components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Machine} />
        <Route path="/form" Component={SmartForm} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
