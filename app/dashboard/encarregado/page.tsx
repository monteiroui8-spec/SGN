"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ALUNO_DISCIPLINAS, AVISOS, PROPINAS } from "@/lib/mock-data"
import { BookOpen, Bell, Heart, TrendingUp, TrendingDown, Minus, CreditCard, AlertTriangle, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function EncarregadoDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => { if (!isAuthenticated || user?.type !== "encarregado") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "encarregado") return null

  const alunoNome = user.alunoNome ?? "Educando"
  const disciplinas = ALUNO_DISCIPLINAS
  const aprovadas = disciplinas.filter((d) => d.estado === "Aprovado").length
  const emCurso  = disciplinas.filter((d) => d.estado === "Em curso").length
  const mediaGeral = disciplinas.filter((d) => d.media !== null).reduce((acc, d, _, arr) => acc + (d.media ?? 0) / arr.length, 0)
  const propinasPendentes = PROPINAS.filter((p) => p.alunoId === "ALU001" && (p.estado === "pendente" || p.estado === "atrasado"))
  const avisos = AVISOS.filter((a) => a.destinatarios === "todos").slice(0, 3)

  const statIcon = (media: number | null) => {
    if (!media) return <Minus className="w-4 h-4 text-muted-foreground" />
    if (media >= 14) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (media >= 10) return <Minus className="w-4 h-4 text-amber-600" />
    return <TrendingDown className="w-4 h-4 text-destructive" />
  }

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Welcome */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/10 to-background border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-bold text-lg">Olá, {user.nome?.split(" ")[0]}!</p>
              <p className="text-sm text-muted-foreground">{user.parentesco} de {alunoNome}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Acompanhe o desempenho escolar do seu educando em tempo real.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Disciplinas",   v: disciplinas.length,             cls: "bg-primary/10 text-primary",         icon: BookOpen },
            { label: "Aprovadas",     v: aprovadas,                       cls: "bg-green-500/10 text-green-600",    icon: TrendingUp },
            { label: "Em Curso",      v: emCurso,                         cls: "bg-amber-500/10 text-amber-600",   icon: Minus },
            { label: "Média Geral",   v: mediaGeral > 0 ? mediaGeral.toFixed(1) : "—", cls: "bg-accent/10 text-accent", icon: TrendingUp },
          ].map(({ label, v, cls, icon: Icon }) => (
            <Card key={label}><CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cls} mb-2`}><Icon className="w-4 h-4" /></div>
              <p className="text-2xl font-bold">{v}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notas Resumo */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />Notas Recentes</CardTitle>
              <Link href="/dashboard/encarregado/notas"><Button size="sm" variant="ghost" className="gap-1 text-xs">Ver todas<ChevronRight className="w-3 h-3" /></Button></Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {disciplinas.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {statIcon(d.media)}
                    <div>
                      <p className="text-sm font-medium">{d.nome}</p>
                      <p className="text-xs text-muted-foreground">{d.trimestre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {d.media !== null
                      ? <p className={`font-bold ${d.media >= 10 ? "text-green-600" : "text-destructive"}`}>{d.media.toFixed(1)}</p>
                      : <Badge variant="outline" className="text-xs">Em curso</Badge>
                    }
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Propinas + Avisos */}
          <div className="space-y-4">
            {/* Propinas */}
            <Card className={propinasPendentes.length > 0 ? "border-amber-500/40" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />Propinas
                  {propinasPendentes.length > 0 && <Badge className="bg-amber-500/15 text-amber-600 border-0 text-xs ml-auto">{propinasPendentes.length} pendente(s)</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propinasPendentes.length > 0 ? (
                  <div className="space-y-2">
                    {propinasPendentes.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-sm">{p.mes} 2025</span>
                        </div>
                        <Badge className={`${p.estado === "atrasado" ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-600"} border-0 capitalize text-xs`}>{p.estado}</Badge>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1">Contacte a secretaria para regularizar os pagamentos.</p>
                  </div>
                ) : (
                  <div className="text-center py-3 text-sm text-green-600">
                    <TrendingUp className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    Propinas em dia!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Avisos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-primary" />Avisos</CardTitle>
                <Link href="/dashboard/encarregado/avisos"><Button size="sm" variant="ghost" className="gap-1 text-xs">Ver todos<ChevronRight className="w-3 h-3" /></Button></Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {avisos.map((a) => (
                  <div key={a.id} className="p-2 rounded-lg border border-border">
                    <p className="text-sm font-medium">{a.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.descricao}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  )
}
