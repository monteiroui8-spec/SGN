"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PROFESSOR_TURMAS, AVISOS, MENSAGENS } from "@/lib/mock-data"
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  BarChart3,
  ArrowRight,
  Bell,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import Link from "next/link"

export default function ProfessorDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "professor") {
      router.push("/login/professor")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "professor") {
    return null
  }

  const totalAlunos = PROFESSOR_TURMAS.reduce((acc, t) => acc + t.totalAlunos, 0)
  const mediaGeralTurmas = PROFESSOR_TURMAS.reduce((acc, t) => acc + t.mediaGeral, 0) / PROFESSOR_TURMAS.length
  const totalPendentes = PROFESSOR_TURMAS.reduce((acc, t) => acc + (t.notasPendentes || 0), 0)

  const distribuicaoNotas = [
    { range: "0-9", count: 5, fill: "#F43F5E" },
    { range: "10-13", count: 22, fill: "#F97316" },
    { range: "14-16", count: 38, fill: "#14B8A6" },
    { range: "17-20", count: 20, fill: "#10B981" },
  ]

  const aprovacaoData = [
    { name: "Aprovados", value: 78, fill: "#10B981" },
    { name: "Em curso", value: 15, fill: "#14B8A6" },
    { name: "Reprovados", value: 7, fill: "#F43F5E" },
  ]

  const evolucaoMedia = [
    { mes: "Set", media: 12.8 },
    { mes: "Out", media: 13.5 },
    { mes: "Nov", media: 14.2 },
    { mes: "Dez", media: 14.5 },
    { mes: "Jan", media: 14.8 },
    { mes: "Fev", media: 14.5 },
  ]

  const mensagensNaoLidas = MENSAGENS.filter((m) => !m.lida && m.tipo === "recebida").length
  const avisosRecentes = AVISOS.filter((a) => a.destinatarios === "professores" || a.destinatarios === "todos").slice(
    0,
    3,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* CHANGE: Improved layout with flex for responsiveness */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Turmas" value={PROFESSOR_TURMAS.length} icon={BookOpen} variant="primary" />
                <StatCard title="Total Alunos" value={totalAlunos} icon={Users} variant="secondary" />
                <StatCard
                  title="Média Geral"
                  value={mediaGeralTurmas.toFixed(1)}
                  icon={TrendingUp}
                  trend={{ value: 1.2, label: "este período" }}
                  variant="success"
                />
                <StatCard title="Notas Pendentes" value={totalPendentes} icon={Clock} variant="warning" />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/professor/notas">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">Lançar Notas</p>
                        <p className="text-sm text-muted-foreground">{totalPendentes} pendentes</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/professor/turmas">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                        <Users className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">Minhas Turmas</p>
                        <p className="text-sm text-muted-foreground">{PROFESSOR_TURMAS.length} turmas</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/professor/relatorios">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                        <BarChart3 className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">Relatórios</p>
                        <p className="text-sm text-muted-foreground">Análises</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/professor/mensagens">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
                      <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors flex-shrink-0 relative">
                        <MessageSquare className="w-6 h-6 text-success" />
                        {mensagensNaoLidas > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                            {mensagensNaoLidas}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">Mensagens</p>
                        <p className="text-sm text-muted-foreground">{mensagensNaoLidas} não lidas</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evolução da Média */}
                <Card className="lg:col-span-2 overflow-x-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Evolução da Média das Turmas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250} minWidth={250}>
                      <LineChart data={evolucaoMedia}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="mes" className="text-xs" />
                        <YAxis domain={[10, 20]} className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(var(--card))",
                            border: "1px solid rgb(var(--border))",
                            borderRadius: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="media"
                          stroke="#14B8A6"
                          strokeWidth={3}
                          dot={{ fill: "#14B8A6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#14B8A6" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Taxa de Aprovação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-success" />
                      Taxa de Aprovação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={aprovacaoData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {aprovacaoData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(var(--card))",
                            border: "1px solid rgb(var(--border))",
                            borderRadius: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 mt-2">
                      {aprovacaoData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                          <span className="truncate">
                            {item.name}: {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Distribuição de Notas + Avisos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribuição de Notas */}
                <Card className="overflow-x-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      Distribuição de Notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200} minWidth={250}>
                      <BarChart data={distribuicaoNotas}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="range" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(var(--card))",
                            border: "1px solid rgb(var(--border))",
                            borderRadius: "12px",
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {distribuicaoNotas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Avisos */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-warning" />
                      Avisos Recentes
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                      Ver todos
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {avisosRecentes.map((aviso) => (
                        <div
                          key={aviso.id}
                          className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                aviso.tipo === "importante"
                                  ? "bg-destructive"
                                  : aviso.tipo === "evento"
                                    ? "bg-success"
                                    : "bg-primary"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{aviso.titulo}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{aviso.descricao}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(aviso.data).toLocaleDateString("pt-AO")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Minhas Turmas */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Minhas Turmas
                  </CardTitle>
                  <Link href="/dashboard/professor/turmas">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      Ver todas
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROFESSOR_TURMAS.map((turma) => (
                      <div
                        key={turma.id}
                        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-primary">{turma.nome}</span>
                          <Badge variant="outline">{turma.ano}º Ano</Badge>
                        </div>
                        <p className="text-sm font-medium">{turma.disciplina}</p>
                        <p className="text-xs text-muted-foreground">{turma.curso}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <span className="text-sm text-muted-foreground">{turma.totalAlunos} alunos</span>
                          <div className="flex items-center gap-2">
                            {turma.notasPendentes && turma.notasPendentes > 0 ? (
                              <Badge className="bg-warning/20 text-warning border-0 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {turma.notasPendentes}
                              </Badge>
                            ) : (
                              <Badge className="bg-success/20 text-success border-0 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                OK
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
