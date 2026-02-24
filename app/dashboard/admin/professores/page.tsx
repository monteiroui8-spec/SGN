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
import { DataTable } from "@/components/ui/data-table"
import { PROFESSORES, DEPARTAMENTOS } from "@/lib/mock-data"
import { UserCog, UserPlus, BookOpen, Mail, MoreHorizontal, Eye, Edit, Trash2, Key } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function AdminProfessoresPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProfessor, setNewProfessor] = useState({
    nome: "",
    email: "",
    departamento: "",
    telefone: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const handleAddProfessor = () => {
    toast({
      title: "Professor registado com sucesso!",
      description: `${newProfessor.nome} foi adicionado ao sistema. Email de acesso enviado.`,
    })
    setIsAddDialogOpen(false)
    setNewProfessor({ nome: "", email: "", departamento: "", telefone: "" })
  }

  const columns = [
    {
      key: "nome",
      label: "Professor",
      render: (item: (typeof PROFESSORES)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
            <img
              src={item.foto || "/placeholder.svg?height=40&width=40&query=professor"}
              alt={item.nome}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{item.nome}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "departamento",
      label: "Departamento",
      render: (item: (typeof PROFESSORES)[0]) => <span className="text-sm">{item.departamento}</span>,
    },
    {
      key: "disciplinas",
      label: "Disciplinas",
      render: (item: (typeof PROFESSORES)[0]) => (
        <div className="flex flex-wrap gap-1">
          {item.disciplinas.slice(0, 2).map((d, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {d}
            </Badge>
          ))}
          {item.disciplinas.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{item.disciplinas.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "turmas",
      label: "Turmas",
      render: (item: (typeof PROFESSORES)[0]) => <span className="font-medium">{item.turmas.length}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: (typeof PROFESSORES)[0]) => (
        <Badge
          className={
            item.estado === "Activo" ? "bg-success/20 text-success border-0" : "bg-warning/20 text-warning border-0"
          }
        >
          {item.estado}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: (typeof PROFESSORES)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen className="w-4 h-4 mr-2" />
              Atribuir Disciplinas
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Key className="w-4 h-4 mr-2" />
              Resetar senha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Desactivar
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
                  <UserCog className="w-7 h-7 text-primary" />
                  Gestão de Professores
                </h1>
                <p className="text-muted-foreground">Gerir professores, disciplinas e atribuições</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Novo Professor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Registar Novo Professor</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo professor. Um email com as credenciais de acesso será enviado
                      automaticamente.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        placeholder="Ex: Maria dos Santos"
                        value={newProfessor.nome}
                        onChange={(e) => setNewProfessor({ ...newProfessor, nome: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Institucional</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="professor@ipmayombe.ao"
                        value={newProfessor.email}
                        onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Departamento</Label>
                      <Select
                        value={newProfessor.departamento}
                        onValueChange={(v) => setNewProfessor({ ...newProfessor, departamento: v })}
                      >
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
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        placeholder="+244 9XX XXX XXX"
                        value={newProfessor.telefone}
                        onChange={(e) => setNewProfessor({ ...newProfessor, telefone: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddProfessor}>Registar Professor</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <UserCog className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{PROFESSORES.length}</p>
                      <p className="text-xs text-muted-foreground">Total Professores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <UserCog className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{PROFESSORES.filter((p) => p.estado === "Activo").length}</p>
                      <p className="text-xs text-muted-foreground">Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{DEPARTAMENTOS.length}</p>
                      <p className="text-xs text-muted-foreground">Departamentos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-xs text-muted-foreground">Novos este mês</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Professores</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={PROFESSORES}
                  columns={columns}
                  searchPlaceholder="Pesquisar professor..."
                  searchKeys={["nome", "email", "departamento"]}
                />
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
