import { type NextRequest, NextResponse } from "next/server"

// Mock disciplines data based on landing page curriculum
const DISCIPLINAS_BY_YEAR = {
  "1-contabilidade": [
    { id: 1, nome: "Matemática", sigla: "MAT" },
    { id: 2, nome: "Língua Portuguesa", sigla: "LP" },
    { id: 3, nome: "Contabilidade Financeira", sigla: "CF" },
    { id: 4, nome: "Economia", sigla: "ECON" },
    { id: 5, nome: "Informática", sigla: "INFO" },
    { id: 6, nome: "Educação Física", sigla: "EF" },
    { id: 7, nome: "Língua Inglesa", sigla: "ING" },
    { id: 8, nome: "Direito Laboral Comercial", sigla: "DLC" },
    { id: 9, nome: "Organização e Gestão de Empresas", sigla: "OGE" },
    { id: 10, nome: "Física Aplicada à Indústria", sigla: "FAI" },
  ],
  "2-contabilidade": [
    { id: 11, nome: "Matemática", sigla: "MAT" },
    { id: 12, nome: "Língua Portuguesa", sigla: "LP" },
    { id: 13, nome: "Contabilidade Financeira", sigla: "CF" },
    { id: 14, nome: "Informática", sigla: "INFO" },
    { id: 15, nome: "Educação Física", sigla: "EF" },
    { id: 16, nome: "Organização e Gestão de Empresas", sigla: "OGE" },
    { id: 17, nome: "Noções de Direito", sigla: "ND" },
    { id: 18, nome: "Língua Inglesa", sigla: "ING" },
    { id: 19, nome: "Física Aplicada à Indústria", sigla: "FAI" },
  ],
  "3-contabilidade": [
    { id: 20, nome: "Matemática", sigla: "MAT" },
    { id: 21, nome: "Técnicas Contabilísticas Específicas", sigla: "TCE" },
    { id: 22, nome: "Contabilidade Analítica", sigla: "CA" },
    { id: 23, nome: "Direito Laboral Fiscal", sigla: "DLF" },
    { id: 24, nome: "Gestão Orçamental", sigla: "GO" },
    { id: 25, nome: "Organização e Gestão de Empresas", sigla: "OGE" },
    { id: 26, nome: "Projeto Tecnológico", sigla: "PT" },
    { id: 27, nome: "Auditoria, Estatística e Fiscalização", sigla: "AEF" },
  ],
  "1-informatica": [
    { id: 28, nome: "Técnicas de Linguagem de Programação", sigla: "TLP" },
    { id: 29, nome: "Tecnologias da Informação e Comunicação", sigla: "TIC" },
    { id: 30, nome: "Sistemas, Estruturas e Análise de Computadores", sigla: "SEAC" },
    { id: 31, nome: "Matemática", sigla: "MAT" },
    { id: 32, nome: "Língua Portuguesa", sigla: "LP" },
    { id: 33, nome: "Língua Inglesa", sigla: "ING" },
    { id: 34, nome: "Física", sigla: "FIS" },
    { id: 35, nome: "Desenho Técnico", sigla: "DT" },
    { id: 36, nome: "Eletrotecnia", sigla: "ELET" },
    { id: 37, nome: "Educação Física", sigla: "EF" },
  ],
  "2-informatica": [
    { id: 38, nome: "Língua Portuguesa", sigla: "LP" },
    { id: 39, nome: "Física", sigla: "FIS" },
    { id: 40, nome: "Matemática", sigla: "MAT" },
    { id: 41, nome: "Sistemas, Estruturas e Análise de Computadores", sigla: "SEAC" },
    { id: 42, nome: "Física Aplicada à Indústria", sigla: "FAI" },
    { id: 43, nome: "Técnicas de Linguagem de Programação", sigla: "TLP" },
    { id: 44, nome: "Língua Inglesa", sigla: "ING" },
    { id: 45, nome: "Química", sigla: "QUIM" },
    { id: 46, nome: "Eletrotecnia", sigla: "ELET" },
    { id: 47, nome: "Educação Física", sigla: "EF" },
  ],
  "3-informatica": [
    { id: 48, nome: "Português", sigla: "PT" },
    { id: 49, nome: "Técnicas de Linguagem de Programação", sigla: "TLP" },
    { id: 50, nome: "Redes, Telecomunicações e Eletrónica Industrial", sigla: "TREI" },
    { id: 51, nome: "Física Aplicada à Indústria", sigla: "FAI" },
    { id: 52, nome: "Sistemas, Estruturas e Análise de Computadores", sigla: "SEAC" },
    { id: 53, nome: "Matemática", sigla: "MAT" },
    { id: 54, nome: "Química Orgânica", sigla: "QO" },
    { id: 55, nome: "Empreendedorismo", sigla: "EMP" },
    { id: 56, nome: "Organização e Gestão da Informática", sigla: "OGI" },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ano = searchParams.get("ano")
    const curso = searchParams.get("curso")

    if (!ano || !curso) {
      return NextResponse.json({ error: "Year and course parameters required" }, { status: 400 })
    }

    const key = `${ano}-${curso}`
    const disciplinas = DISCIPLINAS_BY_YEAR[key as keyof typeof DISCIPLINAS_BY_YEAR]

    if (!disciplinas) {
      return NextResponse.json({ error: "No disciplines found for the given year and course" }, { status: 404 })
    }

    return NextResponse.json(disciplinas)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch disciplines" }, { status: 500 })
  }
}
