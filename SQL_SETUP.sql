-- ============================================================================
-- SQL Setup para Supabase - Simulador Hapvida (Clone)
-- ============================================================================
-- Execute este script no SQL Editor do seu novo banco Supabase
-- Isso criará as tabelas necessárias: users e leads
-- ============================================================================

-- ============================================================================
-- 1. TABELA: users
-- ============================================================================
-- Tabela de usuários com suporte a OAuth do Manus
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  "name" TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  "role" VARCHAR(20) NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Criar índice para melhor performance em buscas por openId
CREATE INDEX IF NOT EXISTS idx_users_openId ON users("openId");
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- 2. TABELA: leads
-- ============================================================================
-- Tabela para armazenar dados dos leads do quiz de qualificação
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  
  -- Dados pessoais
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(320) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  
  -- Respostas do quiz (valores brutos do banco, ex: sim_cnpj, acima_6000)
  tempo_compra TEXT,
  situacao_atual TEXT,
  renda TEXT,
  criterio_escolha TEXT,
  cnpj_mei TEXT,
  idades TEXT,
  
  -- Lead Scoring
  pontuacao INTEGER NOT NULL,
  temperatura VARCHAR(20) NOT NULL, -- 'frio', 'morno' ou 'quente'
  prioridade VARCHAR(3) NOT NULL, -- 'Sim' ou 'Não'
  
  -- Status do lead
  status VARCHAR(20) NOT NULL DEFAULT 'incompleto', -- 'completo' ou 'incompleto'
  
  -- Rastreamento de inatividade
  "lastActivityAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Timestamp
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_temperatura ON leads(temperatura);
CREATE INDEX IF NOT EXISTS idx_leads_createdAt ON leads("createdAt");
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ============================================================================
-- 3. COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE users IS 'Tabela de usuários com suporte a OAuth do Manus';
COMMENT ON TABLE leads IS 'Tabela de leads do simulador de qualificação de plano de saúde';

COMMENT ON COLUMN users.id IS 'ID único do usuário (auto-incrementado)';
COMMENT ON COLUMN users."openId" IS 'Identificador OAuth do Manus (único por usuário)';
COMMENT ON COLUMN users."role" IS 'Papel do usuário: admin ou user';

COMMENT ON COLUMN leads.id IS 'ID único do lead (auto-incrementado)';
COMMENT ON COLUMN leads.nome IS 'Nome completo do lead';
COMMENT ON COLUMN leads.telefone IS 'Telefone do lead (sem formatação)';
COMMENT ON COLUMN leads.email IS 'Email do lead';
COMMENT ON COLUMN leads.cidade IS 'Cidade do lead';
COMMENT ON COLUMN leads.tempo_compra IS 'Resposta: Quando pretende contratar (ex: quanto_antes, proximos_meses)';
COMMENT ON COLUMN leads.situacao_atual IS 'Resposta: Situação atual (ex: tenho_quero_trocar, nunca_tive)';
COMMENT ON COLUMN leads.renda IS 'Resposta: Faixa de renda (ex: acima_6000, 1500_3000)';
COMMENT ON COLUMN leads.criterio_escolha IS 'Resposta: Critério de escolha (ex: qualidade_atendimento, preco)';
COMMENT ON COLUMN leads.cnpj_mei IS 'Resposta: Possui CNPJ/MEI (ex: sim_cnpj, nao_pessoa_fisica)';
COMMENT ON COLUMN leads.idades IS 'Resposta: Idades dos beneficiários (ex: 35,32,8)';
COMMENT ON COLUMN leads.pontuacao IS 'Pontuação do lead (0-10)';
COMMENT ON COLUMN leads.temperatura IS 'Temperatura do lead: frio (0-3), morno (4-7), quente (8-10)';
COMMENT ON COLUMN leads.prioridade IS 'Flag de prioridade: Sim ou Não';
COMMENT ON COLUMN leads.status IS 'Status: completo ou incompleto';

-- ============================================================================
-- 4. VERIFICAÇÃO
-- ============================================================================
-- Após executar este script, você pode verificar as tabelas criadas com:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- ============================================================================
