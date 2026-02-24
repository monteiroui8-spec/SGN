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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { CONFIGURACOES } from "@/lib/mock-data"
import { Settings, Palette, School, Bell, Shield, Save, Sun, Moon, Monitor, Check } from "lucide-react"

const colorPresets = [
  { name: "Azul", primary: "#2563EB", secondary: "#1E40AF", accent: "#0EA5E9" },
  { name: "Verde", primary: "#16A34A", secondary: "#15803D", accent: "#22C55E" },
  { name: "Roxo", primary: "#7C3AED", secondary: "#6D28D9", accent: "#8B5CF6" },
  { name: "Vermelho", primary: "#DC2626", secondary: "#B91C1C", accent: "#EF4444" },
  { name: "Laranja", primary: "#EA580C", secondary: "#C2410C", accent: "#F97316" },
  { name: "Ciano", primary: "#0891B2", secondary: "#0E7490", accent: "#06B6D4" },
]

export default function AdminConfiguracoesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [config, setConfig] = useState(CONFIGURACOES)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  const handleSave = () => {
    toast({
      title: "Configurações guardadas!",
      description: "As alterações foram aplicadas com sucesso.",
    })
  }

  const applyColorPreset = (index: number) => {
    setSelectedColorIndex(index)
    const preset = colorPresets[index]

    // Apply colors to CSS variables
    document.documentElement.style.setProperty("--primary", hexToRgb(preset.primary))
    document.documentElement.style.setProperty("--secondary", hexToRgb(preset.secondary))
    document.documentElement.style.setProperty("--accent", hexToRgb(preset.accent))

    // Save to localStorage
    localStorage.setItem("theme-color-index", String(index))

    toast({
      title: "Tema aplicado",
      description: `O tema "${preset.name}" foi aplicado com sucesso.`,
    })
  }

  // Helper function to convert hex to RGB values
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return `${Number.parseInt(result[1], 16)} ${Number.parseInt(result[2], 16)} ${Number.parseInt(result[3], 16)}`
    }
    return "37 99 235" // default blue
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
                  <Settings className="w-7 h-7 text-primary" />
                  Configurações
                </h1>
                <p className="text-muted-foreground">Personalizar o sistema de gestão escolar</p>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Guardar Alterações
              </Button>
            </div>

            <Tabs defaultValue="aparencia" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="aparencia" className="gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Aparência</span>
                </TabsTrigger>
                <TabsTrigger value="instituicao" className="gap-2">
                  <School className="w-4 h-4" />
                  <span className="hidden sm:inline">Instituição</span>
                </TabsTrigger>
                <TabsTrigger value="notificacoes" className="gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notificações</span>
                </TabsTrigger>
                <TabsTrigger value="seguranca" className="gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Segurança</span>
                </TabsTrigger>
              </TabsList>

              {/* Aparência Tab */}
              <TabsContent value="aparencia" className="space-y-6">
                {/* Theme Mode */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Modo de Tema
                    </CardTitle>
                    <CardDescription>Escolha entre tema claro, escuro ou automático</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          mounted && theme === "light"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <Sun className="w-6 h-6 text-amber-500" />
                        </div>
                        <span className="font-medium">Claro</span>
                        {mounted && theme === "light" && (
                          <Badge className="bg-primary/20 text-primary border-0">
                            <Check className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        )}
                      </button>

                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          mounted && theme === "dark"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-slate-300" />
                        </div>
                        <span className="font-medium">Escuro</span>
                        {mounted && theme === "dark" && (
                          <Badge className="bg-primary/20 text-primary border-0">
                            <Check className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        )}
                      </button>

                      <button
                        onClick={() => setTheme("system")}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          mounted && theme === "system"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-slate-800 flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-slate-600" />
                        </div>
                        <span className="font-medium">Automático</span>
                        {mounted && theme === "system" && (
                          <Badge className="bg-primary/20 text-primary border-0">
                            <Check className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Color Presets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Cores do Sistema
                    </CardTitle>
                    <CardDescription>Escolha um tema de cores para personalizar o sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={preset.name}
                          onClick={() => applyColorPreset(index)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                            selectedColorIndex === index
                              ? "border-foreground bg-muted"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                          </div>
                          <span className="text-sm font-medium">{preset.name}</span>
                          {selectedColorIndex === index && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Instituição Tab */}
              <TabsContent value="instituicao" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados da Instituição</CardTitle>
                    <CardDescription>Informações gerais sobre a instituição de ensino</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Instituição</Label>
                        <Input
                          value={config.nomeInstituicao}
                          onChange={(e) => setConfig({ ...config, nomeInstituicao: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sigla</Label>
                        <Input value={config.sigla} onChange={(e) => setConfig({ ...config, sigla: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={config.email}
                          onChange={(e) => setConfig({ ...config, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={config.telefone}
                          onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Endereço</Label>
                      <Input
                        value={config.endereco}
                        onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sistema de Avaliação</CardTitle>
                    <CardDescription>Configurações do cálculo de notas (Sistema Angolano)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                      <h4 className="font-semibold">Fórmula de Cálculo (Angola)</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Média Final</strong> = (P1 × 25%) + (P2 × 25%) + (Trabalho × 10%) + (Exame × 40%)
                      </p>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="text-center p-3 bg-background rounded-lg">
                          <p className="text-2xl font-bold text-primary">25%</p>
                          <p className="text-xs text-muted-foreground">1ª Prova</p>
                        </div>
                        <div className="text-center p-3 bg-background rounded-lg">
                          <p className="text-2xl font-bold text-primary">25%</p>
                          <p className="text-xs text-muted-foreground">2ª Prova</p>
                        </div>
                        <div className="text-center p-3 bg-background rounded-lg">
                          <p className="text-2xl font-bold text-accent">10%</p>
                          <p className="text-xs text-muted-foreground">Trabalho</p>
                        </div>
                        <div className="text-center p-3 bg-background rounded-lg">
                          <p className="text-2xl font-bold text-secondary">40%</p>
                          <p className="text-xs text-muted-foreground">Exame</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nota Mínima de Aprovação</Label>
                        <Input type="number" value="10" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Nota Máxima</Label>
                        <Input type="number" value="20" readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notificações Tab */}
              <TabsContent value="notificacoes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Notificações</CardTitle>
                    <CardDescription>Configure quando e como receber alertas do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notas Lançadas</p>
                        <p className="text-sm text-muted-foreground">Notificar quando professores lançarem notas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notas Pendentes</p>
                        <p className="text-sm text-muted-foreground">Alertar sobre notas pendentes de validação</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novos Alunos</p>
                        <p className="text-sm text-muted-foreground">Notificar sobre novas matrículas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatórios Semanais</p>
                        <p className="text-sm text-muted-foreground">Receber resumo semanal por email</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Segurança Tab */}
              <TabsContent value="seguranca" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança da Conta</CardTitle>
                    <CardDescription>Gerir a segurança e acesso ao sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Senha Actual</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nova Senha</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmar Nova Senha</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button variant="outline">Alterar Senha</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sessões Activas</CardTitle>
                    <CardDescription>Dispositivos com sessão iniciada</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Este Dispositivo</p>
                            <p className="text-xs text-muted-foreground">Luanda, Angola - Activo agora</p>
                          </div>
                        </div>
                        <Badge className="bg-success/20 text-success border-0">Actual</Badge>
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
