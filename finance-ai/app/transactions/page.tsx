import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TransactionsPage = async () => {
  const {userId} = await auth();
  // Se tentar acessar a página de transação sem estar logado, então será redirecionado para a página de login
  if (!userId) {
    redirect("/login")
  }
  // Acessar as transações no meu banco de dados
  const transactions = await db.transaction.findMany({
    where: {
      userId,
    }
  });
  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        {/*TÍTULO E BOTÃO*/}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton />
        </div>

        <DataTable columns={transactionColumns} data={transactions} />
      </div>
    </>
  );
};

export default TransactionsPage;
