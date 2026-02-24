"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { DEMO_ACCOUNTS } from "./mock-data"

type UserType = "aluno" | "professor" | "admin" | "encarregado" | null

interface User {
  type: UserType
  nome: string
  email?: string
  numeroAluno?: string
  curso?: string
  turma?: string
  ano?: number
  departamento?: string
  disciplinas?: string[]
  cargo?: string
  // Encarregado specific
  alunoId?: string
  alunoNome?: string
  alunoNumero?: string
  parentesco?: string
  foto: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (type: UserType, credentials: { email?: string; numeroAluno?: string; password: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ipm_user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = async (
    type: UserType,
    credentials: { email?: string; numeroAluno?: string; password: string },
  ): Promise<boolean> => {

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let authenticated = false
    let userData: User | null = null

    if (type === "aluno") {
      const account = DEMO_ACCOUNTS.aluno
      if (credentials.numeroAluno === account.numeroAluno && credentials.password === account.password) {
        authenticated = true
        userData = {
          type: "aluno",
          nome: account.nome,
          email: account.email,
          numeroAluno: account.numeroAluno,
          curso: account.curso,
          turma: account.turma,
          ano: account.ano,
          foto: account.foto,
        }
      }
    } else if (type === "professor") {
      const account = DEMO_ACCOUNTS.professor
      if (credentials.email === account.email && credentials.password === account.password) {
        authenticated = true
        userData = {
          type: "professor",
          nome: account.nome,
          email: account.email,
          departamento: account.departamento,
          disciplinas: account.disciplinas,
          foto: account.foto,
        }
      }
    } else if (type === "admin") {
      const account = DEMO_ACCOUNTS.admin
      if (credentials.email === account.email && credentials.password === account.password) {
        authenticated = true
        userData = {
          type: "admin",
          nome: account.nome,
          email: account.email,
          cargo: account.cargo,
          foto: account.foto,
        }
      }
    } else if (type === "encarregado") {
      const account = DEMO_ACCOUNTS.encarregado
      if (credentials.email === account.email && credentials.password === account.password) {
        authenticated = true
        userData = {
          type: "encarregado",
          nome: account.nome,
          email: account.email,
          alunoId: account.alunoId,
          alunoNome: account.alunoNome,
          alunoNumero: account.alunoNumero,
          parentesco: account.parentesco,
          foto: account.foto,
        }
      }
    }

    if (authenticated && userData) {
      setUser(userData)
      localStorage.setItem("ipm_user", JSON.stringify(userData))
    }

    return authenticated
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ipm_user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
