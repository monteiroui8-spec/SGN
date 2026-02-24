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
import { ANOS_LECTIVOS, TRIMESTRES } from "@/lib/mock-data"
import { Calendar, Plus, Clock, CheckCircle2 } from "lucide-react"

export default function AnosLectivosPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="w-7 h-7 text-primary" />
                  Anos Lectivos
                </h1>
                <p className="text-muted-foreground">Gerir períodos académicos e trimestres</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Ano Lectivo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ANOS_LECTIVOS.length}</p>
                    <p className="text-xs text-muted-foreground">Anos Lectivos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-muted-foreground">Activo</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{TRIMESTRES.length}</p>
                    <p className="text-xs text-muted-foreground">Trimestres</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Anos Lectivos */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Anos Lectivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ANOS_LECTIVOS.map((ano) => (
                    <div
                      key={ano.id}
                      className={`p-4 rounded-xl border ${
                        ano.estado === "Activo" ? "border-primary/30 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{ano.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(ano.inicio).toLocaleDateString("pt-AO")} -{" "}
                            {new Date(ano.fim).toLocaleDateString("pt-AO")}
                          </p>
                        </div>
                        <Badge
                          className={
                            ano.estado === "Activo"
                              ? "bg-success/20 text-success border-0"
                              : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          {ano.estado}
                        </Badge>
                      </div>

                      {/* Trimestres */}
                      {ano.estado === "Activo" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold mb-3">Trimestres</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {TRIMESTRES.filter((t) => t.anoLectivoId === ano.id).map((tri) => (
                              <div
                                key={tri.id}
                                className={`p-3 rounded-lg border ${
                                  tri.estado === "Activo"
                                    ? "border-primary bg-primary/5"
                                    : tri.estado === "Encerrado"
                                      ? "border-muted bg-muted/30"
                                      : "border-border"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{tri.nome}</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      tri.estado === "Activo"
                                        ? "bg-primary/20 text-primary border-0"
                                        : tri.estado === "Encerrado"
                                          ? "bg-muted text-muted-foreground border-0"
                                          : "bg-warning/20 text-warning border-0"
                                    }
                                  >
                                    {tri.estado}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(tri.inicio).toLocaleDateString("pt-AO")} -{" "}
                                  {new Date(tri.fim).toLocaleDateString("pt-AO")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
