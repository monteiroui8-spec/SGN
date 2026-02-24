"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ALUNO_DISCIPLINAS } from "@/lib/mock-data"
import { BookOpen, CheckCircle2, Clock } from "lucide-react"

export default function AlunoNotasPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Minhas Notas</h2>
              <p className="text-muted-foreground">Acompanhe seu desempenho em todas as disciplinas</p>
            </div>

            <div className="grid gap-4">
              {ALUNO_DISCIPLINAS.map((disciplina, index) => (
                <motion.div
                  key={disciplina.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
                            <p className="text-sm text-muted-foreground">{disciplina.professor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {disciplina.estado === "Aprovado" ? (
                            <span className="flex items-center gap-1 text-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                              <CheckCircle2 className="w-4 h-4" />
                              Aprovado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                              <Clock className="w-4 h-4" />
                              Em curso
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">1ª Prova</p>
                          <p className="text-xl font-bold">{disciplina.notas.p1}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">2ª Prova</p>
                          <p className="text-xl font-bold">{disciplina.notas.p2}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Trabalho</p>
                          <p className="text-xl font-bold">{disciplina.notas.trabalho}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Exame</p>
                          <p className="text-xl font-bold">{disciplina.notas.exame ?? "-"}</p>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="text-xs text-primary mb-1">Média Final</p>
                          <p className="text-xl font-bold text-primary">{disciplina.media?.toFixed(1) ?? "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
