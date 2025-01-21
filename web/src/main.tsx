import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Configurando Rotas do site
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Transaction } from "./Pages/Transaction.tsx";

import { Register } from "./Pages/HistoryTransactionPage/Register.tsx";
import { HistoryTransaction } from "./Pages/HistoryTransactionPage/HistoryTransaction.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register-transaction",
    element: <Transaction />,
  },
  {
    path: "/history-transaction/register",
    element: <Register />,
  },
  {
    path: "/history-transaction",
    element: <HistoryTransaction />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
