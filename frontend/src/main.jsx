import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store"; 
import { ToastContainer } from "react-toastify";   
import "react-toastify/dist/ReactToastify.css";



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
      <ToastContainer position="top-right" autoClose={3000} /> 
    </Provider>
  </StrictMode>
);
