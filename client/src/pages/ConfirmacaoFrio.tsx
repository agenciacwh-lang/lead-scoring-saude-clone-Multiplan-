import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Página de confirmação para leads frios
 * Mostra um resumo das respostas e pede confirmação antes de enviar para automação
 */
export default function ConfirmacaoFrio() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recuperar dados do lead do sessionStorage
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("leadData");
    if (!storedData) {
      navigate("/");
      return;
    }
    setLeadData(JSON.parse(storedData));
  }, [navigate]);

  const submitMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      sessionStorage.removeItem("leadData");
      navigate("/obrigado");
    },
    onError: (error) => {
      console.error("Erro ao enviar lead:", error);
      alert("Erro ao enviar seus dados. Tente novamente.");
      setIsSubmitting(false);
    },
  });

  const handleConfirm = async () => {
    if (!leadData) return;

    setIsSubmitting(true);
    await submitMutation.mutateAsync({
      nome: leadData.nome,
      telefone: leadData.telefone,
      email: leadData.email,
      cidade: leadData.cidade,
      tempo_compra: leadData.tempo_compra || "",
      situacao_atual: leadData.situacao_atual || "",
      renda: leadData.renda || "",
      criterio_escolha: leadData.criterio_escolha || "",
      cnpj_mei: leadData.cnpj_mei || "",
      idades: leadData.idades || "",
      pontuacao: leadData.pontuacao || 0,
      temperatura: "frio",
      prioridade: "Não",
    });
  };

  if (!leadData) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="https://manus-storage.s3.amazonaws.com/lead-scoring-saude/hapvida-logo.png"
          alt="Hapvida"
          className="h-12"
        />
      </div>

      {/* Card Principal */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-2 border-orange-200">
        {/* Ícone de Confirmação */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Confirme seus dados
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Verifique se as informações estão corretas antes de continuar
        </p>

        {/* Resumo dos Dados */}
        <div className="space-y-3 mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Nome:</span>
            <span className="font-semibold text-gray-800">{leadData.nome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">E-mail:</span>
            <span className="font-semibold text-gray-800">{leadData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Telefone:</span>
            <span className="font-semibold text-gray-800">{leadData.telefone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cidade:</span>
            <span className="font-semibold text-gray-800">{leadData.cidade}</span>
          </div>
        </div>

        {/* Mensagem de Informação */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            ℹ️ Seus dados serão encaminhados para nossa equipe de especialistas que entrará em contato em breve.
          </p>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Confirmar e Enviar
              </>
            )}
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-lg"
          >
            Voltar
          </Button>
        </div>

        {/* Rodapé */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Suas informações são confidenciais e protegidas
        </p>
      </div>
    </div>
  );
}
