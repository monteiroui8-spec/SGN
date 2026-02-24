"use client"

import { Bell, Search, Menu, Sun, Moon, Settings, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AVISOS } from "@/lib/mock-data"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const unreadNotifications = AVISOS.filter((a) => a.destinatarios === "todos" || a.destinatarios === user?.type).slice(
    0,
    5,
  )

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            {greeting()},{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {user?.nome?.split(" ")[0]}
            </span>
            !
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-AO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Pesquisar..." className="w-64 pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1" />
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notificações</h3>
                    <Badge variant="secondary">{unreadNotifications.length}</Badge>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {unreadNotifications.map((aviso) => (
                    <div
                      key={aviso.id}
                      className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            aviso.tipo === "importante"
                              ? "bg-destructive"
                              : aviso.tipo === "evento"
                                ? "bg-success"
                                : "bg-primary"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{aviso.titulo}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{aviso.descricao}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(aviso.data).toLocaleDateString("pt-AO")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border bg-muted/30">
                  <Button variant="ghost" size="sm" className="w-full text-primary">
                    Ver todas as notificações
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <div className="w-9 h-9 rounded-full bg-muted overflow-hidden ring-2 ring-primary/20">
                <img
                  src={user?.foto || "/placeholder.svg?height=36&width=36&query=user"}
                  alt={user?.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.nome}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${user?.type}/perfil`}>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            {user?.type === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin/configuracoes">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                logout()
                window.location.href = "/"
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Terminar Sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
