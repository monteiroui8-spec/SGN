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
import { Textarea } from "@/components/ui/textarea"
import { MENSAGENS } from "@/lib/mock-data"
import {
  MessageSquare,
  Send,
  Inbox,
  SendHorizontal,
  Trash2,
  Reply,
  Search,
  Plus,
  Mail,
  MailOpen,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ProfessorMensagensPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [selectedMessage, setSelectedMessage] = useState<(typeof MENSAGENS)[0] | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState({
    para: "",
    assunto: "",
    mensagem: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "professor") {
      router.push("/login/professor")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "professor") {
    return null
  }

  const mensagensRecebidas = MENSAGENS.filter((m) => m.tipo === "recebida")
  const mensagensEnviadas = MENSAGENS.filter((m) => m.tipo === "enviada")
  const naoLidas = mensagensRecebidas.filter((m) => !m.lida).length

  const handleSendMessage = () => {
    toast({
      title: "Mensagem enviada",
      description: `A sua mensagem foi enviada para ${newMessage.para}.`,
    })
    setIsComposeOpen(false)
    setNewMessage({ para: "", assunto: "", mensagem: "" })
  }

  const filteredRecebidas = mensagensRecebidas.filter(
    (m) =>
      m.assunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.de.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredEnviadas = mensagensEnviadas.filter(
    (m) =>
      m.assunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.para.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                  <MessageSquare className="w-7 h-7 text-primary" />
                  Mensagens
                </h1>
                <p className="text-muted-foreground">Comunicação interna do sistema</p>
              </div>
              <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Mensagem
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nova Mensagem</DialogTitle>
                    <DialogDescription>Enviar mensagem interna</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Destinatário</Label>
                      <Select value={newMessage.para} onValueChange={(v) => setNewMessage({ ...newMessage, para: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar destinatário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Secretaria">Secretaria</SelectItem>
                          <SelectItem value="Admin">Administração</SelectItem>
                          <SelectItem value="Coordenação">Coordenação de Curso</SelectItem>
                          <SelectItem value="Direcção">Direcção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Assunto</Label>
                      <Input
                        placeholder="Assunto da mensagem"
                        value={newMessage.assunto}
                        onChange={(e) => setNewMessage({ ...newMessage, assunto: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Mensagem</Label>
                      <Textarea
                        placeholder="Escreva a sua mensagem..."
                        rows={5}
                        value={newMessage.mensagem}
                        onChange={(e) => setNewMessage({ ...newMessage, mensagem: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSendMessage} className="gap-2">
                      <Send className="w-4 h-4" />
                      Enviar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mensagensRecebidas.length}</p>
                    <p className="text-xs text-muted-foreground">Recebidas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <SendHorizontal className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mensagensEnviadas.length}</p>
                    <p className="text-xs text-muted-foreground">Enviadas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">{naoLidas}</p>
                    <p className="text-xs text-muted-foreground">Não Lidas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message List */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar mensagens..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="recebidas">
                    <TabsList className="w-full grid grid-cols-2 mx-4 mb-2" style={{ width: "calc(100% - 32px)" }}>
                      <TabsTrigger value="recebidas" className="gap-2">
                        <Inbox className="w-4 h-4" />
                        Recebidas
                        {naoLidas > 0 && (
                          <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                            {naoLidas}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="enviadas" className="gap-2">
                        <SendHorizontal className="w-4 h-4" />
                        Enviadas
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="recebidas" className="mt-0">
                      <div className="divide-y divide-border max-h-96 overflow-y-auto">
                        {filteredRecebidas.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedMessage?.id === msg.id ? "bg-primary/5" : ""
                            } ${!msg.lida ? "bg-primary/5" : ""}`}
                            onClick={() => setSelectedMessage(msg)}
                          >
                            <div className="flex items-start gap-3">
                              {!msg.lida ? (
                                <Mail className="w-4 h-4 text-primary mt-1" />
                              ) : (
                                <MailOpen className="w-4 h-4 text-muted-foreground mt-1" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm truncate ${!msg.lida ? "font-semibold" : ""}`}>{msg.de}</p>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.data).toLocaleDateString("pt-AO")}
                                  </span>
                                </div>
                                <p className="text-sm font-medium truncate">{msg.assunto}</p>
                                <p className="text-xs text-muted-foreground truncate mt-1">{msg.mensagem}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="enviadas" className="mt-0">
                      <div className="divide-y divide-border max-h-96 overflow-y-auto">
                        {filteredEnviadas.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedMessage?.id === msg.id ? "bg-primary/5" : ""
                            }`}
                            onClick={() => setSelectedMessage(msg)}
                          >
                            <div className="flex items-start gap-3">
                              <SendHorizontal className="w-4 h-4 text-muted-foreground mt-1" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm truncate">Para: {msg.para}</p>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.data).toLocaleDateString("pt-AO")}
                                  </span>
                                </div>
                                <p className="text-sm font-medium truncate">{msg.assunto}</p>
                                <p className="text-xs text-muted-foreground truncate mt-1">{msg.mensagem}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Message Detail */}
              <Card className="lg:col-span-2">
                {selectedMessage ? (
                  <>
                    <CardHeader className="border-b border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{selectedMessage.assunto}</CardTitle>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span>
                              {selectedMessage.tipo === "recebida" ? "De:" : "Para:"}{" "}
                              <strong>
                                {selectedMessage.tipo === "recebida" ? selectedMessage.de : selectedMessage.para}
                              </strong>
                            </span>
                            <span className="text-muted-foreground">|</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(selectedMessage.data).toLocaleDateString("pt-AO", { dateStyle: "full" })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {selectedMessage.tipo === "recebida" && (
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                              <Reply className="w-4 h-4" />
                              Responder
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="text-destructive gap-2 bg-transparent">
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="whitespace-pre-wrap">{selectedMessage.mensagem}</p>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                    <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                    <p>Selecione uma mensagem para visualizar</p>
                  </CardContent>
                )}
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
