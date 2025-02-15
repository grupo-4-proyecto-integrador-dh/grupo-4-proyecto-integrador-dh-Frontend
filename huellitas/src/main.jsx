import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./Styles/index.css";
import App from "./App.jsx";
import Context from "./Context/Context.jsx";
/*
const root = createRoot(document.getElementById("root"));
root.render(<App />);
root.render(
  <BrowserRouter>
    <Context>
      <App />
    </Context>
  </BrowserRouter>
);
*/

/****
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 Importa BrowserRouter
import App from "./App";
import "./index.css"; // Asegúrate de que este archivo exista o coméntalo si da error

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/">  {/* 👈 Aquí envolvemos App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
