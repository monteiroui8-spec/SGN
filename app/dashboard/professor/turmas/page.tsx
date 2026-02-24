"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PROFESSOR_TURMAS } from "@/lib/mock-data"
import { Users, BookOpen, TrendingUp, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ProfessorTurmasPage() {
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
                <Users className="w-7 h-7 text-primary" />
                Minhas Turmas
              </h1>
              <p className="text-muted-foreground">Gerir e acompanhar o progresso das suas turmas</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{PROFESSOR_TURMAS.length}</p>
                    <p className="text-sm text-muted-foreground">Turmas Atribuídas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalAlunos}</p>
                    <p className="text-sm text-muted-foreground">Total de Alunos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {(PROFESSOR_TURMAS.reduce((acc, t) => acc + t.mediaGeral, 0) / PROFESSOR_TURMAS.length).toFixed(
                        1,
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Média Geral</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Turmas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROFESSOR_TURMAS.map((turma, index) => {
                const aprovacaoPercent = ((turma.notasAprovadas || 0) / turma.totalAlunos) * 100
                return (
                  <motion.div
                    key={turma.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="card-hover overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{turma.nome}</CardTitle>
                          <Badge variant="outline">{turma.ano}º Ano</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{turma.curso}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-sm font-medium text-primary">{turma.disciplina}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <p className="text-2xl font-bold">{turma.totalAlunos}</p>
                            <p className="text-xs text-muted-foreground">Alunos</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <p className="text-2xl font-bold text-primary">{turma.mediaGeral.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">Média</p>
                          </div>
                        </div>

                        {/* Estado das Notas */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progresso das Notas</span>
                            <span className="font-medium">{aprovacaoPercent.toFixed(0)}%</span>
                          </div>
                          <Progress value={aprovacaoPercent} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-success" />
                              {turma.notasAprovadas || 0} validadas
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-warning" />
                              {turma.notasPendentes || 0} pendentes
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link href="/dashboard/professor/notas" className="flex-1">
                            <Button variant="outline" className="w-full bg-transparent">
                              Lançar Notas
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
