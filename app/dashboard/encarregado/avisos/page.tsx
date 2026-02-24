"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AVISOS } from "@/lib/mock-data"
import { Bell, Info, AlertTriangle, Calendar } from "lucide-react"

const tipoIcon = (tipo: string) => {
  switch (tipo) {
    case "importante": return <AlertTriangle className="w-5 h-5 text-amber-500" />
    case "evento":     return <Calendar className="w-5 h-5 text-violet-500" />
    default:           return <Info className="w-5 h-5 text-primary" />
  }
}

const tipoBg = (tipo: string) => {
  switch (tipo) {
    case "importante": return "border-amber-500/30 bg-amber-500/5"
    case "evento":     return "border-violet-500/30 bg-violet-500/5"
    default:           return "border-primary/20 bg-primary/5"
  }
}

export default function EncarregadoAvisosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => { if (!isAuthenticated || user?.type !== "encarregado") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "encarregado") return null

  const avisos = AVISOS.filter((a) => a.destinatarios === "todos" || a.destinatarios === "alunos")

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Bell className="w-6 h-6 text-primary" />Avisos e Comunicados</h1>
          <p className="text-sm text-muted-foreground">Informações e comunicações do Instituto Politécnico do Mayombe</p>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/15 text-primary border-0">{avisos.length} avisos</Badge>
          <span className="text-sm text-muted-foreground">Actualizados em {new Date().toLocaleDateString("pt-AO")}</span>
        </div>

        {/* List */}
        <div className="space-y-3">
          {avisos.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className={`border ${tipoBg(a.tipo)}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0">{tipoIcon(a.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                        <p className="font-semibold">{a.titulo}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(a.data).toLocaleDateString("pt-AO")}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-3">Por: {a.autor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {avisos.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Sem avisos de momento</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardShell>
  )
}
