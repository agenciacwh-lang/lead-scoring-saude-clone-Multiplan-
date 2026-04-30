/**
 * LeadForm – Formulário inicial de captura de dados
 * Design: HealthTech Premium – Dark Navy + Teal/Green
 * Campos: Nome, Telefone, E-mail, Cidade
 */

import { useState } from "react";
import { Heart, Mail, Phone, MapPin, User } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";
import { LeadData } from "@/lib/types";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hero-health-bg-igbSPaoZJKBqYM9KqjBYjP.webp";

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

  // Trigger animation on mount
  useState(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  });

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLeadData(formData);
    onSubmit(formData);

    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen relative flex flex-col overflow-hidden"
      style={{ background: "#0F172A" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/60 to-[#0F172A]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-ring"
            style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)" }}
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span
            className="font-bold text-sm tracking-wide"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#06B6D4" }}
          >
            SaúdePlan
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div
            className={`
              relative rounded-2xl border border-white/10 backdrop-blur-md p-6 md:p-8
              transition-all duration-700
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
            style={{
              background: "rgba(22, 33, 62, 0.85)",
              boxShadow:
                "0 0 0 1px rgba(6, 182, 212, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(6, 182, 212, 0.05)",
            }}
          >
            {/* Title */}
            <div className="space-y-2 mb-6">
              <h1
                className="text-2xl md:text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Vamos começar! 👋
              </h1>
              <p
                className="text-white/60 text-sm"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Precisamos de alguns dados para personalizar sua experiência
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-1.5">
                <label
                  htmlFor="nome"
                  className="flex items-center gap-2 text-xs font-semibold text-white/70"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <User className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
                  Seu nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all duration-200 ${
                    errors.nome ? "border-red-500/50" : "border-white/10"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${errors.nome ? "rgba(239, 68, 68, 0.5)" : "rgba(255,255,255,0.12)"}`,
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.nome
                      ? "rgba(239, 68, 68, 0.7)"
                      : "rgba(6, 182, 212, 0.5)";
                    e.target.style.boxShadow = errors.nome
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : "0 0 0 3px rgba(6, 182, 212, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.nome
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.nome && (
                  <p className="text-xs text-red-400" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.nome}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="telefone"
                  className="flex items-center gap-2 text-xs font-semibold text-white/70"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <Phone className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
                  Telefone com WhatsApp
                </label>
                <input
                  id="telefone"
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all duration-200 ${
                    errors.telefone ? "border-red-500/50" : "border-white/10"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${errors.telefone ? "rgba(239, 68, 68, 0.5)" : "rgba(255,255,255,0.12)"}`,
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.telefone
                      ? "rgba(239, 68, 68, 0.7)"
                      : "rgba(6, 182, 212, 0.5)";
                    e.target.style.boxShadow = errors.telefone
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : "0 0 0 3px rgba(6, 182, 212, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.telefone
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.telefone && (
                  <p className="text-xs text-red-400" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.telefone}
                  </p>
                )}
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-xs font-semibold text-white/70"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <Mail className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all duration-200 ${
                    errors.email ? "border-red-500/50" : "border-white/10"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(255,255,255,0.12)"}`,
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.email
                      ? "rgba(239, 68, 68, 0.7)"
                      : "rgba(6, 182, 212, 0.5)";
                    e.target.style.boxShadow = errors.email
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : "0 0 0 3px rgba(6, 182, 212, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.email && (
                  <p className="text-xs text-red-400" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Cidade */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cidade"
                  className="flex items-center gap-2 text-xs font-semibold text-white/70"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <MapPin className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
                  Cidade
                </label>
                <input
                  id="cidade"
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="São Paulo"
                  className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all duration-200 ${
                    errors.cidade ? "border-red-500/50" : "border-white/10"
                  }`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${errors.cidade ? "rgba(239, 68, 68, 0.5)" : "rgba(255,255,255,0.12)"}`,
                    fontSize: "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.cidade
                      ? "rgba(239, 68, 68, 0.7)"
                      : "rgba(6, 182, 212, 0.5)";
                    e.target.style.boxShadow = errors.cidade
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : "0 0 0 3px rgba(6, 182, 212, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.cidade
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.cidade && (
                  <p className="text-xs text-red-400" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.cidade}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-6"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  background: submitting
                    ? "linear-gradient(135deg, #06B6D4, #10B981)"
                    : "linear-gradient(135deg, #06B6D4, #10B981)",
                  color: "#0F172A",
                  boxShadow: "0 4px 20px rgba(6, 182, 212, 0.35)",
                }}
              >
                {submitting ? "Carregando..." : "Começar o quiz →"}
              </button>
            </form>

            <p
              className="text-xs text-white/25 text-center mt-4"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Seus dados são confidenciais e protegidos
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 px-4">
        <p className="text-xs text-white/20" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Leva menos de 2 minutos
        </p>
      </footer>
    </div>
  );
}
