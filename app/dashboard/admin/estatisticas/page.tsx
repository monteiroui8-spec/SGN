"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ADMIN_STATS,
  EVOLUCAO_MATRICULAS,
  DISTRIBUICAO_CURSOS,
  DESEMPENHO_DISCIPLINAS,
  EVOLUCAO_NOTAS,
} from "@/lib/mock-data"
import {
  Award,
  TrendingUp,
  Users,
  GraduationCap,
  School,
  BookOpen,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function AdminEstatisticasPage() {
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

  const COLORS = ["#2563EB", "#14B8A6", "#F97316", "#F43F5E", "#0EA5E9"]

  const radarData = DESEMPENHO_DISCIPLINAS.map((d) => ({
    disciplina: d.disciplina,
    media: d.media,
    aprovados: d.aprovados / 5,
  }))

  const tendencias = [
    { label: "Alunos Matriculados", valor: ADMIN_STATS.totalAlunos, variacao: 4.8, positivo: true },
    { label: "Taxa de Aprovação", valor: `${ADMIN_STATS.taxaAprovacao}%`, variacao: 2.3, positivo: true },
    { label: "Média Geral", valor: ADMIN_STATS.mediaGeral, variacao: 0.5, positivo: true },
    { label: "Notas Pendentes", valor: ADMIN_STATS.notasPendentes, variacao: -12, positivo: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-7 h-7 text-primary" />
                Estatísticas
              </h1>
              <p className="text-muted-foreground">Visão geral do desempenho institucional</p>
            </div>

            {/* Tendências */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tendencias.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-2xl font-bold mt-1">{item.valor}</p>
                      </div>
                      <Badge
                        className={
                          item.positivo
                            ? "bg-success/20 text-success border-0"
                            : "bg-destructive/20 text-destructive border-0"
                        }
                      >
                        {item.variacao >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(item.variacao)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução das Notas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Evolução das Notas
                  </CardTitle>
                  <CardDescription>Média e taxa de aprovação mensal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={EVOLUCAO_NOTAS}>
                      <defs>
                        <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAprov" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
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
                        dataKey="media"
                        stroke="#2563EB"
                        strokeWidth={2}
                        fill="url(#colorMedia)"
                        name="Média"
                      />
                      <Area
                        type="monotone"
                        dataKey="aprovados"
                        stroke="#14B8A6"
                        strokeWidth={2}
                        fill="url(#colorAprov)"
                        name="Aprovados %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar de Desempenho */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Radar de Desempenho
                  </CardTitle>
                  <CardDescription>Análise multidimensional</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="disciplina" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 20]} className="text-xs" />
                      <Radar name="Média" dataKey="media" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
                      <Radar name="Aprovação" dataKey="aprovados" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Distribuição por Curso */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5 text-secondary" />
                    Por Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={DISTRIBUICAO_CURSOS}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {DISTRIBUICAO_CURSOS.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {DISTRIBUICAO_CURSOS.map((item, index) => (
                      <div key={item.nome} className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span>{item.sigla}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Evolução de Matrículas */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Crescimento Anual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={EVOLUCAO_MATRICULAS}>
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
                      <Line
                        type="monotone"
                        dataKey="alunos"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Alunos"
                      />
                      <Line
                        type="monotone"
                        dataKey="professores"
                        stroke="#14B8A6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Professores"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ADMIN_STATS.totalAlunos}</p>
                  <p className="text-xs text-muted-foreground">Alunos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <GraduationCap className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ADMIN_STATS.totalProfessores}</p>
                  <p className="text-xs text-muted-foreground">Professores</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <School className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ADMIN_STATS.totalCursos}</p>
                  <p className="text-xs text-muted-foreground">Cursos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ADMIN_STATS.totalDisciplinas}</p>
                  <p className="text-xs text-muted-foreground">Disciplinas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ADMIN_STATS.totalTurmas}</p>
                  <p className="text-xs text-muted-foreground">Turmas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ADMIN_STATS.boletinsGerados}</p>
                  <p className="text-xs text-muted-foreground">Boletins</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
