/**
 * Dashboard de Leads
 * Visualiza estatísticas e lista de leads qualificados
 */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Thermometer, Snowflake, TrendingUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  // Se não está autenticado, mostrar tela de login
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você precisa fazer login para acessar o dashboard.</p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-semibold"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  // Buscar todos os leads
  const { data: allLeads = [], isLoading: leadsLoading } = trpc.leads.getAll.useQuery();

  // Buscar estatísticas
  const { data: leadsStats, isLoading: statsLoading } = trpc.leads.getStats.useQuery();

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

  // Memoizar leads para evitar re-renders desnecessários
  const leads = useMemo(() => allLeads, [allLeads]);
  const stats = useMemo(() => leadsStats, [leadsStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard de Leads</h1>
          <p className="text-slate-400">Visualize e gerencie todos os seus leads qualificados</p>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Total de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-400">✓ Completos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{stats.completos || 0}</div>
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
                <div className="text-3xl font-bold text-red-400">{stats.quentes}</div>
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
                <div className="text-3xl font-bold text-yellow-400">{stats.mornos}</div>
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
                <div className="text-3xl font-bold text-blue-400">{stats.frios}</div>
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
                <div className="text-3xl font-bold text-green-400">{stats.prioridade}</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/20 border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
                  ⏳ Incompletos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">{stats.incompletos || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Leads */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Leads Qualificados</CardTitle>
          </CardHeader>
          <CardContent>
            {leadsLoading || statsLoading ? (
              <div className="text-center py-8 text-slate-400">Carregando leads...</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-slate-400">Nenhum lead encontrado</div>
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
                    {leads.map((lead) => (
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
