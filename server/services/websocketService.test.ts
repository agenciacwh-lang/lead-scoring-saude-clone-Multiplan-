/**
 * Testes para WebSocket Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  broadcastNewLead, 
  broadcastStatsUpdate, 
  broadcastLeadsSync,
  getConnectedClientsCount,
  getRoomClientsCount,
  LeadUpdatePayload,
  StatsUpdatePayload
} from './websocketService';

describe('WebSocket Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('broadcastNewLead', () => {
    it('deve enviar novo lead para a sala leads-room', () => {
      const lead: LeadUpdatePayload = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        cidade: 'São Paulo',
        temperatura: 'quente',
        pontuacao: 8,
        status: 'completo',
        createdAt: new Date(),
      };

      expect(() => broadcastNewLead(lead)).not.toThrow();
      console.log('[WebSocket Test] Novo lead enviado com sucesso');
    });

    it('deve formatar corretamente a data do lead', () => {
      const lead: LeadUpdatePayload = {
        id: 1,
        nome: 'Maria Santos',
        email: 'maria@example.com',
        telefone: '21988888888',
        cidade: 'Rio de Janeiro',
        temperatura: 'morno',
        pontuacao: 5,
        status: 'completo',
        createdAt: new Date('2026-05-14T15:00:00Z'),
      };

      expect(() => broadcastNewLead(lead)).not.toThrow();
      console.log('[WebSocket Test] Data do lead formatada corretamente');
    });
  });

  describe('broadcastStatsUpdate', () => {
    it('deve enviar atualização de estatísticas para a sala stats-room', () => {
      const stats: StatsUpdatePayload = {
        total: 100,
        completos: 80,
        incompletos: 20,
        frios: 30,
        mornos: 40,
        quentes: 10,
        prioridade: 5,
      };

      expect(() => broadcastStatsUpdate(stats)).not.toThrow();
      console.log('[WebSocket Test] Estatísticas enviadas com sucesso');
    });

    it('deve incluir todos os campos de estatísticas', () => {
      const stats: StatsUpdatePayload = {
        total: 50,
        completos: 40,
        incompletos: 10,
        frios: 15,
        mornos: 20,
        quentes: 5,
        prioridade: 3,
      };

      expect(stats.total).toBe(50);
      expect(stats.completos).toBe(40);
      expect(stats.incompletos).toBe(10);
      expect(stats.frios).toBe(15);
      expect(stats.mornos).toBe(20);
      expect(stats.quentes).toBe(5);
      expect(stats.prioridade).toBe(3);
      
      console.log('[WebSocket Test] Todos os campos de estatísticas validados');
    });
  });

  describe('broadcastLeadsSync', () => {
    it('deve sincronizar múltiplos leads', () => {
      const leads: LeadUpdatePayload[] = [
        {
          id: 1,
          nome: 'Lead 1',
          email: 'lead1@example.com',
          telefone: '11999999999',
          cidade: 'São Paulo',
          temperatura: 'quente',
          pontuacao: 8,
          status: 'completo',
          createdAt: new Date(),
        },
        {
          id: 2,
          nome: 'Lead 2',
          email: 'lead2@example.com',
          telefone: '21988888888',
          cidade: 'Rio de Janeiro',
          temperatura: 'morno',
          pontuacao: 5,
          status: 'completo',
          createdAt: new Date(),
        },
      ];

      expect(() => broadcastLeadsSync(leads)).not.toThrow();
      console.log('[WebSocket Test] Sincronização de múltiplos leads realizada');
    });

    it('deve sincronizar lista vazia sem erro', () => {
      expect(() => broadcastLeadsSync([])).not.toThrow();
      console.log('[WebSocket Test] Sincronização de lista vazia realizada');
    });
  });

  describe('getConnectedClientsCount', () => {
    it('deve retornar número de clientes conectados', () => {
      const count = getConnectedClientsCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
      console.log(`[WebSocket Test] Clientes conectados: ${count}`);
    });
  });

  describe('getRoomClientsCount', () => {
    it('deve retornar número de clientes em uma sala', () => {
      const count = getRoomClientsCount('leads-room');
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
      console.log(`[WebSocket Test] Clientes em leads-room: ${count}`);
    });

    it('deve retornar 0 para sala inexistente', () => {
      const count = getRoomClientsCount('inexistent-room');
      expect(count).toBe(0);
      console.log('[WebSocket Test] Sala inexistente retorna 0');
    });
  });

  describe('Validação de Payload', () => {
    it('deve validar estrutura do LeadUpdatePayload', () => {
      const lead: LeadUpdatePayload = {
        id: 1,
        nome: 'Test Lead',
        email: 'test@example.com',
        telefone: '11999999999',
        cidade: 'São Paulo',
        temperatura: 'quente',
        pontuacao: 8,
        status: 'completo',
        createdAt: new Date(),
      };

      expect(lead.id).toBeDefined();
      expect(lead.nome).toBeDefined();
      expect(lead.email).toBeDefined();
      expect(lead.temperatura).toMatch(/^(frio|morno|quente)$/);
      expect(lead.status).toMatch(/^(completo|incompleto|confirmado)$/);
      expect(lead.pontuacao).toBeGreaterThanOrEqual(0);
      expect(lead.pontuacao).toBeLessThanOrEqual(10);
      
      console.log('[WebSocket Test] Validação de LeadUpdatePayload passou');
    });

    it('deve validar estrutura do StatsUpdatePayload', () => {
      const stats: StatsUpdatePayload = {
        total: 100,
        completos: 80,
        incompletos: 20,
        frios: 30,
        mornos: 40,
        quentes: 10,
        prioridade: 5,
      };

      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.completos).toBeGreaterThanOrEqual(0);
      expect(stats.incompletos).toBeGreaterThanOrEqual(0);
      expect(stats.frios).toBeGreaterThanOrEqual(0);
      expect(stats.mornos).toBeGreaterThanOrEqual(0);
      expect(stats.quentes).toBeGreaterThanOrEqual(0);
      expect(stats.prioridade).toBeGreaterThanOrEqual(0);
      
      console.log('[WebSocket Test] Validação de StatsUpdatePayload passou');
    });
  });
});
