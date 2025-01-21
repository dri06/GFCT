import { useState } from "react";
import axios from "axios";

export const Transaction = () => {
  const [formData, setFormData] = useState({
    value: 0,
    transactionDate: "",
    type: "entrada",
    responsible: "",
    category: "contribuicao",
    receipt: "",
  });
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file); // Lê o arquivo e converte para base64
    });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]; // Obtém o primeiro arquivo selecionado, se existir
  //   if (file) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       receipt: file, // Armazena o arquivo no estado
  //     }));
  //   }
  // };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const base64 = await convertFileToBase64(file); // Converte para base64
        setFormData((prev) => ({
          ...prev,
          receipt: base64, // Armazena o base64 no estado
        }));
        console.log(base64)
      } catch (error) {
        console.error("Erro ao converter o arquivo para base64", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Converte os dados para envio
    const submissionData = {
      ...formData,
      value: Number(formData.value),
      transactionDate: formData.transactionDate,
    };
    console.log(submissionData);
    

    try {
      const response = await axios.post(
        "http://localhost:3001/transactions-create",
        submissionData
      );
      alert("Transação criada com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      alert("Erro ao criar transação.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center font-primary w-full h-screen">
      <form
        className="w-1/4 max-h-2/3 border rounded-2xl p-4 flex flex-col items-start gap-3"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold">Registro de Transações</h1>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Valor da Transação</label>
          <input
            type="number"
            name="value"
            placeholder="Valor"
            min="0"
            value={formData.value}
            onChange={handleInputChange}
            className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Data da Transação</label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleInputChange}
            className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Tipo da Transação</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Responsável da Transação</label>
          <input
            type="text"
            name="responsible"
            value={formData.responsible}
            onChange={handleInputChange}
            className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Categoria da Transação</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          >
            <option value="contribuicao">Contribuições</option>
            <option value="materiais">Materiais</option>
            <option value="eventos">Eventos</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Comprovante da Transação</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border border-slate-300 rounded-md bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
          />
        </div>

        <button
          type="submit"
          className="p-3 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150"
        >
          Registrar
        </button>
      </form>
    </main>
  );
};
