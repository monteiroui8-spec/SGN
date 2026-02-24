"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HISTORICO_NOTAS } from "@/lib/mock-data"
import { BookMarked, TrendingUp, Award, Calendar, ChevronRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AlunoHistoricoPage() {
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

  const evolucaoMedia = HISTORICO_NOTAS.filter((h) => h.mediaAnual !== null).map((h) => ({
    ano: `${h.ano}º Ano`,
    media: h.mediaAnual,
  }))

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
                <BookMarked className="w-7 h-7 text-primary" />
                Histórico Académico
              </h1>
              <p className="text-muted-foreground">Acompanhar a evolução das notas ao longo dos anos</p>
            </div>

            {/* Evolução Gráfico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Evolução da Média Anual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={evolucaoMedia}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="ano" className="text-xs" />
                    <YAxis domain={[10, 20]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--card))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="media"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ fill: "#2563EB", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: "#2563EB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Anos Lectivos */}
            <div className="space-y-4">
              {HISTORICO_NOTAS.map((ano, index) => (
                <motion.div
                  key={ano.anoLectivo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden ${ano.estado === "Em curso" ? "border-primary/50" : ""}`}>
                    <div
                      className={`h-1 ${ano.estado === "Em curso" ? "bg-primary" : ano.estado === "Aprovado" ? "bg-success" : "bg-destructive"}`}
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                              ano.estado === "Em curso"
                                ? "bg-primary/10"
                                : ano.estado === "Aprovado"
                                  ? "bg-success/10"
                                  : "bg-destructive/10"
                            }`}
                          >
                            <Calendar
                              className={`w-7 h-7 ${
                                ano.estado === "Em curso"
                                  ? "text-primary"
                                  : ano.estado === "Aprovado"
                                    ? "text-success"
                                    : "text-destructive"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{ano.anoLectivo}</h3>
                            <p className="text-sm text-muted-foreground">{ano.ano}º Ano</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Disciplinas</p>
                            <p className="text-xl font-bold">
                              {ano.aprovadas}/{ano.disciplinas}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Média Anual</p>
                            <p
                              className={`text-2xl font-bold ${
                                ano.mediaAnual !== null
                                  ? ano.mediaAnual >= 10
                                    ? "text-success"
                                    : "text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {ano.mediaAnual?.toFixed(1) ?? "-"}
                            </p>
                          </div>
                          <Badge
                            className={
                              ano.estado === "Em curso"
                                ? "bg-primary/20 text-primary border-0"
                                : ano.estado === "Aprovado"
                                  ? "bg-success/20 text-success border-0"
                                  : "bg-destructive/20 text-destructive border-0"
                            }
                          >
                            {ano.estado}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-3xl font-bold">{HISTORICO_NOTAS.filter((h) => h.estado === "Aprovado").length}</p>
                  <p className="text-sm text-muted-foreground">Anos Concluídos</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-success/10 to-success/5">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-success" />
                  <p className="text-3xl font-bold">
                    {(
                      HISTORICO_NOTAS.filter((h) => h.mediaAnual !== null).reduce(
                        (acc, h) => acc + (h.mediaAnual || 0),
                        0,
                      ) / HISTORICO_NOTAS.filter((h) => h.mediaAnual !== null).length
                    ).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Média Global</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                <CardContent className="p-6 text-center">
                  <BookMarked className="w-12 h-12 mx-auto mb-3 text-accent" />
                  <p className="text-3xl font-bold">
                    {HISTORICO_NOTAS.reduce((acc, h) => acc + h.aprovadas, 0)}/
                    {HISTORICO_NOTAS.reduce((acc, h) => acc + h.disciplinas, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Disciplinas Aprovadas</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
