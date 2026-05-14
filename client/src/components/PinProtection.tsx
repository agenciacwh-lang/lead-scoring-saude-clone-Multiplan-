/**
 * Componente de Proteção por PIN
 * Solicita PIN de 4 dígitos antes de acessar o dashboard
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, X } from "lucide-react";

interface PinProtectionProps {
  onUnlock: () => void;
  correctPin: string;
  maxAttempts?: number;
}

export function PinProtection({ onUnlock, correctPin, maxAttempts = 3 }: PinProtectionProps) {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Limpar erro após 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePinChange = (value: string) => {
    // Apenas números, máximo 4 dígitos
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 4);
    setPin(numericValue);
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError("PIN deve ter exatamente 4 dígitos");
      return;
    }

    if (pin === correctPin) {
      setPin("");
      setAttempts(0);
      setError("");
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");
      setError("PIN incorreto");

      if (newAttempts >= maxAttempts) {
        setLocked(true);
        setError(`Muitas tentativas. Tente novamente em 5 minutos.`);
        
        // Desbloquear após 5 minutos
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setError("");
        }, 5 * 60 * 1000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !locked) {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-900/30 rounded-full">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Dashboard Protegido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Descrição */}
          <p className="text-center text-slate-300 text-sm">
            Digite o PIN de 4 dígitos para acessar o dashboard
          </p>

          {/* Input PIN */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">PIN</label>
            <div className="flex gap-2">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••"
                maxLength={4}
                disabled={locked}
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-2xl font-bold tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                type="button"
                onClick={() => setShowPin(!showPin)}
                disabled={locked}
                className="px-3 bg-slate-700 hover:bg-slate-600 text-slate-300"
                title={showPin ? "Ocultar PIN" : "Mostrar PIN"}
              >
                {showPin ? "●●●●" : "○○○○"}
              </Button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2">
              <X className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Contador de Tentativas */}
          {!locked && attempts > 0 && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-300">
                Tentativas restantes: {maxAttempts - attempts}
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={locked || pin.length !== 4}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Acessar
            </Button>
            <Button
              onClick={handleClear}
              disabled={locked || pin.length === 0}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpar
            </Button>
          </div>

          {/* Informação */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
            <p>PIN padrão: 1234 (altere em produção)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
