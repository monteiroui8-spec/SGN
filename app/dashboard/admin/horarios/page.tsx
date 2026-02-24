"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus, Clock, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const HORARIOS = ["07:30", "08:30", "09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30"]

const AULAS_EXEMPLO = [
  { id: 1, disciplina: "Programação Web", professor: "Profª. Maria", sala: "Lab 1", dia: 0, hora: 0, duracao: 2 },
  { id: 2, disciplina: "Base de Dados", professor: "Prof. João", sala: "Lab 2", dia: 0, hora: 3, duracao: 2 },
  { id: 3, disciplina: "Matemática", professor: "Prof. Carlos", sala: "A101", dia: 1, hora: 0, duracao: 2 },
  { id: 4, disciplina: "Inglês", professor: "Profª. Ana", sala: "B201", dia: 1, hora: 3, duracao: 1 },
  { id: 5, disciplina: "Programação Web", professor: "Profª. Maria", sala: "Lab 1", dia: 2, hora: 0, duracao: 2 },
  { id: 6, disciplina: "Sistemas Operativos", professor: "Prof. Pedro", sala: "Lab 3", dia: 2, hora: 3, duracao: 2 },
  { id: 7, disciplina: "Base de Dados", professor: "Prof. João", sala: "Lab 2", dia: 3, hora: 0, duracao: 2 },
  { id: 8, disciplina: "Educação Física", professor: "Prof. Luís", sala: "Ginásio", dia: 3, hora: 3, duracao: 1 },
  { id: 9, disciplina: "Matemática", professor: "Prof. Carlos", sala: "A101", dia: 4, hora: 0, duracao: 2 },
  { id: 10, disciplina: "Redes", professor: "Prof. Manuel", sala: "Lab 4", dia: 4, hora: 3, duracao: 2 },
]

export default function AdminHorariosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedTurma, setSelectedTurma] = useState("IG-3A")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const getAula = (dia: number, hora: number) => {
    return AULAS_EXEMPLO.find((a) => a.dia === dia && hora >= a.hora && hora < a.hora + a.duracao)
  }

  const isFirstSlot = (dia: number, hora: number) => {
    const aula = AULAS_EXEMPLO.find((a) => a.dia === dia && a.hora === hora)
    return !!aula
  }

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
                  <CalendarDays className="w-7 h-7 text-primary" />
                  Gestão de Horários
                </h1>
                <p className="text-muted-foreground">Definir e gerir horários das turmas</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IG-3A">IG-3A</SelectItem>
                    <SelectItem value="IG-2A">IG-2A</SelectItem>
                    <SelectItem value="IG-1A">IG-1A</SelectItem>
                    <SelectItem value="EI-3A">EI-3A</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Aula
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{AULAS_EXEMPLO.length}</p>
                    <p className="text-xs text-muted-foreground">Aulas Semanais</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">30</p>
                    <p className="text-xs text-muted-foreground">Horas/Semana</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-xs text-muted-foreground">Alunos na Turma</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Horário Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Horário - {selectedTurma}</span>
                  <Badge variant="outline">2º Trimestre 2024/2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-border p-2 bg-muted/50 w-20">Hora</th>
                        {DIAS_SEMANA.map((dia) => (
                          <th key={dia} className="border border-border p-2 bg-muted/50 min-w-32">
                            {dia}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HORARIOS.map((hora, horaIndex) => (
                        <tr key={hora}>
                          <td className="border border-border p-2 text-center text-sm font-medium bg-muted/30">
                            {hora}
                          </td>
                          {DIAS_SEMANA.map((_, diaIndex) => {
                            const aula = getAula(diaIndex, horaIndex)
                            const isFirst = isFirstSlot(diaIndex, horaIndex)

                            if (aula && !isFirst) {
                              return null // Skip cells that are part of a merged cell
                            }

                            if (aula && isFirst) {
                              return (
                                <td key={diaIndex} className="border border-border p-0" rowSpan={aula.duracao}>
                                  <div className="p-2 h-full bg-primary/10 border-l-4 border-primary">
                                    <p className="font-medium text-sm">{aula.disciplina}</p>
                                    <p className="text-xs text-muted-foreground">{aula.professor}</p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {aula.sala}
                                    </Badge>
                                  </div>
                                </td>
                              )
                            }

                            return (
                              <td
                                key={diaIndex}
                                className="border border-border p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                              >
                                <span className="text-xs text-muted-foreground">-</span>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
