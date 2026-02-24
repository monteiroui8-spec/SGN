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
import {
  ADMIN_STATS,
  NOTAS_PENDENTES,
  EVOLUCAO_MATRICULAS,
  DISTRIBUICAO_CURSOS,
  DESEMPENHO_DISCIPLINAS,
} from "@/lib/mock-data"
import {
  Users,
  GraduationCap,
  School,
  TrendingUp,
  Award,
  UserCog,
  ClipboardList,
  Bell,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const COLORS = ["#14B8A6", "#10B981", "#06B6D4", "#22C55E", "#F97316"]

  const notasPendentes = NOTAS_PENDENTES.filter((n) => n.estado === "Pendente")
  const notasAprovadas = NOTAS_PENDENTES.filter((n) => n.estado === "Aprovado")
  const notasRejeitadas = NOTAS_PENDENTES.filter((n) => n.estado === "Rejeitado")

  const alunosPorCurso = DISTRIBUICAO_CURSOS.filter((c) => c.sigla === "CONT" || c.sigla === "IG")

  return (
    <div className="min-h-screen bg-background">
      {/* CHANGE: Improved layout with flex and responsive margin */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Alunos"
                  value={ADMIN_STATS.totalAlunos}
                  subtitle={`${ADMIN_STATS.alunosActivos} activos`}
                  icon={Users}
                  trend={{ value: 4.8, label: "este mês" }}
                  variant="primary"
                />
                <StatCard
                  title="Professores"
                  value={ADMIN_STATS.totalProfessores}
                  subtitle={`${ADMIN_STATS.professorActivos} activos`}
                  icon={UserCog}
                  variant="secondary"
                />
                <StatCard
                  title="Cursos"
                  value={alunosPorCurso.length}
                  subtitle={`${ADMIN_STATS.totalTurmas} turmas`}
                  icon={School}
                  variant="accent"
                />
                <StatCard
                  title="Taxa Aprovação"
                  value={`${ADMIN_STATS.taxaAprovacao}%`}
                  icon={Award}
                  trend={{ value: 2.3, label: "vs ano anterior" }}
                  variant="success"
                />
              </div>

              {/* Quick Actions & Pending Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Validations */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-warning" />
                      Notas Pendentes de Validação
                    </CardTitle>
                    <Link href="/dashboard/admin/validacao-notas">
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        Ver todas
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 overflow-x-auto">
                      {notasPendentes.slice(0, 4).map((nota) => (
                        <motion.div
                          key={nota.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-4 w-full sm:flex-1">
                            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-5 h-5 text-warning" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{nota.alunoNome}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {nota.disciplinaNome} - {nota.turma}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Badge variant="outline" className="status-pending">
                              Pendente
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:bg-success/10">
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {notasPendentes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">Nenhuma nota pendente de validação</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Resumo de Notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-warning flex-shrink-0" />
                        <span className="text-sm font-medium">Pendentes</span>
                      </div>
                      <span className="text-2xl font-bold text-warning">{notasPendentes.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-sm font-medium">Aprovadas</span>
                      </div>
                      <span className="text-2xl font-bold text-success">{notasAprovadas.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <span className="text-sm font-medium">Rejeitadas</span>
                      </div>
                      <span className="text-2xl font-bold text-destructive">{notasRejeitadas.length}</span>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Total de notas lançadas</p>
                      <p className="text-3xl font-bold">{ADMIN_STATS.notasLancadas.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evolução de Matrículas */}
                <Card className="lg:col-span-2 overflow-x-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Evolução de Matrículas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={EVOLUCAO_MATRICULAS}>
                        <defs>
                          <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorProfs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="ano" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(var(--card))",
                            border: "1px solid rgb(var(--border))",
                            borderRadius: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="alunos"
                          name="Alunos"
                          stroke="#14B8A6"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorAlunos)"
                        />
                        <Area
                          type="monotone"
                          dataKey="professores"
                          name="Professores"
                          stroke="#10B981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorProfs)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Distribuição por Curso */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-secondary" />
                      Alunos por Curso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={alunosPorCurso}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {alunosPorCurso.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {alunosPorCurso.map((item, index) => (
                        <div key={item.nome} className="flex items-center gap-2 text-xs">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="truncate">
                            {item.sigla}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Desempenho por Disciplina */}
              <Card className="overflow-x-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Desempenho por Disciplina
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300} minWidth={250}>
                    <BarChart data={DESEMPENHO_DISCIPLINAS} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                      <XAxis type="number" domain={[0, 20]} className="text-xs" />
                      <YAxis dataKey="disciplina" type="category" width={80} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(var(--card))",
                          border: "1px solid rgb(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="media" name="Média" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/admin/alunos">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">Gerir Alunos</p>
                          <p className="text-sm text-muted-foreground">{ADMIN_STATS.totalAlunos} registados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/admin/professores">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                          <UserCog className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">Gerir Professores</p>
                          <p className="text-sm text-muted-foreground">{ADMIN_STATS.totalProfessores} registados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/admin/cursos">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                          <School className="w-6 h-6 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">Gerir Cursos</p>
                          <p className="text-sm text-muted-foreground">{alunosPorCurso.length} cursos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/admin/relatorios">
                  <Card className="card-hover cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-success" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">Relatórios</p>
                          <p className="text-sm text-muted-foreground">Análises detalhadas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
