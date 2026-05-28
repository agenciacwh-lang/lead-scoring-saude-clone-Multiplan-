/**
 * RedeAtendimento – Seção "Rede de atendimento em Sergipe"
 * Grid ultra-profissional com as fotos das unidades Hapvida.
 * Layout: 1 destaque grande (esquerda) + 4 menores (direita) no desktop.
 * Mobile: grid de 1 coluna.
 */

import { MapPin, Building2 } from "lucide-react";

const unidades = [
  {
    nome: "Hospital Gabriel Soares",
    tipo: "Hospital",
    imagem: "/gabriel-soares.jpg",
    destaque: true,
  },
  {
    nome: "Clínica Hermes Fontes",
    tipo: "Clínica",
    imagem: "/hermes-fontes.jpg",
    destaque: false,
  },
  {
    nome: "Hapvida Diagnóstico Centro",
    tipo: "Diagnóstico",
    imagem: "/diagnostico-centro.jpg",
    destaque: false,
  },
  {
    nome: "Clínica São José",
    tipo: "Clínica",
    imagem: "/sao-jose.jpg",
    destaque: false,
  },
  {
    nome: "Hapvida Sede Sergipe",
    tipo: "Sede Administrativa",
    imagem: "/hapvida-sede.jpg",
    destaque: false,
  },
];

export default function RedeAtendimento() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">

        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-5 py-2 mb-5">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400 tracking-widest uppercase">
              Sergipe
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Rede de atendimento
            <span className="block text-orange-400">em Sergipe</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Hospitais, clínicas e centros de diagnóstico credenciados Hapvida em toda Aracaju — cobertura completa para você e sua família.
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">

          {/* Card destaque — ocupa 2 colunas e 2 linhas no desktop */}
          <div className="lg:col-span-2 lg:row-span-2 group relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 h-72 lg:h-auto lg:min-h-[480px]">
            <img
              src={unidades[0].imagem}
              alt={unidades[0].nome}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradiente overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Conteúdo */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="inline-flex items-center gap-1.5 bg-orange-500/90 rounded-full px-3 py-1 mb-3">
                <Building2 className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">
                  {unidades[0].tipo}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight">
                {unidades[0].nome}
              </h3>
              <p className="text-gray-300 text-sm mt-1">Aracaju – SE</p>
            </div>
          </div>

          {/* 4 cards menores */}
          {unidades.slice(1).map((unidade) => (
            <div
              key={unidade.nome}
              className="group relative rounded-2xl overflow-hidden shadow-xl border border-white/5 h-56 lg:h-auto"
            >
              <img
                src={unidade.imagem}
                alt={unidade.nome}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradiente overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              {/* Conteúdo */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-flex items-center gap-1 bg-blue-600/80 rounded-full px-2.5 py-0.5 mb-2">
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">
                    {unidade.tipo}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {unidade.nome}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">Aracaju – SE</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
