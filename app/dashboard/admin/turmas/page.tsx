"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getTurmasProfessor } from "@/lib/api"
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  GraduationCap, Users, BookOpen, Download, Loader2,
  HelpCircle, Link as LinkIcon
} from "lucide-react"

interface Turma {
  id: number
  nome: string
  ano: number
  nivel: string
  periodo: string
  total_alunos: number
  disciplinas: string[]
  extra_disciplinas: number
}

const PAGE_SIZE = 5

const DEMO_TURMAS: Turma[] = [
  { id: 1, nome: "CONT-10A", ano: 2024, nivel: "10º Ano - Contabilidade", periodo: "Matutino", total_alunos: 28, disciplinas: ["Matemática", "Português", "Contabilidade"], extra_disciplinas: 6 },
  { id: 2, nome: "CONT-10B", ano: 2024, nivel: "10º Ano - Contabilidade", periodo: "Vespertino", total_alunos: 25, disciplinas: ["Matemática", "Física", "Economia"], extra_disciplinas: 5 },
  { id: 3, nome: "CONT-11A", ano: 2024, nivel: "11º Ano - Contabilidade", periodo: "Matutino", total_alunos: 30, disciplinas: ["Artes", "Ed. Física", "Inglês"], extra_disciplinas: 4 },
  { id: 4, nome: "CONT-11B", ano: 2024, nivel: "11º Ano - Contabilidade", periodo: "Matutino", total_alunos: 32, disciplinas: ["Sociologia", "Filosofia", "Redação"], extra_disciplinas: 3 },
  { id: 5, nome: "CONT-12A", ano: 2024, nivel: "12º Ano - Contabilidade", periodo: "Vespertino", total_alunos: 22, disciplinas: ["História", "Geografia", "Ciências"], extra_disciplinas: 2 },
  { id: 6, nome: "IG-10A", ano: 2024, nivel: "10º Ano - Inf. de Gestão", periodo: "Matutino", total_alunos: 26, disciplinas: ["Informática", "Matemática", "Redes"], extra_disciplinas: 4 },
  { id: 7, nome: "IG-10B", ano: 2024, nivel: "10º Ano - Inf. de Gestão", periodo: "Vespertino", total_alunos: 24, disciplinas: ["Programação", "BD", "Sistemas"], extra_disciplinas: 3 },
]

export default function AdminTurmasPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [turmas, setTurmas] = useState<Turma[]>(DEMO_TURMAS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") router.push("/")
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") return null

  const filtradas = turmas.filter((t) =>
    t.nome.toLowerCase().includes(search.toLowerCase()) ||
    t.nivel.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtradas.length / PAGE_SIZE)
  const paginadas = filtradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalAlunos = turmas.reduce((s, t) => s + t.total_alunos, 0)
  const totalDisciplinas = new Set(turmas.flatMap((t) => t.disciplinas)).size

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gestão Académica &rsaquo; <span className="text-primary">Turmas</span></p>
                <h1 className="text-3xl font-bold">Gestão de Turmas</h1>
                <p className="text-muted-foreground mt-1">Gerencie a estrutura das salas, anos letivos e suas respectivas disciplinas.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />Filtrar
                </Button>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />Nova Turma
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Turmas</p>
                    <p className="text-2xl font-bold">{turmas.length}</p>
                    <p className="text-xs text-green-600 mt-0.5">+2 criadas este mês</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alunos Activos</p>
                    <p className="text-2xl font-bold">{totalAlunos}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">96.5% de ocupação</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplinas Vinculadas</p>
                    <p className="text-2xl font-bold">55</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Média de 8 por turma</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pesquisa + Tabela */}
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar por nome da turma ou ano..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Exibindo {paginadas.length} de {filtradas.length} turmas</p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Nome da Turma", "Ano / Nível", "Período", "Alunos", "Disciplinas", "Ações"].map((h) => (
                          <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginadas.map((turma, i) => (
                        <motion.tr
                          key={turma.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {turma.nome.split("-")[1]?.charAt(0) || turma.ano.toString().slice(-2)}
                              </div>
                              <span className="font-medium text-sm">{turma.nome}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium">{turma.ano}</p>
                            <p className="text-xs text-muted-foreground">{turma.nivel}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm px-2.5 py-1 rounded-md bg-muted text-foreground">
                              {turma.periodo}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Users className="w-3.5 h-3.5 text-muted-foreground" />
                              {turma.total_alunos}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 flex-wrap">
                              {turma.disciplinas.map((d) => (
                                <span key={d} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{d}</span>
                              ))}
                              {turma.extra_disciplinas > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">+{turma.extra_disciplinas} mais</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              •••
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Paginação */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtradas.length)} de {filtradas.length} entradas
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button key={p} variant={page === p ? "default" : "outline"} size="icon" className="w-8 h-8 text-sm" onClick={() => setPage(p)}>
                        {p}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Próximo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ajuda + Importação em Massa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0F172A] text-white border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Novo no sistema?</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Aprenda como estruturar as turmas e vincular professores e disciplinas de forma automatizada.
                  </p>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Acessar Guia de Ajuda
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <LinkIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Importação em Massa</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Precisa carregar muitas turmas de uma vez? Use nossa ferramenta de importação via CSV.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />Baixar Modelo Excel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}