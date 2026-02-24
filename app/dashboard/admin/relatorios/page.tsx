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
import {
  ADMIN_STATS,
  EVOLUCAO_MATRICULAS,
  DISTRIBUICAO_CURSOS,
  DESEMPENHO_DISCIPLINAS,
  COMPARATIVO_TRIMESTRES,
  RELATORIOS_DISPONIVEIS,
  CURSOS,
  TRIMESTRES,
} from "@/lib/mock-data"
import { exportToCSV, generatePrintContent } from "@/lib/export-utils"
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  Printer,
  Calendar,
  School,
} from "lucide-react"
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
  AreaChart,
  Area,
} from "recharts"
import { useToast } from "@/hooks/use-toast"

export default function AdminRelatoriosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [selectedReport, setSelectedReport] = useState("REL001")
  const [selectedCurso, setSelectedCurso] = useState("all")
  const [selectedTrimestre, setSelectedTrimestre] = useState("TRI002")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const COLORS = ["#2563EB", "#14B8A6", "#F97316", "#F43F5E", "#0EA5E9"]

  const handleExportExcel = () => {
    const report = RELATORIOS_DISPONIVEIS.find((r) => r.id === selectedReport)

    let data: Record<string, unknown>[] = []
    let headers: Record<string, string> = {}

    switch (selectedReport) {
      case "REL001":
        data = COMPARATIVO_TRIMESTRES.map((t) => ({ turma: t.turma, t1: t.t1, t2: t.t2, t3: t.t3 || "" }))
        headers = { turma: "Turma", t1: "1º Trim.", t2: "2º Trim.", t3: "3º Trim." }
        break
      case "REL002":
        data = DESEMPENHO_DISCIPLINAS.map((d) => ({
          disciplina: d.disciplina,
          media: d.media,
          aprovados: `${d.aprovados}%`,
        }))
        headers = { disciplina: "Disciplina", media: "Média", aprovados: "Taxa Aprovação" }
        break
      case "REL005":
        data = EVOLUCAO_MATRICULAS
        headers = { ano: "Ano", alunos: "Alunos", professores: "Professores" }
        break
      default:
        data = DISTRIBUICAO_CURSOS.map((c) => ({ curso: c.nome, alunos: c.value }))
        headers = { curso: "Curso", alunos: "Alunos" }
    }

    exportToCSV(data, `${report?.nome.replace(/ /g, "_")}_${new Date().toISOString().split("T")[0]}`, headers)

    toast({
      title: "Exportação concluída",
      description: `Relatório "${report?.nome}" exportado com sucesso.`,
    })
  }

  const handleExportPDF = () => {
    const report = RELATORIOS_DISPONIVEIS.find((r) => r.id === selectedReport)

    const content = `
      <div class="header">
        <h1>Instituto Politécnico do Mayombe</h1>
        <p>${report?.nome}</p>
        <p style="margin-top: 10px;">Gerado em: ${new Date().toLocaleDateString("pt-AO", { dateStyle: "full" })}</p>
      </div>

      <div class="info-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="info-item">
          <label>Total Alunos</label>
          <span>${ADMIN_STATS.totalAlunos}</span>
        </div>
        <div class="info-item">
          <label>Professores</label>
          <span>${ADMIN_STATS.totalProfessores}</span>
        </div>
        <div class="info-item">
          <label>Taxa Aprovação</label>
          <span>${ADMIN_STATS.taxaAprovacao}%</span>
        </div>
        <div class="info-item">
          <label>Média Geral</label>
          <span>${ADMIN_STATS.mediaGeral}</span>
        </div>
      </div>

      <h3 style="margin: 20px 0 10px; color: #0F172A;">Comparativo por Turma</h3>
      <table>
        <thead>
          <tr>
            <th>Turma</th>
            <th class="text-center">1º Trimestre</th>
            <th class="text-center">2º Trimestre</th>
            <th class="text-center">3º Trimestre</th>
          </tr>
        </thead>
        <tbody>
          ${COMPARATIVO_TRIMESTRES.map(
            (t) => `
            <tr>
              <td>${t.turma}</td>
              <td class="text-center">${t.t1}</td>
              <td class="text-center">${t.t2}</td>
              <td class="text-center">${t.t3 || "-"}</td>
            </tr>
          `,
          ).join("")}
        </tbody>
      </table>

      <h3 style="margin: 20px 0 10px; color: #0F172A;">Desempenho por Disciplina</h3>
      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th class="text-center">Média</th>
            <th class="text-center">Taxa Aprovação</th>
          </tr>
        </thead>
        <tbody>
          ${DESEMPENHO_DISCIPLINAS.map(
            (d) => `
            <tr>
              <td>${d.disciplina}</td>
              <td class="text-center font-bold ${d.media >= 10 ? "text-success" : "text-danger"}">${d.media}</td>
              <td class="text-center">${d.aprovados}%</td>
            </tr>
          `,
          ).join("")}
        </tbody>
      </table>

      <div class="print-date">
        Relatório gerado pelo Sistema de Gestão Escolar do IPM
      </div>
    `

    generatePrintContent(`Relatório - ${report?.nome}`, content)
    toast({
      title: "PDF gerado",
      description: "O relatório foi aberto para impressão.",
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
                <p className="text-muted-foreground">Análises e estatísticas do sistema</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportExcel} className="gap-2 bg-transparent">
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </Button>
                <Button variant="outline" onClick={handleExportPDF} className="gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Tipo de Relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATORIOS_DISPONIVEIS.map((rel) => (
                        <SelectItem key={rel.id} value={rel.id}>
                          {rel.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                      {CURSOS.map((curso) => (
                        <SelectItem key={curso.id} value={curso.id}>
                          {curso.sigla}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Período" />
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ADMIN_STATS.totalAlunos}</p>
                    <p className="text-xs text-muted-foreground">Total Alunos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ADMIN_STATS.totalProfessores}</p>
                    <p className="text-xs text-muted-foreground">Professores</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{ADMIN_STATS.taxaAprovacao}%</p>
                    <p className="text-xs text-muted-foreground">Taxa Aprovação</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ADMIN_STATS.mediaGeral}</p>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução de Matrículas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Evolução de Matrículas
                  </CardTitle>
                  <CardDescription>Crescimento ao longo dos anos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={EVOLUCAO_MATRICULAS}>
                      <defs>
                        <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="ano" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(var(--card))",
                          border: "1px solid rgb(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="alunos"
                        stroke="#2563EB"
                        strokeWidth={3}
                        fill="url(#colorAlunos)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição por Curso */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5 text-secondary" />
                    Alunos por Curso
                  </CardTitle>
                  <CardDescription>Distribuição actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={DISTRIBUICAO_CURSOS}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {DISTRIBUICAO_CURSOS.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {DISTRIBUICAO_CURSOS.map((item, index) => (
                      <div key={item.nome} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="truncate">
                          {item.sigla}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desempenho por Disciplina */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Desempenho por Disciplina
                </CardTitle>
                <CardDescription>Média e taxa de aprovação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={DESEMPENHO_DISCIPLINAS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" domain={[0, 20]} className="text-xs" />
                    <YAxis dataKey="disciplina" type="category" width={80} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--card))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="media" name="Média" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Comparativo Trimestral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-success" />
                  Comparativo Trimestral por Turma
                </CardTitle>
                <CardDescription>Evolução das médias por trimestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-semibold">Turma</th>
                        <th className="text-center py-3 px-4 font-semibold">1º Trimestre</th>
                        <th className="text-center py-3 px-4 font-semibold">2º Trimestre</th>
                        <th className="text-center py-3 px-4 font-semibold">3º Trimestre</th>
                        <th className="text-center py-3 px-4 font-semibold">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARATIVO_TRIMESTRES.map((turma) => {
                        const variacao = turma.t2 - turma.t1
                        return (
                          <tr key={turma.turma} className="border-t border-border">
                            <td className="py-3 px-4 font-medium">{turma.turma}</td>
                            <td className="text-center py-3 px-4">{turma.t1}</td>
                            <td className="text-center py-3 px-4">{turma.t2}</td>
                            <td className="text-center py-3 px-4">{turma.t3 ?? "-"}</td>
                            <td className="text-center py-3 px-4">
                              <Badge
                                className={
                                  variacao >= 0
                                    ? "bg-success/20 text-success border-0"
                                    : "bg-destructive/20 text-destructive border-0"
                                }
                              >
                                {variacao >= 0 ? "+" : ""}
                                {variacao.toFixed(1)}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Available Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Disponíveis</CardTitle>
                <CardDescription>Selecione um relatório para gerar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {RELATORIOS_DISPONIVEIS.map((rel) => (
                    <div
                      key={rel.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                        selectedReport === rel.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setSelectedReport(rel.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{rel.nome}</p>
                          <p className="text-xs text-muted-foreground mt-1">{rel.descricao}</p>
                          <Badge variant="outline" className="mt-2 text-xs capitalize">
                            {rel.tipo}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
