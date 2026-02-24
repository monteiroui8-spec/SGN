import { type NextRequest, NextResponse } from "next/server"

// Mock courses data matching landing page
const CURSOS = [
  {
    id: 1,
    nome: "Contabilidade",
    sigla: "CONT",
    descricao: "Curso especializado em Contabilidade Financeira e Gestão",
    anos: 3,
    disciplinas: 10,
  },
  {
    id: 2,
    nome: "Informática de Gestão",
    sigla: "IG",
    descricao: "Curso de Tecnologia da Informação com foco em Gestão",
    anos: 3,
    disciplinas: 9,
  },
]

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch from actual database
    return NextResponse.json(CURSOS)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
