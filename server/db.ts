import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, leads, InsertLead } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      console.log("[Database] Tentando conectar ao Supabase com SSL...");
      console.log("[Database] DATABASE_URL configurada:", ENV.databaseUrl ? "✓ Sim" : "✗ Não");
      
      // Configurar SSL para conexao segura com Supabase
      _client = postgres(ENV.databaseUrl, {
        ssl: 'require',
        connect_timeout: 10,
      });
      
      _db = drizzle(_client);
      console.log("[Database] Conectado ao Supabase com sucesso (SSL habilitado)");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  } else if (!ENV.databaseUrl) {
    console.warn("[Database] DATABASE_URL não está configurada no ENV");
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // Para PostgreSQL, usar ON CONFLICT
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Salvar um novo lead no banco de dados
 */
export async function saveLead(leadData: InsertLead) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save lead: database not available");
    return null;
  }

  try {
    const result = await db.insert(leads).values({
      ...leadData,
      status: "completo",
    }).returning();
    console.log("[Database] Lead salvo com sucesso:", leadData.email);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save lead:", error);
    throw error;
  }
}

/**
 * Gera o próximo ID LEAD sequencial formatado com zero-padding.
 * Conta o total de leads no banco e retorna o próximo número como string.
 * Exemplos: 0001, 0002, 0003, ... 0099, 0100, 1000, etc.
 *
 * Estratégia: conta todos os registros existentes e soma 1.
 * Isso garante que cada novo lead receba um número único e crescente.
 */
export async function getNextLeadCode(): Promise<string> {
  const db = await getDb();
  if (!db) {
    // Fallback sem banco: retorna timestamp curto para não bloquear o fluxo
    const ts = Date.now().toString().slice(-4);
    return ts.padStart(4, "0");
  }
  try {
    const { sql } = await import("drizzle-orm");
    const result = await db.execute(sql`SELECT COUNT(*) as total FROM leads`);
    const rows = result as any[];
    const total = parseInt(rows[0]?.total ?? rows[0]?.count ?? "0", 10);
    const next = total + 1;
    // Garante mínimo de 4 dígitos: 0001, 0002 ... 9999, 10000 (sem truncar)
    return String(next).padStart(4, "0");
  } catch (error) {
    console.error("[Database] Erro ao gerar ID LEAD sequencial:", error);
    const ts = Date.now().toString().slice(-4);
    return ts.padStart(4, "0");
  }
}

// TODO: add feature queries here as your schema grows.
