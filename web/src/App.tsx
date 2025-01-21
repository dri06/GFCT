

import "./App.css";
import { Link } from "react-router-dom";


function App() {

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-2">
        <Link to={"/register-transaction"} className="p-3 border rounded-md text-5xl">Registrar Transação</Link>
        <Link to={"/history-transaction/register"} className="p-3 border rounded-md text-5xl">Ver Hístorico das Transações</Link>
      </div>
 
    </main>
  );
}

export default App;
