/**
 * Dashboard de Leads
 * Visualiza estatísticas, gráficos e lista de leads qualificados com filtros e exportação
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Thermometer, Snowflake, TrendingUp, Download, Filter, X } from "lucide-react";

import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    temperatura: "",
    status: "",
    dataInicio: "",
    dataFim: "",
  });

  // ✅ TODOS os hooks DEVEM estar no topo, ANTES de qualquer retorno condicional
  const { data: allLeads = [], isLoading: leadsLoading } = trpc.leads.getAll.useQuery(undefined, {
    retry: false,
  });

  const { data: leadsStats } = trpc.leads.getStats.useQuery(undefined, {
    retry: false,
  });

  // Aplicar filtros - DEVE estar antes dos useMemo
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      if (filters.temperatura && lead.temperatura !== filters.temperatura) return false;
      if (filters.status && lead.status !== filters.status) return false;
      
      if (filters.dataInicio) {
        const leadDate = new Date(lead.createdAt).getTime();
        const filterDate = new Date(filters.dataInicio).getTime();
        if (leadDate < filterDate) return false;
      }
      
      if (filters.dataFim) {
        const leadDate = new Date(lead.createdAt).getTime();
        const filterDate = new Date(filters.dataFim).getTime();
        if (leadDate > filterDate) return false;
      }
      
      return true;
    });
  }, [allLeads, filters]);

  // Dados para gráfico de pizza (distribuição por temperatura)
  const temperatureData = useMemo(() => {
    const counts = { quente: 0, morno: 0, frio: 0 };
    filteredLeads.forEach((lead) => {
      if (lead.temperatura in counts) {
        counts[lead.temperatura as keyof typeof counts]++;
      }
    });
    return [
      { name: "Quente", value: counts.quente, fill: "#ef4444" },
      { name: "Morno", value: counts.morno, fill: "#eab308" },
      { name: "Frio", value: counts.frio, fill: "#3b82f6" },
    ].filter((item) => item.value > 0);
  }, [filteredLeads]);

  // Dados para gráfico de linha (conversão ao longo do tempo)
  const conversionData = useMemo(() => {
    const dateMap = new Map<string, { completos: number; incompletos: number }>();
    
    filteredLeads.forEach((lead) => {
      const date = new Date(lead.createdAt).toLocaleDateString("pt-BR");
      if (!dateMap.has(date)) {
        dateMap.set(date, { completos: 0, incompletos: 0 });
      }
      const data = dateMap.get(date)!;
      if (lead.status === "completo") {
        data.completos++;
      } else {
        data.incompletos++;
      }
    });

    return Array.from(dateMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, data]) => ({
        date,
        "Completos": data.completos,
        "Incompletos": data.incompletos,
      }));
  }, [filteredLeads]);



  // Exportar para CSV
  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      alert("Nenhum lead para exportar");
      return;
    }

    const headers = ["Nome", "E-mail", "Telefone", "Cidade", "Pontuação", "Temperatura", "Status", "Data"];
    const rows = filteredLeads.map((lead) => [
      lead.nome,
      lead.email,
      lead.telefone,
      lead.cidade,
      `${lead.pontuacao}/10`,
      lead.temperatura,
      lead.status === "incompleto" ? "Incompleto" : "Completo",
      new Date(lead.createdAt).toLocaleDateString("pt-BR"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      temperatura: "",
      status: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const getTemperaturaBadge = (temperatura: string) => {
    switch (temperatura) {
      case "quente":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Quente
          </Badge>
        );
      case "morno":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            Morno
          </Badge>
        );
      case "frio":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
            <Snowflake className="w-3 h-3" />
            Frio
          </Badge>
        );
      default:
        return <Badge>{temperatura}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard de Leads</h1>
          <p className="text-slate-400">Visualize e gerencie todos os seus leads qualificados</p>
        </div>

        {/* Estatísticas */}
        {leadsStats && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Total de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{leadsStats.total}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-400">✓ Completos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{leadsStats.completos || 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Quentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{leadsStats.quentes}</div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Mornos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">{leadsStats.mornos}</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
                  <Snowflake className="w-4 h-4" />
                  Frios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{leadsStats.frios}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Prioridade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{leadsStats.prioridade}</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/20 border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
                  ⏳ Incompletos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">{leadsStats.incompletos || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Temperatura</CardTitle>
            </CardHeader>
            <CardContent>
              {temperatureData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={temperatureData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {temperatureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-slate-400">Sem dados para exibir</div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Linha */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Conversão ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              {conversionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Completos" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Incompletos" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      dot={{ fill: "#a855f7", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-slate-400">Sem dados para exibir</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Exportação */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>

          <Button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV ({filteredLeads.length})
          </Button>

          {(filters.temperatura || filters.status || filters.dataInicio || filters.dataFim) && (
            <Button
              onClick={clearFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Temperatura</label>
                  <select
                    value={filters.temperatura}
                    onChange={(e) => setFilters({ ...filters, temperatura: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="">Todas</option>
                    <option value="quente">Quente</option>
                    <option value="morno">Morno</option>
                    <option value="frio">Frio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="">Todos</option>
                    <option value="completo">Completo</option>
                    <option value="incompleto">Incompleto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Leads */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Leads Qualificados {filteredLeads.length !== allLeads.length && `(${filteredLeads.length} de ${allLeads.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="text-center py-8 text-slate-400">Carregando leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                {allLeads.length === 0 ? "Nenhum lead encontrado" : "Nenhum lead corresponde aos filtros"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Nome</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">E-mail</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Telefone</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Cidade</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Pontuação</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Temperatura</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-white font-medium">{lead.nome}</td>
                        <td className="py-3 px-4 text-slate-300">{lead.email}</td>
                        <td className="py-3 px-4 text-slate-300">{lead.telefone}</td>
                        <td className="py-3 px-4 text-slate-300">{lead.cidade}</td>
                        <td className="py-3 px-4 text-white font-bold">{lead.pontuacao}/10</td>
                        <td className="py-3 px-4">{getTemperaturaBadge(lead.temperatura)}</td>
                        <td className="py-3 px-4">
                          <Badge className={lead.status === "incompleto" ? "bg-purple-600 hover:bg-purple-700" : "bg-green-600 hover:bg-green-700"}>
                            {lead.status === "incompleto" ? "⏳ Incompleto" : "✓ Completo"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
