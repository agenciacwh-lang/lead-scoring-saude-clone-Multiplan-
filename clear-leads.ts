import { drizzle } from "drizzle-orm/mysql2";
import { leads } from "./drizzle/schema";

async function clearLeads() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  try {
    console.log("Limpando todos os leads...");
    const result = await db.delete(leads);
    console.log("✅ Todos os leads foram deletados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao limpar leads:", error);
    process.exit(1);
  }
}

clearLeads();
