"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EXAMES, PROFESSOR_TURMAS, TRIMESTRES } from "@/lib/mock-data"
import { CalendarCheck, Plus, Clock, CheckCircle2, Calendar, MapPin, Timer, Users, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Exame = typeof EXAMES[0]

export default function ProfessorExamesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [exames, setExames] = useState<Exame[]>(EXAMES)
  const [isOpen, setIsOpen] = useState(false)
  const [novo, setNovo] = useState({ tipo: "Teste", disciplinaNome: "", turmaNome: "", trimestre: "2º Trimestre", data: "", hora: "08:00", duracao: 90, sala: "" })

  useEffect(() => { if (!isAuthenticated || user?.type !== "professor") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "professor") return null

  const proximos = exames.filter((e) => e.estado === "Programado")
  const realizados = exames.filter((e) => e.estado === "Realizado")

  const handleCreate = () => {
    if (!novo.disciplinaNome || !novo.turmaNome || !novo.data) return
    const e: Exame = {
      id: `EXM${Date.now()}`, disciplinaId: "DIS001", professorId: "PROF001",
      professorNome: user?.nome ?? "Professor", turmaId: "TUR001",
      totalAlunos: PROFESSOR_TURMAS.find((t) => t.nome === novo.turmaNome)?.totalAlunos ?? 0,
      mediaResultado: null, estado: "Programado", ...novo,
    }
    setExames([e, ...exames])
    setIsOpen(false)
    setNovo({ tipo: "Teste", disciplinaNome: "", turmaNome: "", trimestre: "2º Trimestre", data: "", hora: "08:00", duracao: 90, sala: "" })
    toast({ title: "Prova criada!", description: `${e.tipo} de ${e.disciplinaNome} agendado.` })
  }

  const ExameCard = ({ exame }: { exame: Exame }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <p className="font-semibold">{exame.disciplinaNome}</p>
          <p className="text-xs text-muted-foreground">{exame.turmaNome} · {exame.trimestre}</p>
        </div>
        <Badge className={exame.tipo === "Exame" ? "bg-violet-500/15 text-violet-600 border-0" : exame.tipo === "Teste" ? "bg-amber-500/15 text-amber-600 border-0" : "bg-cyan-500/15 text-cyan-600 border-0"}>
          {exame.tipo}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(exame.data).toLocaleDateString("pt-AO")}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{exame.hora}</span>
        <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" />{exame.duracao} min</span>
        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{exame.sala}</span>
      </div>
      {exame.mediaResultado !== null && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Média da turma</span>
          <span className={`text-lg font-bold ${exame.mediaResultado >= 10 ? "text-green-600" : "text-destructive"}`}>{exame.mediaResultado.toFixed(1)}</span>
        </div>
      )}
    </motion.div>
  )

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarCheck className="w-6 h-6 text-primary" />Exames e Provas</h1>
            <p className="text-sm text-muted-foreground">Agende e acompanhe as provas das suas turmas</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />Agendar Prova</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Agendar Nova Prova</DialogTitle><DialogDescription>Preencha os dados da prova.</DialogDescription></DialogHeader>
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
                <div className="space-y-2"><Label>Disciplina</Label><Input placeholder="Nome" value={novo.disciplinaNome} onChange={(e) => setNovo({ ...novo, disciplinaNome: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Turma</Label>
                  <Select value={novo.turmaNome} onValueChange={(v) => setNovo({ ...novo, turmaNome: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>{PROFESSOR_TURMAS.map((t) => <SelectItem key={t.id} value={t.nome}>{t.nome} – {t.disciplina}</SelectItem>)}</SelectContent>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Próximos",  v: proximos.length,  icon: Clock, cls: "text-primary bg-primary/10" },
            { label: "Realizados", v: realizados.length, icon: CheckCircle2, cls: "text-green-600 bg-green-500/10" },
            { label: "Total", v: exames.length, icon: CalendarCheck, cls: "text-muted-foreground bg-muted" },
          ].map(({ label, v, icon: Icon, cls }) => (
            <Card key={label}><CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls}`}><Icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="proximos">
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="proximos">Próximos ({proximos.length})</TabsTrigger>
            <TabsTrigger value="realizados">Realizados ({realizados.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="proximos" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {proximos.map((e) => <ExameCard key={e.id} exame={e} />)}
              {proximos.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground"><CalendarCheck className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>Sem provas agendadas</p></div>}
            </div>
          </TabsContent>
          <TabsContent value="realizados" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {realizados.map((e) => <ExameCard key={e.id} exame={e} />)}
              {realizados.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground"><CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>Sem provas realizadas</p></div>}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardShell>
  )
}
