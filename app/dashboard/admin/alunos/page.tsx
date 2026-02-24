"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ALUNOS, CURSOS } from "@/lib/mock-data"
import { exportToCSV, parseExcelFile } from "@/lib/export-utils"
import {
  Users,
  UserPlus,
  GraduationCap,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Key,
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type Aluno = (typeof ALUNOS)[0] & {
  encarregadoNome?: string
  encarregadoTelefone?: string
  encarregadoEmail?: string
  encarregadoParentesco?: string
}

export default function AdminAlunosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [alunosList, setAlunosList] = useState<Aluno[]>(
    ALUNOS.map((a) => ({
      ...a,
      encarregadoNome: "Maria da Silva",
      encarregadoTelefone: "+244 912 345 678",
      encarregadoEmail: "encarregado@email.ao",
      encarregadoParentesco: "Mãe",
    })),
  )

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null)
  const [importedData, setImportedData] = useState<Record<string, string>[]>([])

  const [newAluno, setNewAluno] = useState({
    nome: "",
    email: "",
    curso: "",
    turma: "",
    ano: "",
    telefone: "",
    encarregadoNome: "",
    encarregadoTelefone: "",
    encarregadoEmail: "",
    encarregadoParentesco: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const handleAddAluno = () => {
    const newId = `ALU${String(alunosList.length + 1).padStart(3, "0")}`
    const newNumero = `2024${String(Math.floor(Math.random() * 900000) + 100000)}`

    const aluno: Aluno = {
      id: newId,
      numero: newNumero,
      nome: newAluno.nome,
      email: newAluno.email || `${newAluno.nome.toLowerCase().replace(/ /g, ".")}@aluno.ipmayombe.ao`,
      curso: CURSOS.find((c) => c.id === newAluno.curso)?.nome || "",
      turma: newAluno.turma,
      ano: Number.parseInt(newAluno.ano) || 1,
      estado: "Activo",
      media: 0,
      foto: "/diverse-students-studying.png",
      encarregadoNome: newAluno.encarregadoNome,
      encarregadoTelefone: newAluno.encarregadoTelefone,
      encarregadoEmail: newAluno.encarregadoEmail,
      encarregadoParentesco: newAluno.encarregadoParentesco,
    }

    setAlunosList([...alunosList, aluno])
    toast({
      title: "Aluno registado com sucesso!",
      description: `${newAluno.nome} foi adicionado ao sistema.`,
    })
    setIsAddDialogOpen(false)
    setNewAluno({
      nome: "",
      email: "",
      curso: "",
      turma: "",
      ano: "",
      telefone: "",
      encarregadoNome: "",
      encarregadoTelefone: "",
      encarregadoEmail: "",
      encarregadoParentesco: "",
    })
  }

  const handleEditAluno = () => {
    if (!selectedAluno) return

    setAlunosList(alunosList.map((a) => (a.id === selectedAluno.id ? { ...selectedAluno } : a)))

    toast({
      title: "Aluno actualizado",
      description: `Os dados de ${selectedAluno.nome} foram actualizados.`,
    })
    setIsEditDialogOpen(false)
    setSelectedAluno(null)
  }

  const handleDeleteAluno = () => {
    if (!selectedAluno) return

    setAlunosList(alunosList.filter((a) => a.id !== selectedAluno.id))

    toast({
      title: "Aluno removido",
      description: `${selectedAluno.nome} foi removido do sistema.`,
      variant: "destructive",
    })
    setIsDeleteDialogOpen(false)
    setSelectedAluno(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const data = await parseExcelFile(file)
      setImportedData(data)
      setIsImportDialogOpen(true)
    } catch (error) {
      toast({
        title: "Erro ao ler ficheiro",
        description: "Verifique se o ficheiro está no formato correcto (CSV/Excel).",
        variant: "destructive",
      })
    }
  }

  const handleImportAlunos = () => {
    const newAlunos: Aluno[] = importedData.map((row, index) => ({
      id: `ALU${String(alunosList.length + index + 1).padStart(3, "0")}`,
      numero: row.numero || `2024${String(Math.floor(Math.random() * 900000) + 100000)}`,
      nome: row.nome || "",
      email: row.email || `aluno${index}@aluno.ipmayombe.ao`,
      curso: row.curso || "",
      turma: row.turma || "",
      ano: Number.parseInt(row.ano) || 1,
      estado: "Activo",
      media: Number.parseFloat(row.media) || 0,
      foto: "/diverse-students-studying.png",
      encarregadoNome: row.encarregado_nome || row.encarregadonome || "",
      encarregadoTelefone: row.encarregado_telefone || row.encarregadotelefone || "",
      encarregadoEmail: row.encarregado_email || row.encarregadoemail || "",
      encarregadoParentesco: row.parentesco || "Mãe",
    }))

    setAlunosList([...alunosList, ...newAlunos])
    toast({
      title: "Importação concluída",
      description: `${newAlunos.length} alunos foram importados com sucesso.`,
    })
    setIsImportDialogOpen(false)
    setImportedData([])
  }

  const handleExportExcel = () => {
    const data = alunosList.map((a) => ({
      numero: a.numero,
      nome: a.nome,
      email: a.email,
      curso: a.curso,
      turma: a.turma,
      ano: a.ano,
      media: a.media,
      estado: a.estado,
      encarregado_nome: a.encarregadoNome || "",
      encarregado_telefone: a.encarregadoTelefone || "",
      encarregado_email: a.encarregadoEmail || "",
      parentesco: a.encarregadoParentesco || "",
    }))

    exportToCSV(data, `alunos_${new Date().toISOString().split("T")[0]}`, {
      numero: "Número",
      nome: "Nome",
      email: "Email",
      curso: "Curso",
      turma: "Turma",
      ano: "Ano",
      media: "Média",
      estado: "Estado",
      encarregado_nome: "Encarregado",
      encarregado_telefone: "Tel. Encarregado",
      encarregado_email: "Email Encarregado",
      parentesco: "Parentesco",
    })

    toast({
      title: "Exportação concluída",
      description: `${data.length} alunos exportados para Excel.`,
    })
  }

  const handleDownloadTemplate = () => {
    const template = [
      {
        numero: "2024001234",
        nome: "Nome do Aluno",
        email: "email@aluno.ipmayombe.ao",
        curso: "Informática de Gestão",
        turma: "IG-1A",
        ano: "1",
        encarregado_nome: "Nome do Encarregado",
        encarregado_telefone: "+244 9XX XXX XXX",
        encarregado_email: "email@exemplo.ao",
        parentesco: "Mãe",
      },
    ]

    exportToCSV(template, "modelo_importacao_alunos", {
      numero: "Número",
      nome: "Nome",
      email: "Email",
      curso: "Curso",
      turma: "Turma",
      ano: "Ano",
      encarregado_nome: "Encarregado Nome",
      encarregado_telefone: "Encarregado Telefone",
      encarregado_email: "Encarregado Email",
      parentesco: "Parentesco",
    })

    toast({
      title: "Modelo descarregado",
      description: "Use este modelo para importar alunos em massa.",
    })
  }

  const columns = [
    {
      key: "nome",
      label: "Aluno",
      render: (item: Aluno) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
            <img
              src={item.foto || "/placeholder.svg?height=40&width=40&query=student"}
              alt={item.nome}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{item.nome}</p>
            <p className="text-xs text-muted-foreground">{item.numero}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item: Aluno) => <span className="text-sm">{item.email}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (item: Aluno) => (
        <div>
          <p className="font-medium text-sm">{item.curso}</p>
          <p className="text-xs text-muted-foreground">
            {item.turma} - {item.ano}º Ano
          </p>
        </div>
      ),
    },
    {
      key: "media",
      label: "Média",
      render: (item: Aluno) => (
        <span
          className={`font-semibold ${item.media >= 14 ? "text-success" : item.media >= 10 ? "text-warning" : "text-destructive"}`}
        >
          {item.media?.toFixed(1) || "-"}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: Aluno) => (
        <Badge variant={item.estado === "Activo" ? "default" : "secondary"} className="font-normal">
          {item.estado}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: Aluno) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedAluno(item)
                setIsViewDialogOpen(true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedAluno(item)
                setIsEditDialogOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Key className="w-4 h-4 mr-2" />
              Resetar senha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedAluno(item)
                setIsDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

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
                  Gestão de Alunos
                </h1>
                <p className="text-muted-foreground">Gerir matrículas, dados e contas dos alunos</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Importar Excel
                </Button>
                <Button variant="outline" onClick={handleExportExcel} className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Novo Aluno
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Registar Novo Aluno</DialogTitle>
                      <DialogDescription>Preencha os dados do aluno e do encarregado de educação.</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="aluno">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="aluno">Dados do Aluno</TabsTrigger>
                        <TabsTrigger value="encarregado">Encarregado</TabsTrigger>
                      </TabsList>
                      <TabsContent value="aluno" className="space-y-4 mt-4">
                        <div className="grid gap-2">
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input
                            id="nome"
                            placeholder="Ex: João Manuel da Silva"
                            value={newAluno.nome}
                            onChange={(e) => setNewAluno({ ...newAluno, nome: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@exemplo.ao"
                            value={newAluno.email}
                            onChange={(e) => setNewAluno({ ...newAluno, email: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Curso</Label>
                            <Select
                              value={newAluno.curso}
                              onValueChange={(v) => setNewAluno({ ...newAluno, curso: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {CURSOS.map((curso) => (
                                  <SelectItem key={curso.id} value={curso.id}>
                                    {curso.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Ano</Label>
                            <Select value={newAluno.ano} onValueChange={(v) => setNewAluno({ ...newAluno, ano: v })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1º Ano</SelectItem>
                                <SelectItem value="2">2º Ano</SelectItem>
                                <SelectItem value="3">3º Ano</SelectItem>
                                <SelectItem value="4">4º Ano</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            placeholder="+244 9XX XXX XXX"
                            value={newAluno.telefone}
                            onChange={(e) => setNewAluno({ ...newAluno, telefone: e.target.value })}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="encarregado" className="space-y-4 mt-4">
                        <div className="grid gap-2">
                          <Label>Nome do Encarregado</Label>
                          <Input
                            placeholder="Nome completo"
                            value={newAluno.encarregadoNome}
                            onChange={(e) => setNewAluno({ ...newAluno, encarregadoNome: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Telefone</Label>
                            <Input
                              placeholder="+244 9XX XXX XXX"
                              value={newAluno.encarregadoTelefone}
                              onChange={(e) => setNewAluno({ ...newAluno, encarregadoTelefone: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Parentesco</Label>
                            <Select
                              value={newAluno.encarregadoParentesco}
                              onValueChange={(v) => setNewAluno({ ...newAluno, encarregadoParentesco: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mãe">Mãe</SelectItem>
                                <SelectItem value="Pai">Pai</SelectItem>
                                <SelectItem value="Avó">Avó</SelectItem>
                                <SelectItem value="Avô">Avô</SelectItem>
                                <SelectItem value="Tio/Tia">Tio/Tia</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Email do Encarregado</Label>
                          <Input
                            type="email"
                            placeholder="email@exemplo.ao"
                            value={newAluno.encarregadoEmail}
                            onChange={(e) => setNewAluno({ ...newAluno, encarregadoEmail: e.target.value })}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddAluno}>Registar Aluno</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{alunosList.length}</p>
                      <p className="text-xs text-muted-foreground">Total de Alunos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{alunosList.filter((a) => a.estado === "Activo").length}</p>
                      <p className="text-xs text-muted-foreground">Alunos Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Novos este mês</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {(alunosList.reduce((acc, a) => acc + (a.media || 0), 0) / alunosList.length).toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">Média Geral</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lista de Alunos</CardTitle>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2 bg-transparent">
                  <FileSpreadsheet className="w-4 h-4" />
                  Modelo Excel
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={alunosList}
                  columns={columns}
                  searchPlaceholder="Pesquisar aluno..."
                  searchKeys={["nome", "numero", "email", "curso"]}
                />
              </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Detalhes do Aluno</DialogTitle>
                </DialogHeader>
                {selectedAluno && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedAluno.foto || "/placeholder.svg?height=80&width=80&query=student"}
                        alt={selectedAluno.nome}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{selectedAluno.nome}</h3>
                        <p className="text-sm text-muted-foreground">{selectedAluno.numero}</p>
                        <Badge className="mt-1">{selectedAluno.estado}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Curso</p>
                        <p className="font-medium">{selectedAluno.curso}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Turma</p>
                        <p className="font-medium">
                          {selectedAluno.turma} - {selectedAluno.ano}º Ano
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{selectedAluno.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Média</p>
                        <p className={`font-bold ${selectedAluno.media >= 10 ? "text-success" : "text-destructive"}`}>
                          {selectedAluno.media.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border">
                      <h4 className="font-semibold mb-2">Encarregado de Educação</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Nome:</strong> {selectedAluno.encarregadoNome}
                        </p>
                        <p>
                          <strong>Telefone:</strong> {selectedAluno.encarregadoTelefone}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedAluno.encarregadoEmail}
                        </p>
                        <p>
                          <strong>Parentesco:</strong> {selectedAluno.encarregadoParentesco}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Editar Aluno</DialogTitle>
                </DialogHeader>
                {selectedAluno && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Nome Completo</Label>
                      <Input
                        value={selectedAluno.nome}
                        onChange={(e) => setSelectedAluno({ ...selectedAluno, nome: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={selectedAluno.email}
                        onChange={(e) => setSelectedAluno({ ...selectedAluno, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Turma</Label>
                        <Input
                          value={selectedAluno.turma}
                          onChange={(e) => setSelectedAluno({ ...selectedAluno, turma: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Estado</Label>
                        <Select
                          value={selectedAluno.estado}
                          onValueChange={(v) => setSelectedAluno({ ...selectedAluno, estado: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                            <SelectItem value="Suspenso">Suspenso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold mb-3">Encarregado de Educação</h4>
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label>Nome</Label>
                          <Input
                            value={selectedAluno.encarregadoNome || ""}
                            onChange={(e) => setSelectedAluno({ ...selectedAluno, encarregadoNome: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Telefone</Label>
                            <Input
                              value={selectedAluno.encarregadoTelefone || ""}
                              onChange={(e) =>
                                setSelectedAluno({ ...selectedAluno, encarregadoTelefone: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input
                              value={selectedAluno.encarregadoEmail || ""}
                              onChange={(e) => setSelectedAluno({ ...selectedAluno, encarregadoEmail: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEditAluno}>Guardar Alterações</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Confirmar Eliminação
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem a certeza que deseja eliminar o aluno <strong>{selectedAluno?.nome}</strong>? Esta acção não
                    pode ser revertida.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAluno}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Import Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Importar Alunos</DialogTitle>
                  <DialogDescription>{importedData.length} alunos encontrados no ficheiro</DialogDescription>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Nome</th>
                        <th className="text-left py-2">Curso</th>
                        <th className="text-left py-2">Turma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importedData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{row.nome}</td>
                          <td className="py-2">{row.curso}</td>
                          <td className="py-2">{row.turma}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importedData.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">... e mais {importedData.length - 10} alunos</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleImportAlunos}>Importar {importedData.length} Alunos</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
