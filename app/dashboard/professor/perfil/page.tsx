"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DEMO_ACCOUNTS, PROFESSOR_TURMAS } from "@/lib/mock-data"
import { User, Mail, Phone, BookOpen, Calendar, Edit, Save, Lock, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfessorPerfilPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    nome: DEMO_ACCOUNTS.professor.nome,
    email: DEMO_ACCOUNTS.professor.email,
    telefone: DEMO_ACCOUNTS.professor.telefone,
    departamento: DEMO_ACCOUNTS.professor.departamento,
    formacao: DEMO_ACCOUNTS.professor.formacao,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "professor") {
      router.push("/login/professor")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "professor") {
    return null
  }

  const professor = DEMO_ACCOUNTS.professor

  const handleSave = () => {
    toast({
      title: "Perfil actualizado",
      description: "As suas informações foram guardadas com sucesso.",
    })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    toast({
      title: "Email enviado",
      description: "Um email de redefinição de senha foi enviado.",
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-7 h-7 text-primary" />
                  Meu Perfil
                </h1>
                <p className="text-muted-foreground">Gerir informações pessoais e conta</p>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-primary/20">
                      <img
                        src={professor.foto || "/placeholder.svg?height=128&width=128&query=professor"}
                        alt={professor.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8" variant="secondary">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{professor.nome}</h2>
                    <p className="text-muted-foreground">{professor.departamento}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="gap-1">
                        <Mail className="w-3 h-3" />
                        {professor.email}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Phone className="w-3 h-3" />
                        {professor.telefone}
                      </Badge>
                      <Badge className="bg-success/20 text-success border-0">{professor.estado}</Badge>
                    </div>
                    <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-primary">{PROFESSOR_TURMAS.length}</p>
                        <p className="text-sm text-muted-foreground">Turmas</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-accent">{professor.disciplinas?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Disciplinas</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">
                          {PROFESSOR_TURMAS.reduce((acc, t) => acc + t.totalAlunos, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Alunos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="dados" className="space-y-6">
              <TabsList>
                <TabsTrigger value="dados" className="gap-2">
                  <User className="w-4 h-4" />
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger value="disciplinas" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Disciplinas
                </TabsTrigger>
                <TabsTrigger value="seguranca" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Segurança
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dados">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Os seus dados cadastrados no sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Nome Completo</Label>
                        <Input
                          value={profileData.nome}
                          onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={profileData.telefone}
                          onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Departamento</Label>
                        <Input value={profileData.departamento} disabled />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Formação Académica</Label>
                        <Input value={profileData.formacao} disabled />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Data de Contratação</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(professor.dataContratacao).toLocaleDateString("pt-AO", { dateStyle: "long" })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disciplinas">
                <Card>
                  <CardHeader>
                    <CardTitle>Minhas Disciplinas</CardTitle>
                    <CardDescription>Disciplinas e turmas atribuídas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {professor.disciplinas?.map((disc, index) => (
                        <div key={index} className="p-4 rounded-xl border border-border hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{disc.nome}</p>
                              <p className="text-xs text-muted-foreground">{disc.turmas?.length || 0} turmas</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {disc.turmas?.map((turma) => (
                              <Badge key={turma} variant="outline" className="text-xs">
                                {turma}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seguranca">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança da Conta</CardTitle>
                    <CardDescription>Gerir senha e acesso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Alterar Senha</p>
                            <p className="text-sm text-muted-foreground">Última alteração: há 30 dias</p>
                          </div>
                        </div>
                        <Button variant="outline" onClick={handleChangePassword}>
                          Alterar
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email de Recuperação</p>
                            <p className="text-sm text-muted-foreground">{professor.email}</p>
                          </div>
                        </div>
                        <Badge className="bg-success/20 text-success border-0">Verificado</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
