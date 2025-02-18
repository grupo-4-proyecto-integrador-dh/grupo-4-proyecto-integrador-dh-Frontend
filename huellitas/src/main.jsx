import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./Styles/index.css";
import App from "./App.jsx";
import { Context } from "./Context/Context.jsx";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
root.render(
  <BrowserRouter>
    <Context>
      <App />
    </Context>
  </BrowserRouter>
);
