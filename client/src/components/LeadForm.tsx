/**
 * LeadForm – Formulário inicial de captura de dados
 * Design: Hapvida – Orange + Blue + Clean
 * Campos: Nome, Telefone, E-mail, Cidade
 */

import { useState, useEffect } from "react";
import { Heart, Mail, Phone, MapPin, User } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";
import { LeadData } from "@/lib/types";

interface LeadFormProps {
  onSubmit: (data: LeadData) => void;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const { setLeadData } = useLeadContext();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const hapvidaLogoUrl = "/manus-storage/hapvida-logo_487cd512.png";

  // Trigger animation on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!/^\d{10,11}$/.test(formData.telefone.replace(/\D/g, ""))) {
      newErrors.telefone = "Telefone inválido (10 ou 11 dígitos)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 0) {
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }

    setFormData((prev) => ({ ...prev, telefone: value }));
    if (errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLeadData(formData);
    onSubmit(formData);

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 dot-pattern" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-ring bg-gradient-to-r from-orange-500 to-orange-600">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-sm tracking-wide text-gray-900" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Hapvida
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={hapvidaLogoUrl} alt="Hapvida" className="h-16 object-contain" />
          </div>

          {/* Card */}
          <div
            className={`
              relative rounded-2xl border border-orange-200 backdrop-blur-md p-6 md:p-8
              transition-all duration-700 shadow-lg
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 0 0 1px rgba(229, 76, 60, 0.1), 0 20px 60px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Title */}
            <div className="space-y-2 mb-6">
              <h1
                className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Olá! 😊
              </h1>
              <p
                className="text-gray-600 text-sm leading-relaxed"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Vamos fazer algumas perguntinhas rápidas para encontrar o plano de saúde ideal para você, com o melhor custo-benefício e cobertura para o que você realmente precisa!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-1.5">
                <label
                  htmlFor="nome"
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  Seu nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className={`w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 border ${
                    errors.nome ? "border-red-500/50" : "border-orange-200"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.nome ? "rgba(239, 68, 68, 0.7)" : "rgba(229, 76, 60, 0.5)";
                    e.target.style.boxShadow = errors.nome ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(229, 76, 60, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.nome ? "rgba(239, 68, 68, 0.5)" : "rgba(229, 76, 60, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.nome && (
                  <p className="text-xs text-red-500" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.nome}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="telefone"
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  Telefone com WhatsApp
                </label>
                <input
                  id="telefone"
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className={`w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 border ${
                    errors.telefone ? "border-red-500/50" : "border-orange-200"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.telefone ? "rgba(239, 68, 68, 0.7)" : "rgba(229, 76, 60, 0.5)";
                    e.target.style.boxShadow = errors.telefone ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(229, 76, 60, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.telefone ? "rgba(239, 68, 68, 0.5)" : "rgba(229, 76, 60, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.telefone && (
                  <p className="text-xs text-red-500" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.telefone}
                  </p>
                )}
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={`w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 border ${
                    errors.email ? "border-red-500/50" : "border-orange-200"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.email ? "rgba(239, 68, 68, 0.7)" : "rgba(229, 76, 60, 0.5)";
                    e.target.style.boxShadow = errors.email ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(229, 76, 60, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(229, 76, 60, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.email && (
                  <p className="text-xs text-red-500" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Cidade */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cidade"
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  Cidade
                </label>
                <input
                  id="cidade"
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="São Paulo"
                  className={`w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 border ${
                    errors.cidade ? "border-red-500/50" : "border-orange-200"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.cidade ? "rgba(239, 68, 68, 0.7)" : "rgba(229, 76, 60, 0.5)";
                    e.target.style.boxShadow = errors.cidade ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(229, 76, 60, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.cidade ? "rgba(239, 68, 68, 0.5)" : "rgba(229, 76, 60, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.cidade && (
                  <p className="text-xs text-red-500" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.cidade}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {submitting ? "Carregando..." : "Responder perguntas →"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Seus dados são confidenciais e protegidos
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
