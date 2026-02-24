"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, GraduationCap, Calendar, Hash, Building2, Camera } from "lucide-react"

export default function AlunoPerfilPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "aluno") {
      router.push("/login/aluno")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "aluno") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
              <p className="text-muted-foreground">Visualize e actualize os seus dados pessoais</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:row-span-2">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src={user.foto || "/placeholder.svg?height=128&width=128&query=student portrait"}
                      alt={user.nome}
                      className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                    />
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold">{user.nome}</h3>
                  <p className="text-muted-foreground">{user.curso}</p>
                  <div className="mt-4 p-3 bg-primary/10 rounded-xl">
                    <p className="text-sm text-muted-foreground">Número de Aluno</p>
                    <p className="text-lg font-bold text-primary">{user.numeroAluno}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{user.ano}º</p>
                      <p className="text-xs text-muted-foreground">Ano</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{user.turma}</p>
                      <p className="text-xs text-muted-foreground">Turma</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Info */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" value={user.nome} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="email" value={user.email} readOnly className="pl-10 bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número de Aluno</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="numero" value={user.numeroAluno} readOnly className="pl-10 bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="curso">Curso</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="curso" value={user.curso} readOnly className="pl-10 bg-muted/50" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                    Informações Académicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="turma">Turma</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="turma" value={user.turma} readOnly className="pl-10 bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ano">Ano Lectivo</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="ano" value={`${user.ano}º Ano`} readOnly className="pl-10 bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Input
                        id="status"
                        value="Activo"
                        readOnly
                        className="bg-secondary/10 text-secondary font-medium"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="mr-2 bg-transparent">
                      Alterar Senha
                    </Button>
                    <Button>Guardar Alterações</Button>
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
