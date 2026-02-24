"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ALUNO_DISCIPLINAS, HISTORICO_NOTAS, TRIMESTRES } from "@/lib/mock-data"
import { BookOpen, TrendingUp, TrendingDown, Minus, Award } from "lucide-react"

const notaCor = (n: number | null) => {
  if (!n) return "text-muted-foreground"
  if (n >= 14) return "text-green-600"
  if (n >= 10) return "text-amber-600"
  return "text-destructive"
}

const estadoBadge = (estado: string) => {
  const map: Record<string, string> = {
    Aprovado: "bg-green-500/15 text-green-600",
    Reprovado: "bg-destructive/15 text-destructive",
    "Em curso": "bg-amber-500/15 text-amber-600",
  }
  return <Badge className={`${map[estado] ?? "bg-muted"} border-0`}>{estado}</Badge>
}

export default function EncarregadoNotasPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [trimestre, setTrimestre] = useState("all")

  useEffect(() => { if (!isAuthenticated || user?.type !== "encarregado") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "encarregado") return null

  const disciplinas = trimestre === "all" ? ALUNO_DISCIPLINAS : ALUNO_DISCIPLINAS.filter((d) => d.trimestre.startsWith(trimestre))
  const aprovadas = disciplinas.filter((d) => d.estado === "Aprovado")
  const emCurso = disciplinas.filter((d) => d.estado === "Em curso")
  const mediaGeral = aprovadas.length > 0 ? aprovadas.reduce((acc, d) => acc + (d.media ?? 0), 0) / aprovadas.length : 0

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" />Notas de {user.alunoNome}</h1>
            <p className="text-sm text-muted-foreground">{user.parentesco} a visualizar o desempenho do seu educando</p>
          </div>
          <Select value={trimestre} onValueChange={setTrimestre}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Trimestre" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {TRIMESTRES.map((t) => <SelectItem key={t.id} value={t.nome.charAt(0)}>{t.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Disciplinas",  v: disciplinas.length,              icon: BookOpen,    cls: "text-primary bg-primary/10" },
            { label: "Aprovadas",    v: aprovadas.length,                icon: TrendingUp,  cls: "text-green-600 bg-green-500/10" },
            { label: "Em Curso",     v: emCurso.length,                  icon: Minus,       cls: "text-amber-600 bg-amber-500/10" },
            { label: "Média",        v: mediaGeral > 0 ? mediaGeral.toFixed(1) : "—", icon: Award, cls: "text-violet-600 bg-violet-500/10" },
          ].map(({ label, v, icon: Icon, cls }) => (
            <Card key={label}><CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cls} mb-2`}><Icon className="w-4 h-4" /></div>
              <p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{label}</p>
            </CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="notas">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="notas">Notas Actuais</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="notas" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disciplinas.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold">{d.nome}</p>
                      <p className="text-xs text-muted-foreground">{d.professor} · {d.trimestre}</p>
                    </div>
                    {estadoBadge(d.estado)}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "P1",       v: d.notas.p1 },
                      { label: "P2",       v: d.notas.p2 },
                      { label: "Trabalho", v: d.notas.trabalho },
                      { label: "Exame",    v: d.notas.exame },
                    ].map(({ label, v }) => (
                      <div key={label} className="p-2 rounded-lg bg-muted/50">
                        <p className={`text-lg font-bold ${notaCor(v)}`}>{v ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  {d.media !== null && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-medium">Média final</span>
                      <span className={`text-xl font-bold ${notaCor(d.media)}`}>{d.media.toFixed(1)}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <div className="space-y-3">
              {HISTORICO_NOTAS.map((h, i) => (
                <motion.div key={h.anoLectivo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-sm">{h.ano}º</span>
                    </div>
                    <div>
                      <p className="font-semibold">{h.anoLectivo}</p>
                      <p className="text-sm text-muted-foreground">{h.aprovadas}/{h.disciplinas} disciplinas aprovadas</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className={`text-2xl font-bold ${h.mediaAnual ? notaCor(h.mediaAnual) : "text-muted-foreground"}`}>
                        {h.mediaAnual?.toFixed(1) ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">Média</p>
                    </div>
                    <Badge className={h.estado === "Aprovado" ? "bg-green-500/15 text-green-600 border-0" : h.estado === "Em curso" ? "bg-amber-500/15 text-amber-600 border-0" : "bg-destructive/15 text-destructive border-0"}>
                      {h.estado}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardShell>
  )
}
