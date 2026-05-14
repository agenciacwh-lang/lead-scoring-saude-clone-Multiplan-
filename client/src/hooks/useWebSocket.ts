/**
 * Hook customizado para gerenciar conexão WebSocket
 * Fornece atualizações em tempo real de leads e estatísticas
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface WebSocketLead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  temperatura: 'frio' | 'morno' | 'quente';
  pontuacao: number;
  status: 'completo' | 'incompleto' | 'confirmado';
  createdAt: string;
}

export interface WebSocketStats {
  total: number;
  completos: number;
  incompletos: number;
  frios: number;
  mornos: number;
  quentes: number;
  prioridade: number;
}

interface UseWebSocketOptions {
  subscribeToLeads?: boolean;
  subscribeToStats?: boolean;
  onNewLead?: (lead: WebSocketLead) => void;
  onStatsUpdate?: (stats: WebSocketStats) => void;
  onLeadsSync?: (leads: WebSocketLead[]) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    subscribeToLeads = true,
    subscribeToStats = true,
    onNewLead,
    onStatsUpdate,
    onLeadsSync,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Conectar ao WebSocket
  useEffect(() => {
    // Socket.IO espera http/https, nao ws/wss
    const socketUrl = window.location.origin;

    console.log('[WebSocket Hook] Conectando a:', socketUrl);

    const socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Evento de conexão
    socket.on('connect', () => {
      console.log('[WebSocket Hook] Conectado com ID:', socket.id);
      setIsConnected(true);
      setConnectionError(null);

      // Inscrever em salas
      if (subscribeToLeads) {
        socket.emit('subscribe:leads');
      }
      if (subscribeToStats) {
        socket.emit('subscribe:stats');
      }
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
      console.log('[WebSocket Hook] Desconectado');
      setIsConnected(false);
    });

    // Novo lead recebido
    socket.on('lead:new', (lead: WebSocketLead) => {
      console.log('[WebSocket Hook] Novo lead recebido:', lead);
      if (onNewLead) {
        onNewLead(lead);
      }
    });

    // Atualização de estatísticas
    socket.on('stats:update', (stats: WebSocketStats) => {
      console.log('[WebSocket Hook] Estatísticas atualizadas:', stats);
      if (onStatsUpdate) {
        onStatsUpdate(stats);
      }
    });

    // Sincronização de leads
    socket.on('leads:sync', (data: { leads: WebSocketLead[] }) => {
      console.log('[WebSocket Hook] Leads sincronizados:', data.leads.length);
      if (onLeadsSync) {
        onLeadsSync(data.leads);
      }
    });

    // Erro de conexão
    socket.on('connect_error', (error) => {
      console.error('[WebSocket Hook] Erro de conexão:', error);
      setConnectionError(error.message);
    });

    // Erro geral
    socket.on('error', (error) => {
      console.error('[WebSocket Hook] Erro:', error);
      setConnectionError(typeof error === 'string' ? error : 'Erro desconhecido');
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [subscribeToLeads, subscribeToStats, onNewLead, onStatsUpdate, onLeadsSync]);

  // Função para emitir evento customizado
  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('[WebSocket Hook] Socket não conectado, não é possível emitir:', event);
    }
  }, []);

  // Função para se inscrever em um evento
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  // Função para se desinscrever de um evento
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  return {
    isConnected,
    connectionError,
    emit,
    on,
    off,
    socket: socketRef.current,
  };
}
