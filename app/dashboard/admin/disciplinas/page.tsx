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
import { Badge } from "@/components/ui/badge"
import {
  Search, Filter, Plus, Edit2, UserPlus, BookOpen,
  Users, AlertCircle, MoreVertical, Download, Loader2
} from "lucide-react"

interface Disciplina {
  id: number
  codigo: string
  nome: string
  carga_horaria: number | null
  professor_nome: string | null
  professor_foto: string | null
  status: "Ativa" | "Pendente" | "Inactiva"
}

const DEMO_DISCIPLINAS: Disciplina[] = [
  { id: 1, codigo: "MAT-101", nome: "Matemática Aplicada", carga_horaria: 80, professor_nome: "Dr. Ricardo Silva", professor_foto: null, status: "Ativa" },
  { id: 2, codigo: "LP-102", nome: "Língua Portuguesa", carga_horaria: 60, professor_nome: "Profa. Ana Mendes", professor_foto: null, status: "Ativa" },
  { id: 3, codigo: "FIS-301", nome: "Física Aplicada", carga_horaria: 100, professor_nome: null, professor_foto: null, status: "Pendente" },
  { id: 4, codigo: "CF-201", nome: "Contabilidade Financeira", carga_horaria: 40, professor_nome: "Prof. Marcos Oliveira", professor_foto: null, status: "Ativa" },
  { id: 5, codigo: "INFO-401", nome: "Informática de Gestão", carga_horaria: 80, professor_nome: null, professor_foto: null, status: "Pendente" },
  { id: 6, codigo: "ING-102", nome: "Língua Inglesa", carga_horaria: 60, professor_nome: "Profa. Clara Neto", professor_foto: null, status: "Ativa" },
  { id: 7, codigo: "EF-101", nome: "Educação Física", carga_horaria: 40, professor_nome: "Prof. Luís Ferreira", professor_foto: null, status: "Ativa" },
]

export default function AdminDisciplinasPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(DEMO_DISCIPLINAS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") router.push("/")
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") return null

  const filtradas = disciplinas.filter((d) =>
    d.nome.toLowerCase().includes(search.toLowerCase()) ||
    d.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const ativas = disciplinas.filter((d) => d.status === "Ativa").length
  const semProfessor = disciplinas.filter((d) => !d.professor_nome).length
  const professoresVinculados = disciplinas.filter((d) => d.professor_nome).length

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
                <p className="text-sm text-muted-foreground mb-1">Académico &rsaquo; <span className="text-primary font-medium">Gestão de Disciplinas</span></p>
                <h1 className="text-3xl font-bold">Disciplinas</h1>
                <p className="text-muted-foreground mt-1">Gerencie o currículo escolar e atribua responsabilidades docentes.</p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />Nova Disciplina
              </Button>
            </div>

            {/* Filtros */}
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filtrar por nome ou código da disciplina..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />Filtros Avançados
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />Exportar Lista
              </Button>
            </div>

            {/* Tabela */}
            <Card>
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold">Listagem de Disciplinas</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Exibindo {filtradas.length} registros</p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Código", "Disciplina", "Carga Horária", "Professor Responsável", "Status", "", "Ações"].map((h) => (
                          <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((disc, i) => (
                        <motion.tr
                          key={disc.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{disc.codigo}</td>
                          <td className="px-6 py-4 text-sm font-medium">{disc.nome}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {disc.carga_horaria ? `${disc.carga_horaria}h` : "—"}
                          </td>
                          <td className="px-6 py-4">
                            {disc.professor_nome ? (
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary overflow-hidden flex-shrink-0">
                                  {disc.professor_foto
                                    ? <img src={disc.professor_foto} alt="" className="w-full h-full object-cover" />
                                    : disc.professor_nome.charAt(disc.professor_nome.lastIndexOf(" ") + 1)
                                  }
                                </div>
                                <span className="text-sm">{disc.professor_nome}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-yellow-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Aguardando Atribuição</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={
                                disc.status === "Ativa"
                                  ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400"
                              }
                            >
                              {disc.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-4">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                                <UserPlus className="w-3 h-3" />Associar Professor
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            {/* Stats Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary text-white border-0">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Disciplinas Ativas</p>
                    <p className="text-3xl font-bold">{ativas}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Professores Vinculados</p>
                    <p className="text-3xl font-bold">{professoresVinculados}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Disciplinas Sem Professor</p>
                    <p className="text-3xl font-bold text-yellow-600">{String(semProfessor).padStart(2, "0")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}