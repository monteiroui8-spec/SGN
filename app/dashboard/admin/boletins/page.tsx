"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ALUNOS, CURSOS, ALUNO_DISCIPLINAS, TRIMESTRES } from "@/lib/mock-data"
import { exportToCSV, generatePrintContent, generateBoletimPDF } from "@/lib/export-utils"
import {
  FileText,
  Download,
  Search,
  Eye,
  Printer,
  FileSpreadsheet,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function AdminBoletinsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCurso, setSelectedCurso] = useState("all")
  const [selectedTrimestre, setSelectedTrimestre] = useState("TRI001")
  const [selectedAluno, setSelectedAluno] = useState<(typeof ALUNOS)[0] | null>(null)
  const [isBoletimOpen, setIsBoletimOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const filteredAlunos = ALUNOS.filter((aluno) => {
    const matchesSearch =
      aluno.nome.toLowerCase().includes(searchQuery.toLowerCase()) || aluno.numero.includes(searchQuery)
    const matchesCurso = selectedCurso === "all" || aluno.curso === CURSOS.find((c) => c.id === selectedCurso)?.nome
    return matchesSearch && matchesCurso
  })

  const trimestreAtual = TRIMESTRES.find((t) => t.id === selectedTrimestre)

  const handleViewBoletim = (aluno: (typeof ALUNOS)[0]) => {
    setSelectedAluno(aluno)
    setIsBoletimOpen(true)
  }

  const handleExportPDF = (aluno: (typeof ALUNOS)[0]) => {
    const content = generateBoletimPDF(
      {
        nome: aluno.nome,
        numero: aluno.numero,
        curso: aluno.curso,
        turma: aluno.turma,
        ano: aluno.ano,
      },
      ALUNO_DISCIPLINAS,
      trimestreAtual?.nome || "1º Trimestre",
      "2024/2025",
    )
    generatePrintContent(`Boletim - ${aluno.nome}`, content)
    toast({
      title: "PDF gerado",
      description: `Boletim de ${aluno.nome} aberto para impressão.`,
    })
  }

  const handleExportAllExcel = () => {
    const data = filteredAlunos.map((aluno) => ({
      numero: aluno.numero,
      nome: aluno.nome,
      curso: aluno.curso,
      turma: aluno.turma,
      ano: aluno.ano,
      media: aluno.media,
      estado: aluno.estado,
    }))

    exportToCSV(data, `boletins_${selectedTrimestre}_${new Date().toISOString().split("T")[0]}`, {
      numero: "Número",
      nome: "Nome",
      curso: "Curso",
      turma: "Turma",
      ano: "Ano",
      media: "Média",
      estado: "Estado",
    })

    toast({
      title: "Exportação concluída",
      description: `${data.length} boletins exportados para Excel.`,
    })
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
                  <FileText className="w-7 h-7 text-primary" />
                  Gestão de Boletins
                </h1>
                <p className="text-muted-foreground">Visualizar e exportar boletins dos alunos</p>
              </div>
              <Button onClick={handleExportAllExcel} className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Todos (Excel)
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ALUNOS.length}</p>
                    <p className="text-xs text-muted-foreground">Total Alunos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{ALUNOS.filter((a) => a.media >= 10).length}</p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">156</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">14.2</p>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar por nome ou número..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                      {CURSOS.map((curso) => (
                        <SelectItem key={curso.id} value={curso.id}>
                          {curso.sigla} - {curso.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Trimestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIMESTRES.map((tri) => (
                        <SelectItem key={tri.id} value={tri.id}>
                          {tri.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Boletins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlunos.map((aluno) => (
                <motion.div
                  key={aluno.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group"
                >
                  <Card className="card-hover h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={aluno.foto || "/placeholder.svg?height=64&width=64&query=student"}
                          alt={aluno.nome}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{aluno.nome}</h3>
                          <p className="text-sm text-muted-foreground">{aluno.numero}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {aluno.turma}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {aluno.ano}º Ano
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-muted-foreground">Média:</span>
                          <span
                            className={`text-lg font-bold ${aluno.media >= 10 ? "text-success" : "text-destructive"}`}
                          >
                            {aluno.media.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{aluno.curso}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1 bg-transparent"
                            onClick={() => handleViewBoletim(aluno)}
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1 bg-transparent"
                            onClick={() => handleExportPDF(aluno)}
                          >
                            <Download className="w-3 h-3" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Boletim Dialog */}
            <Dialog open={isBoletimOpen} onOpenChange={setIsBoletimOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Boletim de Notas - {selectedAluno?.nome}
                  </DialogTitle>
                </DialogHeader>
                {selectedAluno && (
                  <div className="space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Nome</p>
                        <p className="font-semibold">{selectedAluno.nome}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Número</p>
                        <p className="font-semibold">{selectedAluno.numero}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Curso</p>
                        <p className="font-semibold">{selectedAluno.curso}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Turma</p>
                        <p className="font-semibold">
                          {selectedAluno.turma} - {selectedAluno.ano}º Ano
                        </p>
                      </div>
                    </div>

                    {/* Grades Table */}
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left py-3 px-4 font-semibold">Disciplina</th>
                            <th className="text-center py-3 px-2 font-semibold">P1</th>
                            <th className="text-center py-3 px-2 font-semibold">P2</th>
                            <th className="text-center py-3 px-2 font-semibold">Trab.</th>
                            <th className="text-center py-3 px-2 font-semibold">Exame</th>
                            <th className="text-center py-3 px-4 font-semibold">Média</th>
                            <th className="text-center py-3 px-4 font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ALUNO_DISCIPLINAS.map((disc) => (
                            <tr key={disc.id} className="border-t border-border">
                              <td className="py-3 px-4">
                                <p className="font-medium">{disc.nome}</p>
                                <p className="text-xs text-muted-foreground">{disc.professor}</p>
                              </td>
                              <td className="text-center py-3 px-2">{disc.notas.p1}</td>
                              <td className="text-center py-3 px-2">{disc.notas.p2}</td>
                              <td className="text-center py-3 px-2">{disc.notas.trabalho}</td>
                              <td className="text-center py-3 px-2">{disc.notas.exame ?? "-"}</td>
                              <td className="text-center py-3 px-4">
                                <span
                                  className={`font-bold ${disc.media !== null ? (disc.media >= 10 ? "text-success" : "text-destructive") : ""}`}
                                >
                                  {disc.media?.toFixed(1) ?? "-"}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <Badge
                                  className={
                                    disc.estado === "Aprovado"
                                      ? "bg-success/20 text-success border-0"
                                      : disc.estado === "Reprovado"
                                        ? "bg-destructive/20 text-destructive border-0"
                                        : "bg-primary/20 text-primary border-0"
                                  }
                                >
                                  {disc.estado}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => window.print()} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Imprimir
                      </Button>
                      <Button onClick={() => handleExportPDF(selectedAluno)} className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar PDF
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
