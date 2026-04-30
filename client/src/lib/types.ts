/**
 * Lead Data Types
 * Dados capturados no formulário inicial e mantidos durante o quiz
 */

export interface LeadData {
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
}

export interface QuizState {
  leadData: LeadData;
  answers: Record<string, string>;
}
