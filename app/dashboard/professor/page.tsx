"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTurmasProfessor, type TurmaProfessor } from "@/lib/api"
import {
  Users, BookOpen, Clock, TrendingUp, Plus, Send,
  Calendar, FileText, HelpCircle, ChevronRight,
  ClipboardList, Loader2
} from "lucide-react"
import Link from "next/link"

const CRONOGRAMA = [
  { disciplina: "Prova Trimestral - 10ª A", tipo: "Avaliação Escrita", data: "Hoje às 10:30", cor: "text-red-500 bg-red-100 dark:bg-red-500/20" },
  { disciplina: "Entrega de Projetos - 9º B", tipo: "Trabalho em Grupo", data: "Amanhã", cor: "text-blue-500 bg-blue-100 dark:bg-blue-500/20" },
  { disciplina: "Teste de Recuperação - 12º C", tipo: "Teste Oral", data: "20/10/2023", cor: "text-orange-500 bg-orange-100 dark:bg-orange-500/20" },
  { disciplina: "Simulado Geral", tipo: "Múltipla Escolha", data: "25/10/2023", cor: "text-purple-500 bg-purple-100 dark:bg-purple-500/20" },
]

export default function ProfessorDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [turmas, setTurmas] = useState<TurmaProfessor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "professor") {
      router.push("/login/professor")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (!user?.id) return
    getTurmasProfessor(user.id)
      .then((res) => setTurmas(res.data || []))
      .finally(() => setLoading(false))
  }, [user?.id])

  if (!isAuthenticated || user?.type !== "professor") return null

  const totalAlunos = turmas.reduce((s, t) => s + Number(t.total_alunos), 0)

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
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Painel de Controle</h1>
                  <p className="text-muted-foreground mt-1">
                    Bem-vindo de volta, Prof. {user.nome.split(" ").slice(-1)[0]}. Aqui está o resumo das suas turmas hoje.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />Nova Avaliação
                  </Button>
                  <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
                    <Link href="/dashboard/professor/notas">
                      <Send className="w-4 h-4" />Lançar Notas
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Total de Alunos", value: totalAlunos || "142", sub: "+3 este mês / Em 5 turmas ativas", iconBg: "bg-primary/10", iconColor: "text-primary" },
                  { icon: BookOpen, label: "Turmas Activas", value: turmas.length || "05", sub: "Matutino e Vespertino", iconBg: "bg-green-100 dark:bg-green-500/20", iconColor: "text-green-600" },
                  { icon: Clock, label: "Pendências", value: "12", sub: "Urgente — Notas para lançar", iconBg: "bg-yellow-100 dark:bg-yellow-500/20", iconColor: "text-yellow-600" },
                  { icon: TrendingUp, label: "Média Geral", value: "16.4", sub: "+0.5 pts — Desempenho académico", iconBg: "bg-blue-100 dark:bg-blue-500/20", iconColor: "text-blue-600" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card>
                      <CardContent className="p-5">
                        <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
                          <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                        </div>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="text-3xl font-bold mt-0.5">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Turmas + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Minhas Turmas */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Minhas Turmas</h2>
                    <Button variant="link" className="text-primary p-0 h-auto text-sm gap-1" asChild>
                      <Link href="/dashboard/professor/turmas">Ver todas <ChevronRight className="w-4 h-4" /></Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(turmas.length > 0 ? turmas : [
                      { turma_id: 1, turma_nome: "10º Ano A", disciplina_id: 1, disciplina_nome: "Matemática Avançada", total_alunos: 32 },
                      { turma_id: 2, turma_nome: "9º Ano B", disciplina_id: 2, disciplina_nome: "Geometria Descritiva", total_alunos: 28 },
                      { turma_id: 3, turma_nome: "12º Ano C", disciplina_id: 3, disciplina_nome: "Cálculo Diferencial", total_alunos: 25 },
                      { turma_id: 4, turma_nome: "10º Ano B", disciplina_id: 4, disciplina_nome: "Matemática Avançada", total_alunos: 30 },
                    ] as TurmaProfessor[]).slice(0, 4).map((t, i) => {
                      const progresso = [85, 40, 100, 15][i] || 50
                      const nextProva = ["15 de Outubro", "18 de Outubro", null, "22 de Outubro"][i]
                      return (
                        <motion.div key={`${t.turma_id}-${t.disciplina_id}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-semibold">{t.turma_nome}</p>
                                  <p className="text-sm text-primary font-medium">{t.disciplina_nome}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{t.total_alunos} Alunos</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Clock className="w-3 h-3" />
                                <span>Lançamento: {progresso}% concluído</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${progresso}%` }}
                                />
                              </div>
                              {nextProva && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                  <Calendar className="w-3 h-3" />
                                  <span>Próxima Prova: <strong>{nextProva}</strong></span>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" asChild>
                                  <Link href="/dashboard/professor/notas">Notas</Link>
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" asChild>
                                  <Link href="/dashboard/professor/pautas">Ver Pauta</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Sidebar Direita */}
                <div className="space-y-4">
                  {/* Cronograma */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />Cronograma de Avaliações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {CRONOGRAMA.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.cor}`}>
                            <ClipboardList className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium leading-snug">{item.disciplina}</p>
                            <p className="text-xs text-muted-foreground">{item.tipo} • {item.data}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        </div>
                      ))}
                      <Button variant="link" className="text-primary p-0 h-auto text-xs" asChild>
                        <Link href="/dashboard/professor/avaliacoes">Acessar Calendário Completo</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Relatórios Rápidos */}
                  <Card className="bg-primary text-white border-0">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold">Relatórios Rápidos</h3>
                      <p className="text-white/70 text-xs">Gere pautas e boletins em segundos.</p>
                      <Button size="sm" variant="secondary" className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-0 text-xs" asChild>
                        <Link href="/dashboard/professor/pautas">
                          <FileText className="w-3.5 h-3.5" />Exportar Pauta da Turma
                        </Link>
                      </Button>
                      <Button size="sm" variant="secondary" className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-0 text-xs">
                        <Users className="w-3.5 h-3.5" />Visualizar Médias Finais
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Ajuda */}
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-400">Precisa de Ajuda?</p>
                          <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                            Dúvidas sobre o fechamento do trimestre? Consulte o manual do professor ou contate a{" "}
                            <a href="#" className="underline font-medium">Ver Central de Ajuda</a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}