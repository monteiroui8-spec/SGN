"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PAGAMENTOS } from "@/lib/mock-data"
import { Receipt, Search, Download, Eye, ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"

type Pagamento = typeof PAGAMENTOS[0]

const fmtAOA = (v: number) => new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(v)

export default function RecibosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Pagamento | null>(null)

  useEffect(() => { if (!isAuthenticated || user?.type !== "admin") router.push("/") }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.type !== "admin") return null

  const filtered = PAGAMENTOS.filter((p) => {
    const q = search.toLowerCase()
    return p.alunoNome.toLowerCase().includes(q) || p.recibo.toLowerCase().includes(q)
  })

  return (
    <DashboardShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard/admin/financeiro" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></Link>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6 text-primary" />Recibos de Pagamento</h1>
            </div>
            <p className="text-sm text-muted-foreground">Visualize, imprima e exporte recibos de propinas</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Pesquisar por aluno ou nº recibo..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Grid de recibos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all">
              {/* Recibo header */}
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-primary/15 text-primary border-0 font-mono">{p.recibo}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(p.dataPagamento).toLocaleDateString("pt-AO")}</span>
              </div>
              <p className="font-semibold">{p.alunoNome}</p>
              <p className="text-sm text-muted-foreground mb-3">Propina de {p.mes} · {p.metodoPagamento}</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-primary">{fmtAOA(p.valor)}</p>
                <div className="flex gap-1.5">
                  <Button size="icon" variant="outline" className="w-8 h-8" onClick={() => setSelected(p)}>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8">
                    <Printer className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Caixa: {p.caixeiro}</p>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>Nenhum recibo encontrado</p>
            </div>
          )}
        </div>

        {/* Recibo Detail Modal */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Recibo {selected?.recibo}</DialogTitle></DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="text-center py-4 border-y border-border">
                  <p className="font-bold text-lg">Instituto Politécnico do Mayombe</p>
                  <p className="text-sm text-muted-foreground">Buco Zau, Cabinda, Angola</p>
                  <p className="text-xs text-muted-foreground mt-1">NIF: 5000234567</p>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { l: "Recibo Nº", v: selected.recibo },
                    { l: "Aluno", v: selected.alunoNome },
                    { l: "Referente a", v: `Propina de ${selected.mes}` },
                    { l: "Método", v: selected.metodoPagamento },
                    { l: "Referência", v: selected.referencia },
                    { l: "Data", v: new Date(selected.dataPagamento).toLocaleDateString("pt-AO") },
                    { l: "Caixeiro", v: selected.caixeiro },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-border text-base">
                    <span className="font-bold">Total Pago</span>
                    <span className="font-bold text-primary">{fmtAOA(selected.valor)}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 gap-2" onClick={() => window.print()}><Printer className="w-4 h-4" />Imprimir</Button>
                  <Button variant="outline" className="flex-1 gap-2"><Download className="w-4 h-4" />PDF</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardShell>
  )
}
