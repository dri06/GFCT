import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [passwordIncorrect, setPasswordIncorrect] = useState(false)
    
    const navigate = useNavigate(); 

    const handleLoginButton = async(e: any) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        try {
            const response = await axios.post("http://localhost:3001/login", {
                password,
                login
            })
            if (response.status === 200){
                navigate("/history-transaction")
            }
            
        } catch(error) {
            console.error("Erro ao fazer login:", error);
            setPasswordIncorrect(true)
        }
       
    }
  return (
    <main className="flex items-center justify-center w-full h-screen">
      <form className="w-1/3 h-2/3 border rounded-md border-zinc-100 shadow-sm p-3 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
            {passwordIncorrect ?<div className="w-full bg-red-400 text-white p-3 text-center">
                Senha incorreta
            </div> : ""}
          <h1 className="text-4xl font-semibold">Login</h1>
          <p>
            Faça o login para visualizar o hístorico de transações da turma.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <span>Insira o login</span>
            <input
              className="p-2 outline-none border rounded-md"
              type="text"
              placeholder="E-mail"
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>Insira a senha</span>
            <input
              className="p-2 outline-none border rounded-md"
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button className="text-white bg-blue-500 p-3 rounded-md" onClick={handleLoginButton}>
          Entrar
        </button>
      </form>
    </main>
  );
};
