/**
 * Lead Data Types
 * Dados capturados no formulário inicial e mantidos durante o quiz
 */

export interface LeadData {
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  leadCode?: string;  // ID LEAD gerado no Passo 1, trafegado para o Passo 2
}

export interface QuizState {
  leadData: LeadData;
  answers: Record<string, string>;
}
