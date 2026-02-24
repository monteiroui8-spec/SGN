"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EXAMES, TURMAS, TRIMESTRES } from "@/lib/mock-data"
import {
  CalendarCheck, Plus, Search, Clock, CheckCircle2, XCircle,
  Users, MapPin, Timer, Calendar,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Exame = typeof EXAMES[0]

const estadoBadge = (estado: string) => {
  const map: Record<string, { icon: React.ReactNode; cls: string }> = {
    Programado: { icon: <Clock className="w-3 h-3 mr-1" />, cls: "bg-primary/15 text-primary border-0" },
    Realizado:  { icon: <CheckCircle2 className="w-3 h-3 mr-1" />, cls: "bg-green-500/15 text-green-600 border-0" },
    Cancelado:  { icon: <XCircle className="w-3 h-3 mr-1" />, cls: "bg-destructive/15 text-destructive border-0" },
  }
  const b = map[estado] ?? { icon: null, cls: "" }
  return <Badge className={`${b.cls} flex items-center`}>{b.icon}{estado}</Badge>
}

const tipoBadge = (tipo: string) => {
  const map: Record<string, string> = {
    "Exame": "bg-violet-500/15 text-violet-600",
    "Teste": "bg-amber-500/15 text-amber-600",
    "Trabalho Prático": "bg-cyan-500/15 text-cyan-600",
  }
  return <Badge className={`${map[tipo] ?? "bg-muted"} border-0`}>{tipo}</Badge>
}

export default function AdminExamesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [exames, setExames] = useState<Exame[]>(EXAMES)
  const [search, setSearch] = useState("")
  const [filterTrimestre, setFilterTrimestre] = useState("all")
  const [filterTipo, setFilterTipo] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [novo, setNovo] = useState({ tipo: "Exame", disciplinaNome: "", turmaNome: "", trimestre: "2º Trimestre", data: "", hora: "08:00", duracao: 120, sala: "" })

  useEffect(() => { if (!isAuthenticated || user?.type !== "admin") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "admin") return null

  const filtered = exames.filter((e) => {
    const q = search.toLowerCase()
    return (e.disciplinaNome.toLowerCase().includes(q) || e.turmaNome.toLowerCase().includes(q)) &&
      (filterTrimestre === "all" || e.trimestre === filterTrimestre) &&
      (filterTipo === "all" || e.tipo === filterTipo)
  })

  const byEstado = (est: string) => filtered.filter((e) => e.estado === est)

  const handleCreate = () => {
    if (!novo.disciplinaNome || !novo.turmaNome || !novo.data) return
    const e: Exame = { id: `EXM${Date.now()}`, disciplinaId: "DIS001", professorId: "PROF001", professorNome: "Prof. Admin", turmaId: "TUR001", totalAlunos: 0, mediaResultado: null, estado: "Programado", ...novo }
    setExames([e, ...exames])
    setIsOpen(false)
    setNovo({ tipo: "Exame", disciplinaNome: "", turmaNome: "", trimestre: "2º Trimestre", data: "", hora: "08:00", duracao: 120, sala: "" })
    toast({ title: "Exame criado", description: `${e.tipo} de ${e.disciplinaNome} programado com sucesso.` })
  }

  const cancelar = (id: string) => {
    setExames(exames.map((e) => e.id === id ? { ...e, estado: "Cancelado" } : e))
    toast({ title: "Exame cancelado", variant: "destructive" })
  }

  const ExameCard = ({ exame }: { exame: Exame }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{exame.disciplinaNome}</p>
            <p className="text-xs text-muted-foreground">{exame.turmaNome} · {exame.trimestre}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">{tipoBadge(exame.tipo)}{estadoBadge(exame.estado)}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(exame.data).toLocaleDateString("pt-AO")} {exame.hora}</span>
        <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" />{exame.duracao} min</span>
        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{exame.sala}</span>
        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{exame.totalAlunos} alunos</span>
      </div>
      {exame.mediaResultado !== null && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Média</span>
          <span className={`text-lg font-bold ${exame.mediaResultado >= 10 ? "text-green-600" : "text-destructive"}`}>{exame.mediaResultado.toFixed(1)}</span>
        </div>
      )}
      {exame.estado === "Programado" && (
        <Button size="sm" variant="outline" className="mt-3 w-full text-destructive hover:text-destructive gap-1" onClick={() => cancelar(exame.id)}>
          <XCircle className="w-3.5 h-3.5" />Cancelar
        </Button>
      )}
    </motion.div>
  )

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarCheck className="w-6 h-6 text-primary" />Exames e Provas</h1>
            <p className="text-sm text-muted-foreground">Gestão de todos os exames, testes e trabalhos práticos</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" />Novo Exame</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Programar Exame</DialogTitle><DialogDescription>Preencha os dados do novo exame ou prova.</DialogDescription></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={novo.tipo} onValueChange={(v) => setNovo({ ...novo, tipo: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Exame">Exame</SelectItem>
                        <SelectItem value="Teste">Teste</SelectItem>
                        <SelectItem value="Trabalho Prático">Trabalho Prático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trimestre</Label>
                    <Select value={novo.trimestre} onValueChange={(v) => setNovo({ ...novo, trimestre: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{TRIMESTRES.map((t) => <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Disciplina</Label>
                  <Input placeholder="Nome da disciplina" value={novo.disciplinaNome} onChange={(e) => setNovo({ ...novo, disciplinaNome: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Turma</Label>
                  <Select value={novo.turmaNome} onValueChange={(v) => setNovo({ ...novo, turmaNome: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione a turma" /></SelectTrigger>
                    <SelectContent>{TURMAS.map((t) => <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Data</Label><Input type="date" value={novo.data} onChange={(e) => setNovo({ ...novo, data: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Hora</Label><Input type="time" value={novo.hora} onChange={(e) => setNovo({ ...novo, hora: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Duração (min)</Label><Input type="number" value={novo.duracao} onChange={(e) => setNovo({ ...novo, duracao: Number(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Sala</Label><Input placeholder="Ex: Lab 1" value={novo.sala} onChange={(e) => setNovo({ ...novo, sala: e.target.value })} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={!novo.disciplinaNome || !novo.turmaNome || !novo.data}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Programados", v: exames.filter((e) => e.estado === "Programado").length, icon: Clock, cls: "text-primary bg-primary/10" },
            { label: "Realizados",  v: exames.filter((e) => e.estado === "Realizado").length,  icon: CheckCircle2, cls: "text-green-600 bg-green-500/10" },
            { label: "Cancelados",  v: exames.filter((e) => e.estado === "Cancelado").length,  icon: XCircle, cls: "text-destructive bg-destructive/10" },
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
            <Input placeholder="Pesquisar..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterTrimestre} onValueChange={setFilterTrimestre}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Trimestre" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos</SelectItem>{TRIMESTRES.map((t) => <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="Exame">Exame</SelectItem>
              <SelectItem value="Teste">Teste</SelectItem>
              <SelectItem value="Trabalho Prático">Trabalho Prático</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="programados">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="programados">Programados ({byEstado("Programado").length})</TabsTrigger>
            <TabsTrigger value="realizados">Realizados ({byEstado("Realizado").length})</TabsTrigger>
            <TabsTrigger value="cancelados">Cancelados ({byEstado("Cancelado").length})</TabsTrigger>
          </TabsList>
          {(["Programado", "Realizado", "Cancelado"] as const).map((est, i) => (
            <TabsContent key={est} value={["programados","realizados","cancelados"][i]} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>{byEstado(est).map((e) => <ExameCard key={e.id} exame={e} />)}</AnimatePresence>
                {byEstado(est).length === 0 && (
                  <div className="col-span-full text-center py-16 text-muted-foreground">
                    <CalendarCheck className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>Nenhum exame</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </DashboardShell>
  )
}
