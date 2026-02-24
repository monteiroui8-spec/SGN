"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { AVISOS } from "@/lib/mock-data"
import { AlertCircle, Info, CalendarDays } from "lucide-react"

export default function AlunoAvisosPage() {
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
              <h2 className="text-2xl font-bold">Avisos e Comunicados</h2>
              <p className="text-muted-foreground">Fique atualizado com as novidades da instituição</p>
            </div>

            <div className="grid gap-4">
              {AVISOS.map((aviso, index) => (
                <motion.div
                  key={aviso.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            aviso.tipo === "importante"
                              ? "bg-accent/20 text-accent"
                              : aviso.tipo === "evento"
                                ? "bg-secondary/20 text-secondary"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {aviso.tipo === "importante" ? (
                            <AlertCircle className="w-6 h-6" />
                          ) : aviso.tipo === "evento" ? (
                            <CalendarDays className="w-6 h-6" />
                          ) : (
                            <Info className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{aviso.titulo}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                aviso.tipo === "importante"
                                  ? "bg-accent/10 text-accent"
                                  : aviso.tipo === "evento"
                                    ? "bg-secondary/10 text-secondary"
                                    : "bg-primary/10 text-primary"
                              }`}
                            >
                              {aviso.tipo === "importante"
                                ? "Importante"
                                : aviso.tipo === "evento"
                                  ? "Evento"
                                  : "Informação"}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{aviso.descricao}</p>
                          <p className="text-sm text-muted-foreground mt-3">
                            Publicado em{" "}
                            {new Date(aviso.data).toLocaleDateString("pt-AO", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
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
