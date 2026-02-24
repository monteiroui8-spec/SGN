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
import { CURSOS, DEPARTAMENTOS } from "@/lib/mock-data"
import { School, Plus, Search, Users, BookOpen, Edit, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AdminCursosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const filteredCursos = CURSOS.filter(
    (curso) =>
      curso.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curso.sigla.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCurso = () => {
    toast({
      title: "Curso criado",
      description: "O novo curso foi adicionado ao sistema.",
    })
    setIsAddOpen(false)
  }

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
                    <School className="w-7 h-7 text-primary" />
                    Gestão de Cursos
                  </h1>
                  <p className="text-muted-foreground">Administrar cursos e formações</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 w-full sm:w-auto">
                      <Plus className="w-4 h-4" />
                      Novo Curso
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Curso</DialogTitle>
                      <DialogDescription>Preencha os dados do novo curso</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Nome do Curso</Label>
                        <Input placeholder="Ex: Contabilidade" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Sigla</Label>
                          <Input placeholder="Ex: CONT" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Duração (anos)</Label>
                          <Input type="number" defaultValue={3} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Departamento</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTAMENTOS.map((dep) => (
                              <SelectItem key={dep.id} value={dep.id}>
                                {dep.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Coordenador</Label>
                        <Input placeholder="Nome do coordenador" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddCurso}>Criar Curso</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <School className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">{CURSOS.length}</p>
                      <p className="text-xs text-muted-foreground">Total Cursos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">
                        {CURSOS.reduce((acc, c) => acc + c.totalAlunos, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Alunos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">
                        {CURSOS.reduce((acc, c) => acc + c.totalTurmas, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Turmas</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <School className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold">{DEPARTAMENTOS.length}</p>
                      <p className="text-xs text-muted-foreground">Departamentos</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar curso..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Cursos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCursos.map((curso) => (
                  <motion.div key={curso.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="card-hover h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                            {curso.sigla}
                          </div>
                          <Badge
                            className={
                              curso.estado === "Activo"
                                ? "bg-success/20 text-success border-0"
                                : "bg-muted text-muted-foreground border-0"
                            }
                          >
                            {curso.estado}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{curso.nome}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Coordenador: {curso.coordenador}</p>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                          <div className="text-center">
                            <p className="text-lg font-bold text-primary">{curso.totalAlunos}</p>
                            <p className="text-xs text-muted-foreground">Alunos</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-accent">{curso.totalTurmas}</p>
                            <p className="text-xs text-muted-foreground">Turmas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-secondary">{curso.duracao}</p>
                            <p className="text-xs text-muted-foreground">Anos</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
