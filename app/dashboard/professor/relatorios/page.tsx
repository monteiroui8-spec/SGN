"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROFESSOR_TURMAS, TURMA_ALUNOS, TRIMESTRES } from "@/lib/mock-data"
import { exportToCSV, generatePrintContent } from "@/lib/export-utils"
import { BarChart3, FileSpreadsheet, FileText, TrendingUp, Users, Award, AlertTriangle, Printer } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { useToast } from "@/hooks/use-toast"

export default function ProfessorRelatoriosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [selectedTurma, setSelectedTurma] = useState(PROFESSOR_TURMAS[0]?.id.toString() || "")
  const [selectedTrimestre, setSelectedTrimestre] = useState("TRI002")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "professor") {
      router.push("/login/professor")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "professor") {
    return null
  }

  const turmaAtual = PROFESSOR_TURMAS.find((t) => t.id.toString() === selectedTurma)

  const distribuicaoNotas = [
    { range: "0-9", count: TURMA_ALUNOS.filter((a) => a.media !== null && a.media < 10).length, fill: "#F43F5E" },
    {
      range: "10-13",
      count: TURMA_ALUNOS.filter((a) => a.media !== null && a.media >= 10 && a.media < 14).length,
      fill: "#F97316",
    },
    {
      range: "14-16",
      count: TURMA_ALUNOS.filter((a) => a.media !== null && a.media >= 14 && a.media < 17).length,
      fill: "#2563EB",
    },
    { range: "17-20", count: TURMA_ALUNOS.filter((a) => a.media !== null && a.media >= 17).length, fill: "#14B8A6" },
  ]

  const aprovacaoData = [
    { name: "Aprovados", value: TURMA_ALUNOS.filter((a) => a.media !== null && a.media >= 10).length, fill: "#14B8A6" },
    { name: "Reprovados", value: TURMA_ALUNOS.filter((a) => a.media !== null && a.media < 10).length, fill: "#F43F5E" },
    { name: "Pendentes", value: TURMA_ALUNOS.filter((a) => a.media === null).length, fill: "#F97316" },
  ]

  const evolucaoMedia = [
    { mes: "Set", media: 12.8 },
    { mes: "Out", media: 13.5 },
    { mes: "Nov", media: 14.2 },
    { mes: "Dez", media: 14.5 },
    { mes: "Jan", media: 14.8 },
    { mes: "Fev", media: turmaAtual?.mediaGeral || 14.5 },
  ]

  const handleExportExcel = () => {
    const data = TURMA_ALUNOS.map((aluno) => ({
      numero: aluno.numero,
      nome: aluno.nome,
      p1: aluno.p1,
      p2: aluno.p2,
      trabalho: aluno.trabalho,
      exame: aluno.exame ?? "",
      media: aluno.media ?? "",
      estado: aluno.estado,
    }))

    exportToCSV(data, `relatorio_${turmaAtual?.nome}_${new Date().toISOString().split("T")[0]}`, {
      numero: "Número",
      nome: "Nome",
      p1: "P1",
      p2: "P2",
      trabalho: "Trabalho",
      exame: "Exame",
      media: "Média",
      estado: "Estado",
    })

    toast({
      title: "Exportação concluída",
      description: "O ficheiro Excel foi descarregado com sucesso.",
    })
  }

  const handleExportPDF = () => {
    const content = `
      <div class="header">
        <h1>Instituto Politécnico do Mayombe</h1>
        <p>Relatório de Desempenho - ${turmaAtual?.nome}</p>
        <p style="margin-top: 10px;">Disciplina: ${turmaAtual?.disciplina}</p>
      </div>

      <div class="info-grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="info-item">
          <label>Total de Alunos</label>
          <span>${turmaAtual?.totalAlunos}</span>
        </div>
        <div class="info-item">
          <label>Média da Turma</label>
          <span>${turmaAtual?.mediaGeral.toFixed(1)}</span>
        </div>
        <div class="info-item">
          <label>Taxa de Aprovação</label>
          <span>${((TURMA_ALUNOS.filter((a) => a.media !== null && a.media >= 10).length / TURMA_ALUNOS.filter((a) => a.media !== null).length) * 100).toFixed(0)}%</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Nome</th>
            <th class="text-center">P1</th>
            <th class="text-center">P2</th>
            <th class="text-center">Trab.</th>
            <th class="text-center">Exame</th>
            <th class="text-center">Média</th>
            <th class="text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${TURMA_ALUNOS.map(
            (aluno) => `
            <tr>
              <td>${aluno.numero}</td>
              <td>${aluno.nome}</td>
              <td class="text-center">${aluno.p1}</td>
              <td class="text-center">${aluno.p2}</td>
              <td class="text-center">${aluno.trabalho}</td>
              <td class="text-center">${aluno.exame ?? "-"}</td>
              <td class="text-center font-bold ${aluno.media !== null ? (aluno.media >= 10 ? "text-success" : "text-danger") : ""}">${aluno.media?.toFixed(1) ?? "-"}</td>
              <td class="text-center">
                <span class="badge ${aluno.estado === "Aprovado" ? "badge-success" : aluno.estado === "Rascunho" ? "badge-warning" : "badge-info"}">${aluno.estado}</span>
              </td>
            </tr>
          `,
          ).join("")}
        </tbody>
      </table>

      <div class="print-date">
        Gerado em: ${new Date().toLocaleDateString("pt-AO", { dateStyle: "full" })}
      </div>
    `

    generatePrintContent(`Relatório - ${turmaAtual?.nome}`, content)
    toast({
      title: "PDF gerado",
      description: "O relatório PDF foi aberto para impressão.",
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
                  <BarChart3 className="w-7 h-7 text-primary" />
                  Relatórios
                </h1>
                <p className="text-muted-foreground">Análise de desempenho das turmas</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSOR_TURMAS.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id.toString()}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                  <SelectTrigger className="w-40">
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
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportExcel} className="gap-2 bg-transparent">
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Excel
              </Button>
              <Button variant="outline" onClick={handleExportPDF} className="gap-2 bg-transparent">
                <FileText className="w-4 h-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{turmaAtual?.totalAlunos}</p>
                    <p className="text-xs text-muted-foreground">Total Alunos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{turmaAtual?.mediaGeral.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Média da Turma</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{turmaAtual?.notasAprovadas}</p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">{turmaAtual?.notasPendentes}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução da Média */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Evolução da Média
                  </CardTitle>
                  <CardDescription>Progresso ao longo do período</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={evolucaoMedia}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
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
                        dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Taxa de Aprovação */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-success" />
                    Taxa de Aprovação
                  </CardTitle>
                  <CardDescription>Distribuição por estado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={aprovacaoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {aprovacaoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {aprovacaoData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span>
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribuição de Notas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Distribuição de Notas
                </CardTitle>
                <CardDescription>Agrupamento por faixa de notas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={distribuicaoNotas}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--card))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {distribuicaoNotas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lista de Alunos */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Alunos - {turmaAtual?.nome}</CardTitle>
                <CardDescription>
                  {turmaAtual?.disciplina} - {turmaAtual?.curso}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Aluno</th>
                        <th className="text-center py-3 px-2 font-semibold text-sm">P1</th>
                        <th className="text-center py-3 px-2 font-semibold text-sm">P2</th>
                        <th className="text-center py-3 px-2 font-semibold text-sm">Trab.</th>
                        <th className="text-center py-3 px-2 font-semibold text-sm">Exame</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm">Média</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TURMA_ALUNOS.map((aluno, index) => (
                        <tr key={aluno.id} className="border-t border-border hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={aluno.foto || "/placeholder.svg?height=32&width=32&query=student"}
                                alt={aluno.nome}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm">{aluno.nome}</p>
                                <p className="text-xs text-muted-foreground">{aluno.numero}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3 px-2">{aluno.p1}</td>
                          <td className="text-center py-3 px-2">{aluno.p2}</td>
                          <td className="text-center py-3 px-2">{aluno.trabalho}</td>
                          <td className="text-center py-3 px-2">{aluno.exame ?? "-"}</td>
                          <td className="text-center py-3 px-4">
                            <span
                              className={`font-bold ${aluno.media !== null ? (aluno.media >= 10 ? "text-success" : "text-destructive") : "text-muted-foreground"}`}
                            >
                              {aluno.media?.toFixed(1) ?? "-"}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge
                              className={
                                aluno.estado === "Aprovado"
                                  ? "bg-success/20 text-success border-0"
                                  : aluno.estado === "Rascunho"
                                    ? "bg-warning/20 text-warning border-0"
                                    : "bg-primary/20 text-primary border-0"
                              }
                            >
                              {aluno.estado}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
