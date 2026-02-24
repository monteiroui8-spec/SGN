"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ALUNO_HORARIO } from "@/lib/mock-data"
import { Calendar, Clock, MapPin } from "lucide-react"

export default function AlunoHorarioPage() {
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
              <h2 className="text-2xl font-bold">Meu Horário</h2>
              <p className="text-muted-foreground">Horário semanal de aulas - {user.turma}</p>
            </div>

            <div className="grid gap-4">
              {ALUNO_HORARIO.map((dia, index) => (
                <motion.div
                  key={dia.dia}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        {dia.dia}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dia.horarios.map((aula, aulaIndex) => (
                          <div
                            key={aulaIndex}
                            className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border"
                          >
                            <p className="font-semibold text-foreground">{aula.disciplina}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {aula.hora}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {aula.sala}
                              </span>
                            </div>
                          </div>
                        ))}
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
