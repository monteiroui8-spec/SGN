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
import { CURSOS } from "@/lib/mock-data"
import { Users, Search, Plus, GraduationCap, Clock, School } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock turmas data
const TURMAS = [
  { id: "TUR001", nome: "IG-1A", cursoId: "CUR001", ano: 1, turno: "Manhã", totalAlunos: 35, sala: "A101" },
  { id: "TUR002", nome: "IG-1B", cursoId: "CUR001", ano: 1, turno: "Tarde", totalAlunos: 32, sala: "A102" },
  { id: "TUR003", nome: "IG-2A", cursoId: "CUR001", ano: 2, turno: "Manhã", totalAlunos: 30, sala: "B201" },
  { id: "TUR004", nome: "IG-3A", cursoId: "CUR001", ano: 3, turno: "Manhã", totalAlunos: 28, sala: "C301" },
  { id: "TUR005", nome: "EI-1A", cursoId: "CUR002", ano: 1, turno: "Manhã", totalAlunos: 34, sala: "A103" },
  { id: "TUR006", nome: "EI-2A", cursoId: "CUR002", ano: 2, turno: "Tarde", totalAlunos: 31, sala: "B202" },
  { id: "TUR007", nome: "CG-1A", cursoId: "CUR003", ano: 1, turno: "Manhã", totalAlunos: 40, sala: "D101" },
  { id: "TUR008", nome: "CG-2A", cursoId: "CUR003", ano: 2, turno: "Manhã", totalAlunos: 38, sala: "D201" },
  { id: "TUR009", nome: "ENF-1A", cursoId: "CUR004", ano: 1, turno: "Manhã", totalAlunos: 30, sala: "E101" },
  { id: "TUR010", nome: "ENF-2A", cursoId: "CUR004", ano: 2, turno: "Tarde", totalAlunos: 28, sala: "E201" },
]

export default function AdminTurmasPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCurso, setSelectedCurso] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const filteredTurmas = TURMAS.filter((turma) => {
    const matchesSearch = turma.nome.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCurso = selectedCurso === "all" || turma.cursoId === selectedCurso
    return matchesSearch && matchesCurso
  })

  const totalAlunos = TURMAS.reduce((acc, t) => acc + t.totalAlunos, 0)

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
                  <Users className="w-7 h-7 text-primary" />
                  Gestão de Turmas
                </h1>
                <p className="text-muted-foreground">Gerir turmas e alocação de alunos</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Turma
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
                    <p className="text-2xl font-bold">{TURMAS.length}</p>
                    <p className="text-xs text-muted-foreground">Total Turmas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalAlunos}</p>
                    <p className="text-xs text-muted-foreground">Total Alunos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{TURMAS.filter((t) => t.turno === "Manhã").length}</p>
                    <p className="text-xs text-muted-foreground">Turno Manhã</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <School className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{TURMAS.filter((t) => t.turno === "Tarde").length}</p>
                    <p className="text-xs text-muted-foreground">Turno Tarde</p>
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
                      placeholder="Pesquisar turma..."
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
                          {curso.sigla}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTurmas.map((turma) => {
                const curso = CURSOS.find((c) => c.id === turma.cursoId)
                return (
                  <Card key={turma.id} className="card-hover">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{turma.nome}</h3>
                          <p className="text-sm text-muted-foreground">{curso?.nome}</p>
                        </div>
                        <Badge variant="outline">{turma.ano}º Ano</Badge>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Alunos:</span>
                          <span className="font-medium">{turma.totalAlunos}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Turno:</span>
                          <Badge
                            className={
                              turma.turno === "Manhã"
                                ? "bg-amber-500/20 text-amber-600 border-0"
                                : "bg-indigo-500/20 text-indigo-600 border-0"
                            }
                          >
                            {turma.turno}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sala:</span>
                          <span className="font-medium">{turma.sala}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
