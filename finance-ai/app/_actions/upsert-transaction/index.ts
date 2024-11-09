// Avisando ao Next.js que este código é um server actions, responsável por se conectar no banco de dados
"use server";
import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autorizado!");
  }

  if (params.id) {
    // Usar upsert se o ID estiver definido
    await db.transaction.upsert({
      where: { id: params.id },
      update: { ...params, userId },
      create: { ...params, userId },
    });
  } else {
    // Usar create se o ID não estiver definido
    await db.transaction.create({
      data: { ...params, userId },
    });
  }
  
  revalidatePath("/transactions");
};
