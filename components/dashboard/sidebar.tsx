"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  LogOut,
  ClipboardList,
  BarChart3,
  Shield,
  FileText,
  PanelLeftClose,
  PanelLeft,
  Users,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const alunoLinks = [
  { href: "/dashboard/aluno", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/aluno/notas", label: "Minhas Notas", icon: BookOpen },
  { href: "/dashboard/aluno/boletim", label: "Boletim", icon: FileText },
]

const professorLinks = [
  { href: "/dashboard/professor", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/professor/turmas", label: "Minhas Turmas", icon: ClipboardList },
  { href: "/dashboard/professor/notas", label: "Lançar Notas", icon: ClipboardList },
]

const encarregadoLinks = [
  { href: "/dashboard/encarregado", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/encarregado/notas", label: "Notas do Educando", icon: BookOpen },
]

const adminLinks = [
  { href: "/dashboard/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/admin/validacao-notas", label: "Validar Notas", icon: Shield },
  { href: "/dashboard/admin/utilizadores", label: "Utilizadores", icon: Users },
  { href: "/dashboard/admin/auditoria", label: "Auditoria & Períodos", icon: ShieldCheck },
  { href: "/dashboard/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/admin/estatisticas", label: "Estatísticas", icon: BarChart3 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const links =
    user?.type === "aluno"
      ? alunoLinks
      : user?.type === "professor"
        ? professorLinks
        : user?.type === "encarregado"
          ? encarregadoLinks
          : adminLinks

  const colorClass =
    user?.type === "aluno"
      ? "from-primary to-accent"
      : user?.type === "professor"
        ? "from-secondary to-primary"
        : user?.type === "encarregado"
          ? "from-accent to-primary"
          : "from-[#0F172A] to-secondary"

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className={cn("p-4 bg-gradient-to-br text-white relative", colorClass)}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-bold text-sm">IPM</p>
              <p className="text-xs text-white/70">Sistema de Notas</p>
            </motion.div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeft className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
              <img
                src={user?.foto || "/placeholder.svg?height=40&width=40"}
                alt={user?.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.nome}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative",
                    collapsed && "justify-center",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"
                    />
                  )}
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm transition-all",
            collapsed ? "justify-center px-0" : "justify-start",
          )}
          onClick={() => {
            logout()
            window.location.href = "/"
          }}
          title={collapsed ? "Terminar Sessão" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Terminar Sessão</span>}
        </Button>
      </div>
    </aside>
  )
}