"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DISCIPLINAS, CURSOS } from "@/lib/mock-data"
import { BookMarked, Search, Plus, BookOpen, Clock, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDisciplinasPage() {
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

  const filteredDisciplinas = DISCIPLINAS.filter((disc) => {
    const matchesSearch = disc.nome.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCurso = selectedCurso === "all" || disc.cursoId === selectedCurso
    return matchesSearch && matchesCurso
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BookMarked className="w-7 h-7 text-primary" />
                    Gestão de Disciplinas
                  </h1>
                  <p className="text-muted-foreground">Gerir disciplinas e ementas curriculares</p>
                </div>
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Nova Disciplina
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">{DISCIPLINAS.length}</p>
                      <p className="text-xs text-muted-foreground">Total Disciplinas</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">
                        {DISCIPLINAS.filter((d) => d.tipo === "Nuclear").length}
                      </p>
                      <p className="text-xs text-muted-foreground">Nucleares</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">
                        {DISCIPLINAS.reduce((acc, d) => acc + d.cargaHoraria, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Horas Totais</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <BookMarked className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">
                        {DISCIPLINAS.reduce((acc, d) => acc + d.creditos, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Créditos Totais</p>
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
                        placeholder="Pesquisar disciplina..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                      <SelectTrigger className="w-full sm:w-48">
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

              {/* Table */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Lista de Disciplinas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">Disciplina</th>
                          <th className="text-left py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">Curso</th>
                          <th className="text-center py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">Ano</th>
                          <th className="text-center py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">C. Horária</th>
                          <th className="text-center py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">Créditos</th>
                          <th className="text-center py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">Tipo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDisciplinas.map((disc) => {
                          const curso = CURSOS.find((c) => c.id === disc.cursoId)
                          return (
                            <tr key={disc.id} className="border-t border-border hover:bg-muted/30">
                              <td className="py-3 px-3 sm:px-4">
                                <div>
                                  <p className="font-medium text-xs sm:text-sm">{disc.nome}</p>
                                  <p className="text-xs text-muted-foreground">{disc.sigla}</p>
                                </div>
                              </td>
                              <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm">
                                <Badge variant="outline" className="text-xs">
                                  {curso?.sigla}
                                </Badge>
                              </td>
                              <td className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm">{disc.ano}º</td>
                              <td className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm">{disc.cargaHoraria}h</td>
                              <td className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm">{disc.creditos}</td>
                              <td className="text-center py-3 px-3 sm:px-4">
                                <Badge
                                  className={`text-xs ${
                                    disc.tipo === "Nuclear"
                                      ? "bg-primary/20 text-primary border-0"
                                      : "bg-muted text-muted-foreground border-0"
                                  }`}
                                >
                                  {disc.tipo}
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
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
