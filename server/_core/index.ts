import "dotenv/config";

// Polyfill de fetch para compatibilidade com Node.js < 22 (Hostinger/VPS)
// Em Node 22+ o fetch já é nativo; em versões anteriores o cross-fetch
// garante que a API fetch esteja disponível globalmente.
import crossFetch from "cross-fetch";
if (!globalThis.fetch) {
  // @ts-ignore — polyfill intencional para ambientes sem fetch nativo
  globalThis.fetch = crossFetch;
}

import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";


function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  


  const preferredPort = parseInt(process.env.PORT || "3000");

  // Em produção, usar a porta exata definida pelo ambiente (Hostinger/VPS)
  // e fazer binding em 0.0.0.0 para aceitar conexões externas.
  // Em desenvolvimento, buscar porta disponível para evitar conflitos.
  let port: number;
  if (process.env.NODE_ENV === "production") {
    port = preferredPort;
  } else {
    port = await findAvailablePort(preferredPort);
    if (port !== preferredPort) {
      console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
    }
  }

  const host = "0.0.0.0";
  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
