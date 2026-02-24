"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { NOTAS_PENDENTES } from "@/lib/mock-data"
import { Shield, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ValidacaoNotasPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [notas, setNotas] = useState(NOTAS_PENDENTES)
  const [selectedNota, setSelectedNota] = useState<(typeof NOTAS_PENDENTES)[0] | null>(null)
  const [observacoes, setObservacoes] = useState("")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [filterTrimestre, setFilterTrimestre] = useState("all")
  const [filterDisciplina, setFilterDisciplina] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const handleAprovar = (nota: (typeof NOTAS_PENDENTES)[0]) => {
    setNotas(notas.map((n) => (n.id === nota.id ? { ...n, estado: "Aprovado" } : n)))
    toast({
      title: "Nota aprovada!",
      description: `A nota de ${nota.alunoNome} em ${nota.disciplinaNome} foi aprovada.`,
    })
  }

  const handleRejeitar = () => {
    if (selectedNota) {
      setNotas(
        notas.map((n) => (n.id === selectedNota.id ? { ...n, estado: "Rejeitado", observacoes: observacoes } : n)),
      )
      toast({
        title: "Nota rejeitada",
        description: `A nota foi devolvida ao professor com observações.`,
        variant: "destructive",
      })
      setIsRejectDialogOpen(false)
      setSelectedNota(null)
      setObservacoes("")
    }
  }

  const notasPendentes = notas.filter((n) => n.estado === "Pendente")
  const notasAprovadas = notas.filter((n) => n.estado === "Aprovado")
  const notasRejeitadas = notas.filter((n) => n.estado === "Rejeitado")

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Pendente":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )
      case "Aprovado":
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        )
      case "Rejeitado":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const NotaCard = ({ nota }: { nota: (typeof NOTAS_PENDENTES)[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary">{nota.alunoNome.charAt(0)}</span>
          </div>
          <div>
            <p className="font-semibold">{nota.alunoNome}</p>
            <p className="text-sm text-muted-foreground">{nota.turma}</p>
          </div>
        </div>
        {getStatusBadge(nota.estado)}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Disciplina</span>
          <span className="font-medium">{nota.disciplinaNome}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Trimestre</span>
          <span>{nota.trimestre}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Professor</span>
          <span>{nota.professorNome}</span>
        </div>

        {/* Notas */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">P1</p>
            <p className="font-bold">{nota.p1}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">P2</p>
            <p className="font-bold">{nota.p2}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Trab.</p>
            <p className="font-bold">{nota.trabalho}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Exame</p>
            <p className="font-bold">{nota.exame || "-"}</p>
          </div>
        </div>

        {nota.observacoes && (
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Observações:</p>
            <p className="text-sm">{nota.observacoes}</p>
          </div>
        )}

        {/* Actions */}
        {nota.estado === "Pendente" && (
          <div className="flex gap-2 pt-3">
            <Button className="flex-1 bg-success hover:bg-success/90" onClick={() => handleAprovar(nota)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setSelectedNota(nota)
                setIsRejectDialogOpen(true)
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )

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
                  <Shield className="w-7 h-7 text-primary" />
                  Validação de Notas
                </h1>
                <p className="text-muted-foreground">Aprovar ou rejeitar notas lançadas pelos professores</p>
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterTrimestre} onValueChange={setFilterTrimestre}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trimestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="1">1º Trimestre</SelectItem>
                    <SelectItem value="2">2º Trimestre</SelectItem>
                    <SelectItem value="3">3º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-warning/5 border-warning/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-warning">{notasPendentes.length}</p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-success/5 border-success/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-success">{notasAprovadas.length}</p>
                      <p className="text-sm text-muted-foreground">Aprovadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-destructive">{notasRejeitadas.length}</p>
                      <p className="text-sm text-muted-foreground">Rejeitadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pendentes" className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="pendentes" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pendentes ({notasPendentes.length})
                </TabsTrigger>
                <TabsTrigger value="aprovadas" className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Aprovadas ({notasAprovadas.length})
                </TabsTrigger>
                <TabsTrigger value="rejeitadas" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejeitadas ({notasRejeitadas.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pendentes">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {notasPendentes.map((nota) => (
                      <NotaCard key={nota.id} nota={nota} />
                    ))}
                  </AnimatePresence>
                  {notasPendentes.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma nota pendente de validação</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="aprovadas">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {notasAprovadas.map((nota) => (
                      <NotaCard key={nota.id} nota={nota} />
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="rejeitadas">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {notasRejeitadas.map((nota) => (
                      <NotaCard key={nota.id} nota={nota} />
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Rejeitar Nota
            </DialogTitle>
            <DialogDescription>
              Adicione uma observação explicando o motivo da rejeição. O professor será notificado.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Ex: A nota da P2 parece incorrecta. Por favor verifique."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRejeitar} disabled={!observacoes.trim()}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
