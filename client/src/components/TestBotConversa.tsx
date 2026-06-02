/**
 * TestBotConversa – Componente para testar integração com BotConversa
 * Permite enviar um lead de teste e verificar se a integração está funcionando
 */

import { useState } from "react";
import { Zap, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TestBotConversa() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "Teste Lead",
    email: "teste@example.com",
    telefone: "11999999999",
    cidade: "São Paulo",
  });

  const testMutation = trpc.leads.submitInitial.useMutation();

  const handleTest = async () => {
    await testMutation.mutateAsync(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        title="Testar integração com BotConversa"
      >
        <Zap className="w-5 h-5" />
        {!isOpen && <span className="text-sm font-semibold">Testar</span>}
      </button>

      {/* Modal de Teste */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-6 w-80 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Testar BotConversa
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          {/* Resultado do Teste */}
          {testMutation.isSuccess && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                testMutation.data?.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-amber-50 border border-amber-200"
              }`}
            >
              {testMutation.data?.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    testMutation.data?.success
                      ? "text-green-900"
                      : "text-amber-900"
                  }`}
                >
                  {testMutation.data?.success ? "Sucesso! ✓" : "Aviso"}
                </p>
                <p
                  className={`text-sm ${
                    testMutation.data?.success
                      ? "text-green-700"
                      : "text-amber-700"
                  }`}
                >
                  {testMutation.data?.message}
                </p>
              </div>
            </div>
          )}

          {testMutation.isError && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Erro</p>
                <p className="text-sm text-red-700">
                  {testMutation.error?.message || "Erro ao testar integração"}
                </p>
              </div>
            </div>
          )}

          {/* Formulário de Teste */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome
              </label>
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                disabled={testMutation.isPending}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={testMutation.isPending}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefone
              </label>
              <Input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                disabled={testMutation.isPending}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cidade
              </label>
              <Input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                disabled={testMutation.isPending}
                className="w-full"
              />
            </div>
          </div>

          {/* Botão de Teste */}
          <Button
            onClick={handleTest}
            disabled={testMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {testMutation.isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Enviar Teste
              </>
            )}
          </Button>

          {/* Info */}
          <p className="text-xs text-slate-500 mt-3 text-center">
            Clique em "Enviar Teste" para verificar se a integração com
            BotConversa está funcionando corretamente.
          </p>
        </div>
      )}
    </div>
  );
}
