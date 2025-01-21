import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import path from "path";
import fs from "fs/promises"; 
const prisma = new PrismaClient();
const app = fastify();

const loginUser = "3inf"
const passwordUser = "3infomat"
//
app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});


type TransactionInput = {
  value: number;
  transactionDate: string;
  type: "entrada" | "saida";
  responsible: string;
  category: string;
  receipt?: string; 
};


//
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { visible: true },
      orderBy: { transactionDate: "desc" },
    });
    res.status(200).send(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});


app.get("/transactions/balance", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { visible: true },
    });

    const saldo = transactions.reduce(
      (acc, transaction) =>
        transaction.type === "entrada"
          ? acc + transaction.value
          : acc - transaction.value,
      0
    );

    res.status(200).send({ saldo });
    console.log(saldo)
  } catch (error) {
    console.error("Erro ao calcular saldo:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});


app.get("/transactions/filter", async (req, res) => {
  const { type, category, startDate, responsible } = req.query as {
    type?: string;
    category?: string;
    startDate?: string;
  
    responsible?: string;
  };

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        visible: true,
        type: type || undefined,
        category: category || undefined,
        responsible: responsible || undefined,
        transactionDate:
          startDate
            ? { gte: new Date(startDate)}
            : undefined,
      },
    
    });
    console.log(transactions, req.query)
    res.status(200).send(transactions);
  } catch (error) {
    console.error("Erro ao filtrar transações:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});


app.get("/transactions/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || !transaction.visible) {
      return res.status(404).send({ error: "Transação não encontrada." });
    }

    res.status(200).send(transaction);
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});


app.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  console.log(id)

  // const { senha } = req.body as { senha: string };

  // if (senha !== passwordUser) {
  //   return res.status(401).send({ error: "Senha incorreta." });
  // }

  try {
    await prisma.transaction.update({
      where: { id },
      data: { visible: false },
    });
    res.status(200).send({ message: "Transação marcada como invisível." });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});

app.post("/login", async (req, res) => {
  const { login } = req.body as { login: string };
  const { password } = req.body as { password: string };
 console.log(password !== passwordUser ? "Falso" : "Sim")


  if (password !== passwordUser || login !== loginUser) {
    console.log(password, login)
    return res.status(401).send({ error: "Senha incorreta." });
  } else {
    console.log(password, login)
    return res.status(200).send({sucess: "Senha correta"})
  }


});


app.put("/transactions/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  const { senha, ...updateData } = req.body as TransactionInput & {
    senha: string;
  };

  if (senha !== passwordUser) {
    return res.status(401).send({ error: "Senha incorreta." });
  }

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.status(200).send(updatedTransaction);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});


app.post("/transactions-create", async (req, res) => {
  const { value, transactionDate, type, responsible, category } = req.body as TransactionInput;

  
  const file = req.body.receipt; 


  console.log(file, req.body);
  
  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        value,
        transactionDate: new Date(transactionDate),
        type,
        responsible,
        category,
        receipt: file || "", 
      },
    });

    res.status(201).send(newTransaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
});


app.listen({ port: 3001 }, () => {
  console.log("Servidor rodando na porta 3001");
});
