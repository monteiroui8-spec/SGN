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
  Calendar,
  Bell,
  User,
  LogOut,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  School,
  UserCog,
  FileText,
  MessageSquare,
  UserPlus,
  CalendarDays,
  Shield,
  BookMarked,
  Award,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  CalendarCheck,
  Banknote,
  CreditCard,
  Receipt,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const alunoLinks = [
  { href: "/dashboard/aluno", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/aluno/notas", label: "Minhas Notas", icon: BookOpen },
  { href: "/dashboard/aluno/boletim", label: "Boletim", icon: FileText },
  { href: "/dashboard/aluno/horario", label: "Horário", icon: Calendar },
  { href: "/dashboard/aluno/historico", label: "Histórico", icon: BookMarked },
  { href: "/dashboard/aluno/avisos", label: "Avisos", icon: Bell },
  { href: "/dashboard/aluno/perfil", label: "Meu Perfil", icon: User },
]

const professorLinks = [
  { href: "/dashboard/professor", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/professor/turmas", label: "Minhas Turmas", icon: Users },
  { href: "/dashboard/professor/notas", label: "Lançar Notas", icon: ClipboardList },
  { href: "/dashboard/professor/exames", label: "Exames e Provas", icon: CalendarCheck },
  { href: "/dashboard/professor/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/professor/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/dashboard/professor/perfil", label: "Meu Perfil", icon: User },
]

const encarregadoLinks = [
  { href: "/dashboard/encarregado", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/encarregado/notas", label: "Notas do Educando", icon: BookOpen },
  { href: "/dashboard/encarregado/avisos", label: "Avisos", icon: Bell },
]

const adminLinks = [
  { href: "/dashboard/admin", label: "Painel", icon: LayoutDashboard },
  {
    label: "Gestão de Utilizadores",
    icon: Users,
    children: [
      { href: "/dashboard/admin/alunos", label: "Alunos", icon: GraduationCap },
      { href: "/dashboard/admin/professores", label: "Professores", icon: UserCog },
      { href: "/dashboard/admin/encarregados", label: "Encarregados", icon: UserPlus },
    ],
  },
  {
    label: "Gestão Académica",
    icon: School,
    children: [
      { href: "/dashboard/admin/gestao-academica", label: "Visão Geral", icon: School },
      { href: "/dashboard/admin/cursos", label: "Cursos", icon: BookOpen },
      { href: "/dashboard/admin/disciplinas", label: "Disciplinas", icon: BookMarked },
      { href: "/dashboard/admin/turmas", label: "Turmas", icon: Users },
      { href: "/dashboard/admin/horarios", label: "Horários", icon: CalendarDays },
      { href: "/dashboard/admin/anos-lectivos", label: "Anos Lectivos", icon: Calendar },
    ],
  },
  {
    label: "Notas e Boletins",
    icon: ClipboardList,
    children: [
      { href: "/dashboard/admin/validacao-notas", label: "Validar Notas", icon: Shield },
      { href: "/dashboard/admin/boletins", label: "Boletins", icon: FileText },
      { href: "/dashboard/admin/exames", label: "Exames e Provas", icon: CalendarCheck },
    ],
  },
  {
    label: "Financeiro",
    icon: Banknote,
    children: [
      { href: "/dashboard/admin/financeiro", label: "Visão Geral", icon: Banknote },
      { href: "/dashboard/admin/financeiro/pagamentos", label: "Pagamentos", icon: CreditCard },
      { href: "/dashboard/admin/financeiro/recibos", label: "Recibos", icon: Receipt },
    ],
  },
  { href: "/dashboard/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/admin/estatisticas", label: "Estatísticas", icon: Award },
  { href: "/dashboard/admin/configuracoes", label: "Configurações", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([
    "Gestão de Utilizadores",
    "Gestão Académica",
    "Notas e Boletins",
    "Financeiro",
  ])

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

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => (prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]))
  }

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {collapsed && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setCollapsed(false)} />}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40 transition-all duration-300",
          "md:static md:w-64",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {/* Logo Section - CHANGE: improved collapse state */}
        <div className={cn("p-4 bg-gradient-to-br text-white relative", colorClass)}>
          <Link href="/" className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:block">
                <p className="font-bold text-sm">IPM</p>
                <p className="text-xs text-white/70">Maiombe</p>
              </motion.div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeft className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
          </Button>
        </div>

        {/* User Info - CHANGE: hidden in collapsed mode */}
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                <img
                  src={user?.foto || "/placeholder.svg?height=40&width=40&query=user"}
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

        {/* Navigation - CHANGE: better scrolling and responsive layout */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 p-2">
            {links.map((link, index) => {
              // Check if it's a collapsible menu (admin)
              if ("children" in link && link.children) {
                const isOpen = openMenus.includes(link.label)
                const hasActiveChild = link.children.some((child) => pathname === child.href)

                return (
                  <li key={index}>
                    <Collapsible open={isOpen || hasActiveChild} onOpenChange={() => toggleMenu(link.label)}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center justify-center md:justify-start gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
                            hasActiveChild
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                          title={collapsed ? link.label : undefined}
                        >
                          <link.icon className="w-5 h-5 flex-shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{link.label}</span>
                              <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                            </>
                          )}
                        </button>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <ul className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                            {link.children.map((child) => {
                              const isActive = pathname === child.href
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                      isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                  >
                                    <child.icon className="w-4 h-4" />
                                    {child.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  </li>
                )
              }

              // Regular link
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative group",
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
                    {collapsed && <span className="sr-only">{link.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout - CHANGE: icon-only in collapsed mode */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs md:text-sm transition-all",
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
    </>
  )
}
