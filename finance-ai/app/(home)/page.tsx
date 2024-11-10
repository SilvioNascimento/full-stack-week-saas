import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  // Verifica se o mês que foi inserido no query params está com formato correto ou se não foi fornecido
  const monthIsInvalid = !month || !isMatch(month, 'MM')

  // Caso o mês fornecido for inválido, redireciona para o dashboard no mês de Janeiro
  if(monthIsInvalid) {
    redirect('/?month=01')
  }
  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
      </div>

      <SummaryCards month={month} />
    </>
  );
};

export default Home;
