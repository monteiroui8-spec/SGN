"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getNotasAluno, type NotaAluno } from "@/lib/api"
import { Users, BookOpen, Award, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EncarregadoDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [notas, setNotas] = useState<NotaAluno[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "encarregado") {
      router.push("/login/encarregado")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (!user?.alunoId) return
    getNotasAluno(user.alunoId)
      .then((res) => setNotas(res.data || []))
      .finally(() => setLoading(false))
  }, [user?.alunoId])

  if (!isAuthenticated || user?.type !== "encarregado") return null

  const aprovadas = notas.filter((n) => n.media !== null && Number(n.media) >= 10).length
  const mediaGeral = notas.length > 0
    ? notas.filter((n) => n.media !== null).reduce((s, n) => s + Number(n.media), 0) /
      (notas.filter((n) => n.media !== null).length || 1)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Olá, {user.nome.split(" ")[0]}!</h2>
              <p className="text-muted-foreground">
                Acompanhe o desempenho de <strong>{user.alunoNome}</strong>
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: BookOpen, label: "Disciplinas", value: notas.length, color: "primary" },
                    { icon: Award,    label: "Aprovadas",   value: aprovadas, color: "success" },
                    { icon: TrendingUp, label: "Média Geral", value: mediaGeral > 0 ? mediaGeral.toFixed(1) : "—", color: "accent" },
                    { icon: Users,    label: "Reprovadas",  value: notas.length - aprovadas, color: "destructive" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <Card key={label}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{label}</p>
                          <p className="text-2xl font-bold">{value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {notas.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Últimas Notas de {user.alunoNome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {notas.slice(0, 5).map((n) => (
                          <div key={n.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div>
                              <p className="font-medium">{n.disciplina_nome}</p>
                              <p className="text-xs text-muted-foreground">{n.trimestre_nome}</p>
                            </div>
                            <span className={`text-lg font-bold ${n.media !== null && Number(n.media) >= 10 ? "text-success" : "text-destructive"}`}>
                              {n.media !== null ? Number(n.media).toFixed(1) : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link href="/dashboard/encarregado/notas" className="block mt-4 text-sm text-primary hover:underline text-center">
                        Ver todas as notas →
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="py-12">
                    <CardContent className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Sem notas aprovadas</h3>
                      <p className="text-muted-foreground">As notas do seu educando aparecerão aqui após validação.</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
