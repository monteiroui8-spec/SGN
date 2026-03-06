"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getNotasPendentes, type NotaPendente } from "@/lib/api"
import {
  Users, BookOpen, GraduationCap, TrendingUp, Calendar,
  AlertTriangle, CheckCircle2, Clock, FileText, Loader2,
  ArrowUpRight, MoreHorizontal, Plus
} from "lucide-react"
import Link from "next/link"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

const performanceData = [
  { mes: "Fev", media: 13.2, frequencia: 89 },
  { mes: "Mar", media: 13.8, frequencia: 91 },
  { mes: "Abr", media: 14.1, frequencia: 90 },
  { mes: "Mai", media: 14.5, frequencia: 92 },
  { mes: "Jun", media: 14.2, frequencia: 94 },
  { mes: "Jul", media: 14.8, frequencia: 93 },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [notas, setNotas] = useState<NotaPendente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    getNotasPendentes()
      .then((res) => setNotas(res.data || []))
      .finally(() => setLoading(false))
  }, [])

  if (!isAuthenticated || user?.type !== "admin") return null

  const pendentes  = notas.filter((n) => n.estado === "Pendente")
  const aprovadas  = notas.filter((n) => n.estado === "Aprovado")

  const atividades = [
    { icon: FileText, text: "Relatório Trimestral gerado com sucesso.", tempo: "há 2 horas", cor: "text-primary bg-primary/10" },
    { icon: AlertTriangle, text: "Turma 10B está sem professor de Física.", tempo: "há 5 horas", cor: "text-warning bg-warning/10" },
    { icon: Users, text: "15 novos alunos matriculados hoje.", tempo: "há 8 horas", cor: "text-blue-500 bg-blue-500/10" },
    { icon: Calendar, text: "Calendário de exames finais actualizado.", tempo: "há 1 dia", cor: "text-success bg-success/10" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Breadcrumb + Título */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Início &rsaquo; Dashboard Administrativo</p>
                  <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
                  <p className="text-muted-foreground mt-1">
                    Bem-vindo de volta, {user.nome.split(" ")[0]}. Aqui está o que está acontecendo na escola hoje.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />Período Letivo
                  </Button>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <TrendingUp className="w-4 h-4" />Exportar Relatórios
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Users,
                    label: "Total de Alunos",
                    value: "1.240",
                    badge: "+4% este mês",
                    badgeColor: "bg-green-100 text-green-700",
                    iconBg: "bg-green-100",
                    iconColor: "text-green-600",
                  },
                  {
                    icon: GraduationCap,
                    label: "Turmas Ativas",
                    value: "10",
                    badge: "Estável",
                    badgeColor: "bg-blue-100 text-blue-700",
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600",
                  },
                  {
                    icon: BookOpen,
                    label: "Disciplinas",
                    value: "55",
                    badge: "+2 novas",
                    badgeColor: "bg-purple-100 text-purple-700",
                    iconBg: "bg-purple-100",
                    iconColor: "text-purple-600",
                  },
                  {
                    icon: TrendingUp,
                    label: "Média Geral",
                    value: "14,2",
                    badge: "+1.2 pt",
                    badgeColor: "bg-orange-100 text-orange-700",
                    iconBg: "bg-orange-100",
                    iconColor: "text-orange-600",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                            <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.badgeColor}`}>
                            ↗ {stat.badge}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Gráfico + Atividades */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-base font-semibold">Desempenho Académico Global</CardTitle>
                      <CardDescription>Média e frequência dos alunos nos últimos 6 meses</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                          type="monotone"
                          dataKey="media"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.5}
                          dot={false}
                          name="Média Escolar"
                        />
                        <Line
                          type="monotone"
                          dataKey="frequencia"
                          stroke="hsl(var(--foreground))"
                          strokeWidth={2}
                          dot={false}
                          name="Frequência (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Atividades Recentes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
                    <CardDescription>Eventos importantes do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {atividades.map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.cor}`}>
                          <a.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-snug">{a.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.tempo}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="text-primary p-0 h-auto text-sm" asChild>
                      <Link href="/dashboard/admin/auditoria">Ver todo o histórico →</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Gestão Rápida + Status do Período */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Gestão Rápida</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Alunos", icon: Users, href: "/dashboard/admin/alunos" },
                        { label: "Turmas", icon: GraduationCap, href: "/dashboard/admin/turmas" },
                        { label: "Disciplinas", icon: BookOpen, href: "/dashboard/admin/disciplinas" },
                        { label: "Relatórios", icon: FileText, href: "/dashboard/admin/relatorios" },
                      ].map((item) => (
                        <Link key={item.label} href={item.href}>
                          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Status do Período</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Lançamento de Notas (2º Trim)</span>
                        <span className="text-primary font-semibold">82%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Frequência Docente</span>
                        <span className="text-blue-600 font-semibold">96%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "96%" }} />
                      </div>
                    </div>
                    {pendentes.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-2">
                        <Clock className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-warning-foreground">
                          {pendentes.length} notas aguardam validação.{" "}
                          <Link href="/dashboard/admin/validacao-notas" className="underline font-medium">Ver agora</Link>
                        </p>
                      </div>
                    )}
                    <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-2 dark:bg-yellow-500/10 dark:border-yellow-500/20">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-400">
                        Atenção: O conselho de classe está agendado para a próxima sexta-feira às 14:00.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}