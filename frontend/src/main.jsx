import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store"; 

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

console.log(typeof(apiUrl));

console.log(`API URL: ${apiUrl}`);
console.log(`Client ID: ${clientId}`);
console.log(`Client Secret: ${clientSecret}`);



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
