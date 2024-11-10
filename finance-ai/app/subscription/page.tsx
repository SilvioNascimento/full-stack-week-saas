import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";

const SubscriptionPage = async () => {
    const {userId} = await auth();
  // Se tentar acessar a página de assinatura sem estar logado, então será redirecionado para a página de login
  if (!userId) {
    redirect("/login")
  }
    return(
        <Navbar/>
    );
}

export default SubscriptionPage;