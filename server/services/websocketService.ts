/**
 * Serviço de WebSocket para atualizações em tempo real
 * Gerencia conexões de clientes e broadcast de novos leads
 */

import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export interface LeadUpdatePayload {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  temperatura: "frio" | "morno" | "quente";
  pontuacao: number;
  status: "completo" | "incompleto" | "confirmado";
  createdAt: Date;
}

export interface StatsUpdatePayload {
  total: number;
  completos: number;
  incompletos: number;
  frios: number;
  mornos: number;
  quentes: number;
  prioridade: number;
}

let io: SocketIOServer | null = null;

/**
 * Inicializar servidor Socket.io
 */
export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    path: '/socket.io',
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[WebSocket] Cliente conectado: ${socket.id}`);

    // Cliente se inscreve para atualizações de leads
    socket.on("subscribe:leads", () => {
      socket.join("leads-room");
      console.log(`[WebSocket] Cliente ${socket.id} inscrito em leads-room`);
    });

    // Cliente se inscreve para atualizações de estatísticas
    socket.on("subscribe:stats", () => {
      socket.join("stats-room");
      console.log(`[WebSocket] Cliente ${socket.id} inscrito em stats-room`);
    });

    // Desconexão
    socket.on("disconnect", () => {
      console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
    });

    // Tratamento de erros
    socket.on("error", (error) => {
      console.error(`[WebSocket] Erro no socket ${socket.id}:`, error);
    });
  });

  console.log("[WebSocket] Servidor Socket.io inicializado");
  return io;
}

/**
 * Obter instância do Socket.io
 */
export function getWebSocketServer(): SocketIOServer | null {
  return io;
}

/**
 * Broadcast de novo lead para todos os clientes conectados
 */
export function broadcastNewLead(lead: LeadUpdatePayload): void {
  if (!io) {
    console.warn("[WebSocket] Socket.io não inicializado");
    return;
  }

  console.log(`[WebSocket] Enviando novo lead para sala: leads-room`);
  io.to("leads-room").emit("lead:new", {
    ...lead,
    createdAt: new Date(lead.createdAt).toISOString(),
  });
}

/**
 * Broadcast de atualização de estatísticas
 */
export function broadcastStatsUpdate(stats: StatsUpdatePayload): void {
  if (!io) {
    console.warn("[WebSocket] Socket.io não inicializado");
    return;
  }

  console.log(`[WebSocket] Enviando atualização de estatísticas para sala: stats-room`);
  io.to("stats-room").emit("stats:update", stats);
}

/**
 * Broadcast de múltiplos leads (para sincronização inicial)
 */
export function broadcastLeadsSync(leads: LeadUpdatePayload[]): void {
  if (!io) {
    console.warn("[WebSocket] Socket.io não inicializado");
    return;
  }

  console.log(`[WebSocket] Sincronizando ${leads.length} leads`);
  io.to("leads-room").emit("leads:sync", {
    leads: leads.map((lead) => ({
      ...lead,
      createdAt: new Date(lead.createdAt).toISOString(),
    })),
  });
}

/**
 * Obter número de clientes conectados
 */
export function getConnectedClientsCount(): number {
  if (!io) return 0;
  return io.engine.clientsCount;
}

/**
 * Obter número de clientes em uma sala específica
 */
export function getRoomClientsCount(room: string): number {
  if (!io) return 0;
  const sockets = io.sockets.adapter.rooms.get(room);
  return sockets ? sockets.size : 0;
}
