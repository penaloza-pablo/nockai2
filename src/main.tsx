import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

// Validar si los outputs contienen valores placeholder
if (outputs.auth?.user_pool_client_id === "placeholder" || 
    outputs.auth?.user_pool_id?.includes("placeholder")) {
  console.error("⚠️ ERROR: amplify_outputs.json contiene valores placeholder.");
  console.error("Para desarrollo local, necesitas ejecutar el sandbox de Amplify:");
  console.error("  npm run sandbox");
  console.error("");
  console.error("El sandbox debe ejecutarse en una terminal separada antes de iniciar el servidor de desarrollo.");
}

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>

);
