/**
 * LeadForm – Formulário de Captura Premium
 * Design: Hapvida – Elegante, sofisticado, sem scrollbar
 * Campos: Nome, Telefone, E-mail, Cidade
 */

import { useState, useEffect } from "react";
import { Heart, Mail, Phone, MapPin, User, ArrowRight } from "lucide-react";
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (formData.telefone.replace(/\D/g, "").length !== 11) {
      newErrors.telefone = "Digite um celular com DDD + 9 dígitos. Ex: (79) 99999-9999";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Manter apenas dígitos e limitar a 11 (DDD 2 + 9 dígitos)
    let digits = e.target.value.replace(/\D/g, "").slice(0, 11);

    // Aplicar máscara progressiva: (XX) XXXXX-XXXX
    let masked = "";
    if (digits.length === 0) {
      masked = "";
    } else if (digits.length <= 2) {
      masked = `(${digits}`;
    } else if (digits.length <= 6) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      // 11 dígitos: (XX) XXXXX-XXXX
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    setFormData((prev) => ({ ...prev, telefone: masked }));

    // Limpar erro ao atingir 11 dígitos
    if (digits.length === 11 && errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    
    // Salvar dados imediatamente
    setLeadData(formData);
    
    // Chamar callback imediatamente (sem delay)
    onSubmit(formData);

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          Seu nome completo
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Ex: João Silva"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
        />
        {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Phone className="w-4 h-4 text-orange-500" />
          Telefone com WhatsApp
        </label>
        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handlePhoneChange}
          placeholder="(11) 99999-9999"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
        />
        {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-500" />
          E-mail
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Cidade */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          Cidade
        </label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleInputChange}
          placeholder="Ex: São Paulo"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
        />
        {errors.cidade && <p className="text-sm text-red-500">{errors.cidade}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processando...
          </>
        ) : (
          <>
            QUERO MINHA PROMOÇÃO EXCLUSIVA
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-xs text-gray-600">Seus dados são confidenciais e protegidos</span>
      </div>
    </form>
  );
}
