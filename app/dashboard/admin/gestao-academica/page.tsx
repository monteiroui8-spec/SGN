"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CURSOS, DISCIPLINAS, ANOS_LECTIVOS, DEPARTAMENTOS } from "@/lib/mock-data"
import {
  School,
  BookOpen,
  Calendar,
  Users,
  GraduationCap,
  ArrowRight,
  Building,
  BookMarked,
  CalendarDays,
} from "lucide-react"
import Link from "next/link"

export default function GestaoAcademicaPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const quickLinks = [
    {
      title: "Cursos",
      description: "Gerir cursos oferecidos",
      icon: School,
      href: "/dashboard/admin/cursos",
      count: CURSOS.length,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Disciplinas",
      description: "Gerir disciplinas e ementas",
      icon: BookMarked,
      href: "/dashboard/admin/disciplinas",
      count: DISCIPLINAS.length,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Turmas",
      description: "Gerir turmas e horários",
      icon: Users,
      href: "/dashboard/admin/turmas",
      count: 45,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Horários",
      description: "Definir horários das aulas",
      icon: CalendarDays,
      href: "/dashboard/admin/horarios",
      count: 120,
      color: "bg-warning/10 text-warning",
    },
    {
      title: "Anos Lectivos",
      description: "Gerir períodos académicos",
      icon: Calendar,
      href: "/dashboard/admin/anos-lectivos",
      count: ANOS_LECTIVOS.length,
      color: "bg-success/10 text-success",
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
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <School className="w-7 h-7 text-primary" />
                Gestão Académica
              </h1>
              <p className="text-muted-foreground">Central de gestão de cursos, disciplinas e turmas</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <School className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{CURSOS.length}</p>
                    <p className="text-xs text-muted-foreground">Cursos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{DISCIPLINAS.length}</p>
                    <p className="text-xs text-muted-foreground">Disciplinas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-muted-foreground">Turmas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{DEPARTAMENTOS.length}</p>
                    <p className="text-xs text-muted-foreground">Departamentos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-muted-foreground">Alunos Activos</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <Link key={link.title} href={link.href}>
                  <Card className="card-hover h-full cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center`}>
                          <link.icon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary">{link.count}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mt-4">{link.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                      <div className="flex items-center gap-1 text-primary text-sm mt-4">
                        <span>Aceder</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Ano Lectivo Actual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Ano Lectivo Actual
                </CardTitle>
                <CardDescription>Informações do período académico em curso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {ANOS_LECTIVOS.filter((al) => al.estado === "Activo").map((anoLectivo) => (
                    <div key={anoLectivo.id} className="col-span-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div>
                          <h3 className="text-xl font-bold text-primary">{anoLectivo.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(anoLectivo.inicio).toLocaleDateString("pt-AO")} -{" "}
                            {new Date(anoLectivo.fim).toLocaleDateString("pt-AO")}
                          </p>
                        </div>
                        <Badge className="bg-success/20 text-success border-0">{anoLectivo.estado}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Departamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-secondary" />
                  Departamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEPARTAMENTOS.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                      <h4 className="font-semibold">{dep.nome}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{dep.coordenador}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline">{dep.totalProfessores} professores</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
