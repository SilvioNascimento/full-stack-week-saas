// Avisando ao Next.js que este código é um server actions, responsável por se conectar no banco de dados
"use server";
import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface AddTransactionParams {
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const addTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autorizado!");
  }

  await db.transaction.create({
    data: { ...params, userId },
  });
  revalidatePath("/transactions");
};
