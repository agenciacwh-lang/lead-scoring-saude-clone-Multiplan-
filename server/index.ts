import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Polyfill de fetch para compatibilidade com Node.js < 22 (Hostinger/VPS)
// Em Node 22+ o fetch já é nativo; em versões anteriores o cross-fetch
// garante que a API fetch esteja disponível globalmente.
import crossFetch from "cross-fetch";
if (!globalThis.fetch) {
  // @ts-ignore — polyfill intencional para ambientes sem fetch nativo
  globalThis.fetch = crossFetch;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = parseInt(String(process.env.PORT || "3000"), 10);
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
