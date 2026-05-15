export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  botconversaWebhookUrl: process.env.BOTCONVERSA_WEBHOOK_URL ?? "",
  googleSheetsWebhookUrl: process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? "",
};

// Log de diagnóstico em produção
if (ENV.isProduction) {
  console.log("[ENV] Variáveis de ambiente carregadas:");
  console.log("[ENV] BOTCONVERSA_WEBHOOK_URL:", ENV.botconversaWebhookUrl ? "✓ Configurada" : "✗ NÃO CONFIGURADA");
  console.log("[ENV] GOOGLE_SHEETS_WEBHOOK_URL:", ENV.googleSheetsWebhookUrl ? "✓ Configurada" : "✗ NÃO CONFIGURADA");
  console.log("[ENV] DATABASE_URL:", ENV.databaseUrl ? "✓ Configurada" : "✗ NÃO CONFIGURADA");
}
