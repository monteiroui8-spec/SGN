"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ALUNO_DISCIPLINAS, TRIMESTRES, DEMO_ACCOUNTS } from "@/lib/mock-data"
import { FileText, Download, Printer, GraduationCap, Award, TrendingUp, Calendar } from "lucide-react"
import { useState } from "react"

export default function AlunoBoletimPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedTrimestre, setSelectedTrimestre] = useState("TRI001")
  const boletimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "aluno") {
      router.push("/login/aluno")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "aluno") {
    return null
  }

  const aluno = DEMO_ACCOUNTS.aluno
  const trimestreAtual = TRIMESTRES.find((t) => t.id === selectedTrimestre)

  const disciplinasFiltradas = ALUNO_DISCIPLINAS.filter((d) =>
    selectedTrimestre === "TRI001" ? d.trimestre === "1º Trimestre" : d.estado !== undefined,
  )

  const mediaGeral =
    disciplinasFiltradas.filter((d) => d.media !== null).reduce((acc, d) => acc + (d.media || 0), 0) /
      disciplinasFiltradas.filter((d) => d.media !== null).length || 0

  const aprovadas = disciplinasFiltradas.filter((d) => d.estado === "Aprovado").length
  const total = disciplinasFiltradas.length

  const handleDownloadPDF = () => {
    alert("Download do boletim em PDF iniciado!")
  }

  const handlePrint = () => {
    window.print()
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
                  Boletim de Notas
                </h1>
                <p className="text-muted-foreground">Visualizar e descarregar boletim trimestral</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIMESTRES.filter((t) => t.estado !== "Pendente").map((tri) => (
                      <SelectItem key={tri.id} value={tri.id}>
                        {tri.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mediaGeral.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{aprovadas}</p>
                    <p className="text-xs text-muted-foreground">Aprovadas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{total}</p>
                    <p className="text-xs text-muted-foreground">Total Disciplinas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{trimestreAtual?.nome}</p>
                    <p className="text-xs text-muted-foreground">Período</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Boletim */}
            <Card ref={boletimRef} className="print:shadow-none">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Instituto Politécnico do Mayombe</h2>
                      <p className="text-sm text-muted-foreground">Boletim de Avaliação - {trimestreAtual?.nome}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Ano Lectivo 2024/2025
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Dados do Aluno */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Nome do Aluno</p>
                    <p className="font-semibold">{aluno.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Número</p>
                    <p className="font-semibold">{aluno.numeroAluno}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Curso</p>
                    <p className="font-semibold">{aluno.curso}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Turma / Ano</p>
                    <p className="font-semibold">
                      {aluno.turma} - {aluno.ano}º Ano
                    </p>
                  </div>
                </div>

                {/* Tabela de Notas */}
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-4 px-4 font-semibold">Disciplina</th>
                        <th className="text-center py-4 px-2 font-semibold">P1</th>
                        <th className="text-center py-4 px-2 font-semibold">P2</th>
                        <th className="text-center py-4 px-2 font-semibold">Trab.</th>
                        <th className="text-center py-4 px-2 font-semibold">Exame</th>
                        <th className="text-center py-4 px-4 font-semibold">Média</th>
                        <th className="text-center py-4 px-4 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disciplinasFiltradas.map((disciplina, index) => (
                        <motion.tr
                          key={disciplina.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-t border-border hover:bg-muted/30"
                        >
                          <td className="py-4 px-4">
                            <p className="font-medium">{disciplina.nome}</p>
                            <p className="text-xs text-muted-foreground">{disciplina.professor}</p>
                          </td>
                          <td className="text-center py-4 px-2 font-medium">{disciplina.notas.p1}</td>
                          <td className="text-center py-4 px-2 font-medium">{disciplina.notas.p2}</td>
                          <td className="text-center py-4 px-2 font-medium">{disciplina.notas.trabalho}</td>
                          <td className="text-center py-4 px-2 font-medium">{disciplina.notas.exame ?? "-"}</td>
                          <td className="text-center py-4 px-4">
                            <span
                              className={`text-lg font-bold ${
                                disciplina.media !== null
                                  ? disciplina.media >= 10
                                    ? "text-success"
                                    : "text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {disciplina.media?.toFixed(1) ?? "-"}
                            </span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge
                              className={
                                disciplina.estado === "Aprovado"
                                  ? "bg-success/20 text-success border-0"
                                  : disciplina.estado === "Reprovado"
                                    ? "bg-destructive/20 text-destructive border-0"
                                    : "bg-primary/20 text-primary border-0"
                              }
                            >
                              {disciplina.estado}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-primary/5 border-t-2 border-primary">
                        <td colSpan={5} className="py-4 px-4 font-bold text-right">
                          Média Geral do Período:
                        </td>
                        <td className="text-center py-4 px-4">
                          <span
                            className={`text-xl font-bold ${mediaGeral >= 10 ? "text-success" : "text-destructive"}`}
                          >
                            {mediaGeral.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <Badge
                            className={
                              mediaGeral >= 10
                                ? "bg-success/20 text-success border-0"
                                : "bg-destructive/20 text-destructive border-0"
                            }
                          >
                            {mediaGeral >= 10 ? "Aprovado" : "Reprovado"}
                          </Badge>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Assinaturas */}
                <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-border">
                  <div className="text-center">
                    <div className="h-16 border-b border-dashed border-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Director de Turma</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-dashed border-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Coordenador de Curso</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-dashed border-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Director Geral</p>
                  </div>
                </div>

                <div className="text-center mt-6 text-xs text-muted-foreground">
                  <p>Documento gerado automaticamente pelo Sistema de Gestão Escolar do IPM</p>
                  <p>Data de emissão: {new Date().toLocaleDateString("pt-AO")}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
