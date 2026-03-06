/**
 * API Client — SGN (Sistema de Gestão de Notas)
 * IPM Mayombe
 *
 * Envia automaticamente o token JWT no header Authorization: Bearer <token>
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost/sgn/backend/api"
const TOKEN_KEY = "sgn_ipm_token"

/** Lê o token do localStorage (disponível apenas no browser) */
function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

/** Fetch genérico com token automático e tratamento de erros */
async function apiFetch<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
  const token   = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res  = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
  const data = await res.json().catch(() => ({ error: "Resposta inválida do servidor" }))

  if (res.status === 401) {
    // Token expirado — limpar sessão e redirecionar para login
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem("sgn_ipm_user")
    window.location.href = "/"
    throw new Error("Sessão expirada. Por favor faça login novamente.")
  }

  if (!res.ok) throw new Error(data.error || `Erro HTTP ${res.status}`)
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

// ─── Turmas do professor ──────────────────────────────────────────────────────

export interface TurmaProfessor {
  turma_id: number
  turma_nome: string
  disciplina_id: number
  disciplina_nome: string
  total_alunos: number
}

export async function getTurmasProfessor(professorId: number): Promise<{ success: boolean; data: TurmaProfessor[] }> {
  return apiFetch(`/turmas/professor.php?professorId=${professorId}`)
}

// ─── Alunos de uma turma ─────────────────────────────────────────────────────

export interface AlunoTurma {
  id: number
  numero: string
  nome: string
  foto?: string
  prova_professor: number | null
  avaliacao: number | null
  prova_trimestre: number | null
  media: number | null
  estado: string
  nota_id: number | null
  feedback: string | null
}

export async function getAlunosTurma(
  turmaId: number,
  disciplinaId: number,
  trimestreId: number
): Promise<{ success: boolean; data: AlunoTurma[] }> {
  return apiFetch(`/turmas/alunos.php?turmaId=${turmaId}&disciplinaId=${disciplinaId}&trimestreId=${trimestreId}`)
}

// ─── Trimestres ───────────────────────────────────────────────────────────────

export interface Trimestre {
  id: number
  nome: string
  estado: string
}

export async function getTrimestres(): Promise<{ success: boolean; data: Trimestre[] }> {
  return apiFetch("/trimestres/get.php")
}

// ─── Notas ───────────────────────────────────────────────────────────────────

export interface NotaPayload {
  alunoId: number
  disciplinaId: number
  professorId: number
  trimestreId: number
  prova_professor: number | null
  avaliacao: number | null
  prova_trimestre: number | null
  feedback?: string | null
}

export async function submitNotas(data: NotaPayload[]) {
  return apiFetch("/notas/submit.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export interface NotaAluno {
  id: number
  disciplina_id: number
  disciplina_nome: string
  sigla: string
  professor_nome: string
  trimestre_id: number
  trimestre_nome: string
  prova_professor: number | null
  avaliacao: number | null
  prova_trimestre: number | null
  media: number | null
  estado: string
  observacoes: string | null
  feedback: string | null
}

export async function getNotasAluno(
  alunoId: number,
  trimestreId?: number
): Promise<{ success: boolean; data: NotaAluno[] }> {
  const query = trimestreId ? `&trimestreId=${trimestreId}` : ""
  return apiFetch(`/notas/get.php?alunoId=${alunoId}${query}`)
}

export interface NotaPendente {
  id: number
  aluno_id: number
  disciplina_id: number
  trimestre_id: number
  turma_id: number | null
  prova_professor: number | null
  avaliacao: number | null
  prova_trimestre: number | null
  media: number | null
  estado: string
  observacoes: string | null
  data_lancamento: string
  aluno_nome: string
  aluno_numero: string
  disciplina_nome: string
  turma_nome: string
  professor_nome: string
  trimestre_nome: string
}

export async function getNotasPendentes(trimestreId?: number): Promise<{ success: boolean; data: NotaPendente[] }> {
  const query = trimestreId ? `?trimestreId=${trimestreId}` : ""
  return apiFetch(`/notas/pendentes.php${query}`)
}

export async function validarNota(
  notaId: number,
  estado: "Aprovado" | "Rejeitado",
  adminId: number,
  observacoes?: string
) {
  return apiFetch("/notas/validar.php", {
    method: "POST",
    body: JSON.stringify({ notaId, estado, adminId, observacoes }),
  })
}

export async function getRelatorioNotas(params?: {
  turmaId?: string
  disciplinaId?: string
  trimestre?: string
}) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch(`/notas/relatorio.php${query ? `?${query}` : ""}`)
}

// ─── Validação em lote ───────────────────────────────────────────────────────

export interface ResultadoLote {
  success: boolean
  aprovadas: number
  emails_enviados: number
  emails_falhados: number
  detalhes_enviados: { aluno: string; encarregado: string; email: string }[]
  detalhes_falhados: { aluno: string; email: string; erro: string }[]
  message: string
}

export async function validarLote(
  turmaId: number,
  disciplinaId: number,
  trimestreId: number
): Promise<ResultadoLote> {
  return apiFetch("/notas/validar-lote.php", {
    method: "POST",
    body: JSON.stringify({ turmaId, disciplinaId, trimestreId }),
  })
}

// ─── Reenvio manual de boletim ───────────────────────────────────────────────

export interface ResultadoReenvio {
  success: boolean
  message: string
  destinatario: { nome: string; email: string }
}

export async function reenviarBoletim(
  alunoId: number,
  trimestreId: number
): Promise<ResultadoReenvio> {
  return apiFetch("/notas/reenviar-boletim.php", {
    method: "POST",
    body: JSON.stringify({ alunoId, trimestreId }),
  })
}