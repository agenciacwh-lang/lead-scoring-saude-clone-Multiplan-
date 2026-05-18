import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table para armazenar dados dos leads do quiz
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  cidade: varchar("cidade", { length: 255 }).notNull(),
  
  // Respostas do quiz
  tempo_compra: text("tempo_compra"),
  situacao_atual: text("situacao_atual"),
  renda: text("renda"),
  criterio_escolha: text("criterio_escolha"),
  cnpj_mei: text("cnpj_mei"),
  idades: text("idades"),
  
  // Lead Scoring
  pontuacao: serial("pontuacao").notNull(),
  temperatura: varchar("temperatura", { length: 20 }).notNull(),
  prioridade: varchar("prioridade", { length: 3 }).notNull(), // "Sim" ou "Não"
  
  // Status do lead
  status: varchar("status", { length: 20 }).default("incompleto").notNull(),
  
  // Rastreamento de inatividade
  lastActivityAt: timestamp("lastActivityAt").defaultNow().notNull(),
  
  // Timestamp
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
