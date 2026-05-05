import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const spaPath = sessionStorage.getItem("spaPath");
if (spaPath) {
  sessionStorage.removeItem("spaPath");
  window.history.replaceState(null, "", spaPath);
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
