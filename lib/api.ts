/**
 * API Client — IPM Mayombe
 * Centralizes all HTTP calls to the PHP backend.
 * Set NEXT_PUBLIC_API_URL in .env.local to point to the backend.
 * Default: http://localhost/backend/api
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost/backend/api"

// ─── Generic Fetch Helper ────────────────────────────────────────────────────

async function apiFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const data = await res.json().catch(() => ({ error: "Resposta inválida do servidor" }))
  if (!res.ok) {
    throw new Error(data.error || `Erro HTTP ${res.status}`)
  }
  return data as T
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email?: string
  numeroAluno?: string
  password: string
  type: "aluno" | "professor" | "admin" | "encarregado"
}

export async function apiLogin(payload: LoginPayload) {
  return apiFetch("/auth/login.php", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ─── Alunos ──────────────────────────────────────────────────────────────────

export async function getAlunos(params?: { turma?: string; curso?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/alunos/get.php${query ? `?${query}` : ""}`)
}

// ─── Professores ─────────────────────────────────────────────────────────────

export async function getProfessores(params?: { departamento?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/professores/get.php${query ? `?${query}` : ""}`)
}

// ─── Cursos ──────────────────────────────────────────────────────────────────

export async function getCursos() {
  return apiFetch("/cursos/get.php")
}

// ─── Disciplinas ─────────────────────────────────────────────────────────────

export async function getDisciplinas(params?: { curso?: string; ano?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/disciplinas/get.php${query ? `?${query}` : ""}`)
}

// ─── Notas ───────────────────────────────────────────────────────────────────

export interface NotaPayload {
  alunoId: string
  disciplinaId: string
  p1: number
  p2: number
  trabalho: number
  exame?: number | null
  trimestre: string
  professorId: string
}

export async function submitNota(data: NotaPayload) {
  return apiFetch("/notas/submit.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getNotasAluno(alunoId: string, trimestreId?: string) {
  const query = trimestreId ? `?trimestreId=${trimestreId}` : ""
  return apiFetch(`/notas/get.php?alunoId=${alunoId}${query}`)
}

export async function validarNota(notaId: string, estado: "Aprovado" | "Rejeitado", observacoes?: string) {
  return apiFetch("/notas/validar.php", {
    method: "POST",
    body: JSON.stringify({ notaId, estado, observacoes }),
  })
}

// ─── Exames ──────────────────────────────────────────────────────────────────

export interface ExamePayload {
  disciplinaId: string
  turmaId: string
  trimestre: string
  tipo: "Teste" | "Exame" | "Trabalho Prático"
  data: string
  hora: string
  duracao: number
  sala: string
  professorId: string
}

export async function createExame(data: ExamePayload) {
  return apiFetch("/exames/create.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getExames(params?: { professorId?: string; turmaId?: string; trimestre?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/exames/get.php${query ? `?${query}` : ""}`)
}

export async function submitResultadoExame(exameId: string, resultados: Array<{ alunoId: string; nota: number }>) {
  return apiFetch("/exames/resultados.php", {
    method: "POST",
    body: JSON.stringify({ exameId, resultados }),
  })
}

// ─── Financeiro ──────────────────────────────────────────────────────────────

export interface PagamentoPayload {
  alunoId: string
  mes: number
  ano: number
  valor: number
  metodoPagamento: "Numerário" | "Transferência" | "Multicaixa"
  referencia?: string
}

export async function registarPagamento(data: PagamentoPayload) {
  return apiFetch("/financeiro/pagamento.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getPropinas(params?: { estado?: string; turmaId?: string; mes?: number; ano?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/financeiro/propinas.php${query ? `?${query}` : ""}`)
}

export async function getPagamentos(params?: { alunoId?: string; mes?: number; ano?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/financeiro/pagamentos.php${query ? `?${query}` : ""}`)
}

// ─── Turmas ──────────────────────────────────────────────────────────────────

export async function getTurmas(params?: { cursoId?: string; ano?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/turmas/get.php${query ? `?${query}` : ""}`)
}

// ─── Avisos ──────────────────────────────────────────────────────────────────

export async function getAvisos(destinatario?: string) {
  const query = destinatario ? `?destinatarios=${destinatario}` : ""
  return apiFetch(`/avisos/get.php${query}`)
}

export async function criarAviso(data: {
  titulo: string
  descricao: string
  tipo: string
  destinatarios: string
}) {
  return apiFetch("/avisos/create.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
