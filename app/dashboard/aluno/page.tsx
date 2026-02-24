"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ALUNO_DISCIPLINAS, ALUNO_HORARIO, AVISOS, EVOLUCAO_NOTAS } from "@/lib/mock-data"
import { BookOpen, Calendar, TrendingUp, Award, Clock, AlertCircle, Info, CalendarDays } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AlunoDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "aluno") {
      router.push("/login/aluno")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "aluno") {
    return null
  }

  const disciplinasAprovadas = ALUNO_DISCIPLINAS.filter((d) => d.estado === "Aprovado").length
  const mediaGeral =
    ALUNO_DISCIPLINAS.filter((d) => d.media !== null).reduce((acc, d) => acc + (d.media || 0), 0) /
    ALUNO_DISCIPLINAS.filter((d) => d.media !== null).length

  const hoje = new Date().toLocaleDateString("pt-AO", { weekday: "long" })
  const horarioHoje = ALUNO_HORARIO.find((h) => h.dia.toLowerCase() === hoje.split("-")[0]?.toLowerCase())

  return (
    <div className="min-h-screen bg-background">
      {/* CHANGE: Improved layout structure for responsiveness */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Disciplinas</p>
                        <p className="text-2xl font-bold">{ALUNO_DISCIPLINAS.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Aprovadas</p>
                        <p className="text-2xl font-bold">{disciplinasAprovadas}</p>
                      </div>
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Média Geral</p>
                        <p className="text-2xl font-bold">{mediaGeral.toFixed(1)}</p>
                      </div>
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Ano Lectivo</p>
                        <p className="text-2xl font-bold">{user?.ano}º Ano</p>
                      </div>
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evolução das Notas */}
                <Card className="lg:col-span-2 overflow-x-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Evolução das Notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250} minWidth={250}>
                      <LineChart data={EVOLUCAO_NOTAS}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="mes" className="text-xs" />
                        <YAxis domain={[10, 20]} className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(var(--card))",
                            border: "1px solid rgb(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="media"
                          stroke="rgb(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "rgb(var(--primary))", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Horário de Hoje */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary" />
                      Aulas de Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {horarioHoje ? (
                      <div className="space-y-3">
                        {horarioHoje.horarios.map((aula, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                            <p className="font-medium text-sm">{aula.disciplina}</p>
                            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                              <span>{aula.hora}</span>
                              <span>{aula.sala}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sem aulas hoje</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Últimas Notas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Minhas Disciplinas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ALUNO_DISCIPLINAS.slice(0, 4).map((disciplina) => (
                        <div
                          key={disciplina.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{disciplina.nome}</p>
                            <p className="text-xs text-muted-foreground">{disciplina.professor}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{disciplina.media?.toFixed(1) || "-"}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                disciplina.estado === "Aprovado"
                                  ? "bg-secondary/20 text-secondary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {disciplina.estado}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Avisos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-accent" />
                      Avisos Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {AVISOS.map((aviso) => (
                        <div key={aviso.id} className="p-3 border border-border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                aviso.tipo === "importante"
                                  ? "bg-accent/20 text-accent"
                                  : aviso.tipo === "evento"
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-primary/20 text-primary"
                              }`}
                            >
                              {aviso.tipo === "importante" ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : aviso.tipo === "evento" ? (
                                <CalendarDays className="w-4 h-4" />
                              ) : (
                                <Info className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{aviso.titulo}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{aviso.descricao}</p>
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
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
