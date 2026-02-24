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
import { ENCARREGADOS, ALUNOS } from "@/lib/mock-data"
import { Users, Search, Mail, Phone, GraduationCap, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminEncarregadosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEncarregado, setSelectedEncarregado] = useState<(typeof ENCARREGADOS)[0] | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const encarregadosComAlunos = ENCARREGADOS.map((enc) => ({
    ...enc,
    aluno: ALUNOS.find((a) => a.id === enc.alunoId),
  }))

  const filteredEncarregados = encarregadosComAlunos.filter(
    (enc) =>
      enc.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enc.aluno?.nome.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-7 h-7 text-primary" />
                Encarregados de Educação
              </h1>
              <p className="text-muted-foreground">Os dados dos encarregados estão vinculados ao cadastro dos alunos</p>
            </div>

            {/* Info Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm">
                  <strong>Nota:</strong> Os dados dos encarregados de educação são geridos através do cadastro dos
                  alunos. Para adicionar ou editar informações de encarregados, aceda à secção de Gestão de Alunos.
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ENCARREGADOS.length}</p>
                    <p className="text-xs text-muted-foreground">Total Encarregados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ENCARREGADOS.filter((e) => e.email).length}</p>
                    <p className="text-xs text-muted-foreground">Com Email</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ENCARREGADOS.filter((e) => e.telefone).length}</p>
                    <p className="text-xs text-muted-foreground">Com Telefone</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar encarregado ou aluno..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Encarregados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-semibold">Encarregado</th>
                        <th className="text-left py-3 px-4 font-semibold">Contacto</th>
                        <th className="text-left py-3 px-4 font-semibold">Aluno</th>
                        <th className="text-left py-3 px-4 font-semibold">Parentesco</th>
                        <th className="text-center py-3 px-4 font-semibold">Acções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEncarregados.map((enc) => (
                        <tr key={enc.id} className="border-t border-border hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <p className="font-medium">{enc.nome}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <p className="text-sm flex items-center gap-2">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                {enc.email}
                              </p>
                              <p className="text-sm flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                {enc.telefone}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={enc.aluno?.foto || "/placeholder.svg?height=32&width=32&query=student"}
                                alt={enc.aluno?.nome}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm">{enc.aluno?.nome}</p>
                                <p className="text-xs text-muted-foreground">{enc.aluno?.turma}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{enc.parentesco}</Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEncarregado(enc)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedEncarregado} onOpenChange={() => setSelectedEncarregado(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Detalhes do Encarregado</DialogTitle>
                </DialogHeader>
                {selectedEncarregado && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <h3 className="font-semibold mb-2">{selectedEncarregado.nome}</h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {selectedEncarregado.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {selectedEncarregado.telefone}
                        </p>
                        <Badge variant="outline">{selectedEncarregado.parentesco}</Badge>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        Educando
                      </h4>
                      {encarregadosComAlunos.find((e) => e.id === selectedEncarregado.id)?.aluno && (
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              encarregadosComAlunos.find((e) => e.id === selectedEncarregado.id)?.aluno?.foto ||
                              "/placeholder.svg"
                            }
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-medium">
                              {encarregadosComAlunos.find((e) => e.id === selectedEncarregado.id)?.aluno?.nome}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {encarregadosComAlunos.find((e) => e.id === selectedEncarregado.id)?.aluno?.curso}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {encarregadosComAlunos.find((e) => e.id === selectedEncarregado.id)?.aluno?.turma} -
                              {encarregadosComAlunos.find((e) => e.id === selectedEncarregado.id)?.aluno?.ano}º Ano
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
