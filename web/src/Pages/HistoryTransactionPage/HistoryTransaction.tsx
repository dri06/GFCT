import axios from "axios";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  responsible: string;
  value: number;
  type: string;
  visible: boolean;
  receipt?: string;
  category:string;
  transactionDate: string
};

type FilterParams = {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  responsible?: string;
};

export const HistoryTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});

  const DownloadImage = ({ base64 }: { base64: string }) => {
    const handleDownload = () => {
      if (!base64) return;

      const base64Data = base64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const blobURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "comprovante.png";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);
    };

    return (
      <button
        onClick={handleDownload}
        className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm placeholder-gray-400"
      >
        Download Comprovante
      </button>
    );
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/transactions");
      const responseBalance = await axios.get(
        "http://localhost:3001/transactions/balance"
      );
      console.log(response)

      setBalance(responseBalance.data.saldo);
      setTransactions(response.data);
      console.log(balance)
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/transactions/filter", {
        params: filters,
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao filtrar transações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/transactions/${id}`);
      setTransactions((prev) => prev?.filter((transaction) => transaction.id !== id) || null);
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="w-full h-full p-3">Nenhuma transação encontrada.</div>;
  }

  return (
    <main className="w-full h-screen p-5 flex flex-col gap-5">
      <h1 className="text-7xl font-semibold">Transações</h1>

      {/* Saldo Total */}
      <div className="w-max h-max items-start p-3 flex flex-col border border-slate-300 rounded-md bg-gray-100">
        <h1 className="text-3xl font-semibold">Saldo Total</h1>
        <span className="text-2xl">R$ {balance?.toFixed(2)}</span>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex flex-col">
            <span>Adicione o Tipo</span>
        <input
          type="text"
          name="type"
          placeholder="Tipo"
          className="p-2 border border-gray-300 rounded-md"
          onChange={handleFilterChange}
        />
        </div>
        <div className="flex flex-col">
            <span>Adicione a Categoria</span>
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          className="p-2 border border-gray-300 rounded-md"
          onChange={handleFilterChange}
        />
        </div>
       <div className="flex flex-col">
        <span>Adicione a Data</span>
       <input
          type="date"
          name="startDate"
          className="p-2 border border-gray-300 rounded-md"
          onChange={handleFilterChange}
        />
       </div>
       <div className="flex flex-col">
       <span>Adicione o Responsável</span>
        <input
          type="text"
          name="responsible"
          placeholder="Responsável"
          className="p-2 border border-gray-300 rounded-md"
          onChange={handleFilterChange}
        />
       </div>
        <button
          onClick={applyFilters}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Lista de Transações */}
      <ul className="w-full h-max grid grid-cols-4 gap-2">
        {transactions.map((transaction, i) =>
          transaction.visible ? (
            <div
              key={transaction.id}
              className="w-[300px] h-max gap-3 p-2 flex flex-col border border-slate-300 rounded-md"
            >
              <span className="text-3xl">{i + 1}</span>
              <li className="flex flex-col">
                <span>Responsável: {transaction.responsible}</span>
                <span>Valor da Transação: R$ {transaction.value.toFixed(2)}</span>
                <span>Tipo da Transação: {transaction.type}</span>
                <span>Categoria: {transaction.category}</span>
                <span>Data: {new Date(transaction.transactionDate).toLocaleDateString()}</span>



              </li>

              <div className="flex gap-2 flex-col items-start">
                {transaction.receipt ? (
                  <DownloadImage base64={transaction.receipt} />
                ) : (
                  <button
                    disabled
                    className="p-2 border border-slate-300 rounded-md bg-gray-300 text-sm placeholder-gray-400"
                  >
                    Comprovante Indisponível
                  </button>
                )}
                <button className="p-2 bg-red-500 rounded-lg text-white" onClick={() => handleDeleteTransaction(transaction.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ) : null
        )}
      </ul>
    </main>
  );
};
