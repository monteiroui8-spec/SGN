"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FINANCEIRO_STATS, EVOLUCAO_COBRANCA, PROPINAS, ALUNOS } from "@/lib/mock-data"
import { Banknote, TrendingUp, TrendingDown, Clock, Users, CreditCard, Receipt, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const fmtAOA = (v: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(v)

const estadoBadge = (estado: string) => {
  const map: Record<string, string> = {
    pago: "bg-green-500/15 text-green-600",
    pendente: "bg-amber-500/15 text-amber-600",
    atrasado: "bg-destructive/15 text-destructive",
  }
  return <Badge className={`${map[estado] ?? "bg-muted"} border-0 capitalize`}>{estado}</Badge>
}

export default function AdminFinanceiroPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [filterMes, setFilterMes] = useState("all")

  useEffect(() => { if (!isAuthenticated || user?.type !== "admin") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "admin") return null

  const stats = FINANCEIRO_STATS
  const atrasados = PROPINAS.filter((p) => p.estado === "atrasado")

  const chartData = EVOLUCAO_COBRANCA.map((d) => ({
    ...d,
    recebido: d.recebido / 1000,
    pendente: d.pendente / 1000,
  }))

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Banknote className="w-6 h-6 text-primary" />Gestão Financeira</h1>
            <p className="text-sm text-muted-foreground">Visão geral das propinas e cobranças — Ano Lectivo 2024/2025</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/financeiro/pagamentos">
              <Button variant="outline" className="gap-2"><CreditCard className="w-4 h-4" />Pagamentos</Button>
            </Link>
            <Link href="/dashboard/admin/financeiro/recibos">
              <Button variant="outline" className="gap-2"><Receipt className="w-4 h-4" />Recibos</Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Esperado",   v: fmtAOA(stats.totalPropinasAno), icon: Banknote,     cls: "text-foreground bg-muted" },
            { label: "Total Recebido",   v: fmtAOA(stats.totalRecebido),    icon: TrendingUp,   cls: "text-green-600 bg-green-500/10" },
            { label: "Pendente",         v: fmtAOA(stats.totalPendente),    icon: Clock,        cls: "text-amber-600 bg-amber-500/10" },
            { label: "Em Atraso",        v: fmtAOA(stats.totalAtrasado),    icon: TrendingDown, cls: "text-destructive bg-destructive/10" },
          ].map(({ label, v, icon: Icon, cls }) => (
            <Card key={label}><CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls} mb-3`}><Icon className="w-5 h-5" /></div>
              <p className="text-xl font-bold leading-tight">{v}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent></Card>
          ))}
        </div>

        {/* Taxa de cobrança + Alunos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Taxa de Cobrança</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{stats.taxaCobranca.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-1">do valor total foi recebido</p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${stats.taxaCobranca}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-primary rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Situação dos Alunos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Em dia",          v: stats.alunosEmDia,         icon: CheckCircle2,  cls: "text-green-600" },
                { label: "Com atraso",       v: stats.alunosAtrasados,    icon: AlertTriangle, cls: "text-amber-600" },
                { label: "Sem pagamento",    v: stats.alunosSemPagamento, icon: TrendingDown,  cls: "text-destructive" },
              ].map(({ label, v, icon: Icon, cls }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm"><Icon className={`w-4 h-4 ${cls}`} />{label}</div>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Acções Rápidas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/admin/financeiro/pagamentos"><Button className="w-full justify-start gap-2" variant="outline"><CreditCard className="w-4 h-4" />Registar Pagamento</Button></Link>
              <Link href="/dashboard/admin/financeiro/recibos"><Button className="w-full justify-start gap-2" variant="outline"><Receipt className="w-4 h-4" />Ver Recibos</Button></Link>
              <Button className="w-full justify-start gap-2" variant="outline"><BarChart3 className="w-4 h-4" />Exportar Relatório</Button>
            </CardContent>
          </Card>
        </div>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Evolução de Cobrança (AOA × 1000)</CardTitle>
            <CardDescription>Comparação entre valor recebido e pendente por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(0)}k AOA`} />
                  <Bar dataKey="recebido" name="Recebido" fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendente" name="Pendente" fill="var(--color-destructive, #ef4444)" radius={[4, 4, 0, 0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Propinas em Atraso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" />Propinas em Atraso ({atrasados.length})</CardTitle>
            <CardDescription>Alunos com pagamentos em atraso que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {atrasados.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div>
                    <p className="font-medium text-sm">{p.alunoNome}</p>
                    <p className="text-xs text-muted-foreground">{p.turma} · {p.mes} {p.anoLectivo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {estadoBadge(p.estado)}
                    <span className="font-semibold text-sm">{fmtAOA(p.valorMensal)}</span>
                  </div>
                </div>
              ))}
              {atrasados.length === 0 && <p className="text-center py-8 text-muted-foreground">Sem propinas em atraso.</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  )
}
