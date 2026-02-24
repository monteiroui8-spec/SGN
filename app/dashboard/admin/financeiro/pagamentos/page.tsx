"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PROPINAS, ALUNOS } from "@/lib/mock-data"
import { CreditCard, Search, Plus, CheckCircle2, Clock, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

type Propina = typeof PROPINAS[0]

const estadoBadge = (estado: string) => {
  const map: Record<string, string> = {
    pago:     "bg-green-500/15 text-green-600",
    pendente: "bg-amber-500/15 text-amber-600",
    atrasado: "bg-destructive/15 text-destructive",
  }
  return <Badge className={`${map[estado] ?? "bg-muted"} border-0 capitalize`}>{estado}</Badge>
}

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]

const fmtAOA = (v: number) => new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(v)

export default function PagamentosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [propinas, setPropinas] = useState<Propina[]>(PROPINAS)
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [novoPagamento, setNovoPagamento] = useState({
    alunoId: "", mes: "", valor: 15000, metodoPagamento: "Numerário", referencia: ""
  })

  useEffect(() => { if (!isAuthenticated || user?.type !== "admin") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "admin") return null

  const filtered = propinas.filter((p) => {
    const q = search.toLowerCase()
    return (p.alunoNome.toLowerCase().includes(q) || p.turma.toLowerCase().includes(q)) &&
      (filterEstado === "all" || p.estado === filterEstado)
  })

  const handleRegistar = () => {
    if (!novoPagamento.alunoId || !novoPagamento.mes) return
    const aluno = ALUNOS.find((a) => a.id === novoPagamento.alunoId)
    if (!aluno) return
    const now = new Date().toISOString().split("T")[0]
    const nova: Propina = {
      id: `PRO${Date.now()}`,
      alunoId: novoPagamento.alunoId,
      alunoNome: aluno.nome,
      turma: aluno.turma,
      curso: aluno.curso,
      anoLectivo: "2024/2025",
      mes: novoPagamento.mes,
      mesNum: MESES.indexOf(novoPagamento.mes) + 1,
      valorMensal: novoPagamento.valor,
      estado: "pago",
      dataVencimento: now,
      dataPagamento: now,
      referencia: novoPagamento.referencia || `REF-${Date.now()}`,
    }
    setPropinas([nova, ...propinas])
    setIsOpen(false)
    setNovoPagamento({ alunoId: "", mes: "", valor: 15000, metodoPagamento: "Numerário", referencia: "" })
    toast({ title: "Pagamento registado!", description: `Propina de ${aluno.nome} para ${nova.mes} registada.` })
  }

  const totais = {
    pago:     filtered.filter((p) => p.estado === "pago").length,
    pendente: filtered.filter((p) => p.estado === "pendente").length,
    atrasado: filtered.filter((p) => p.estado === "atrasado").length,
  }

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard/admin/financeiro" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="w-6 h-6 text-primary" />Pagamentos de Propinas</h1>
            </div>
            <p className="text-sm text-muted-foreground">Registo e consulta de todos os pagamentos</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />Registar Pagamento</Button></DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Registar Pagamento</DialogTitle><DialogDescription>Registe um pagamento de propina.</DialogDescription></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label>Aluno</Label>
                  <Select value={novoPagamento.alunoId} onValueChange={(v) => setNovoPagamento({ ...novoPagamento, alunoId: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione o aluno" /></SelectTrigger>
                    <SelectContent>{ALUNOS.map((a) => <SelectItem key={a.id} value={a.id}>{a.nome} ({a.turma})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mês</Label>
                    <Select value={novoPagamento.mes} onValueChange={(v) => setNovoPagamento({ ...novoPagamento, mes: v })}>
                      <SelectTrigger><SelectValue placeholder="Mês" /></SelectTrigger>
                      <SelectContent>{MESES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (AOA)</Label>
                    <Input type="number" value={novoPagamento.valor} onChange={(e) => setNovoPagamento({ ...novoPagamento, valor: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Método</Label>
                  <Select value={novoPagamento.metodoPagamento} onValueChange={(v) => setNovoPagamento({ ...novoPagamento, metodoPagamento: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Numerário">Numerário</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="Multicaixa">Multicaixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Referência (opcional)</Label><Input placeholder="REF-XXXX" value={novoPagamento.referencia} onChange={(e) => setNovoPagamento({ ...novoPagamento, referencia: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button onClick={handleRegistar} disabled={!novoPagamento.alunoId || !novoPagamento.mes}>Registar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pagos",      v: totais.pago,     icon: CheckCircle2,  cls: "text-green-600 bg-green-500/10" },
            { label: "Pendentes",  v: totais.pendente,  icon: Clock,         cls: "text-amber-600 bg-amber-500/10" },
            { label: "Atrasados",  v: totais.atrasado,  icon: AlertTriangle, cls: "text-destructive bg-destructive/10" },
          ].map(({ label, v, icon: Icon, cls }) => (
            <Card key={label}><CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls}`}><Icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Pesquisar aluno ou turma..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardHeader><CardTitle className="text-base">Lista de Propinas ({filtered.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Aluno</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Turma</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Mês</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Valor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                </tr></thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{p.alunoNome}</td>
                      <td className="p-3 text-muted-foreground">{p.turma}</td>
                      <td className="p-3">{p.mes}</td>
                      <td className="p-3 font-medium">{fmtAOA(p.valorMensal)}</td>
                      <td className="p-3">{estadoBadge(p.estado)}</td>
                      <td className="p-3 text-muted-foreground">{p.dataPagamento ? new Date(p.dataPagamento).toLocaleDateString("pt-AO") : "—"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>Sem resultados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  )
}
