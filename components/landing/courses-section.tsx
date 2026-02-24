"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const curriculumData = {
  contabilidade: {
    name: "Contabilidade",
    color: "from-blue-500 to-cyan-500",
    classes: {
      "10": [
        "Matemática",
        "Língua Portuguesa",
        "Direito Comercial",
        "Contabilidade Financeira",
        "Orçamento Geral do Estado",
        "Informática",
        "Educação Física",
        "Economia",
        "Inglês",
        "Formação e Animação de Equipas",
      ],
      "11": [
        "Matemática",
        "Língua Portuguesa",
        "Contabilidade Financeira",
        "Informática",
        "Educação Física",
        "Orçamento Geral do Estado",
        "Noções de Direito",
        "Inglês",
        "Formação e Animação de Equipas",
      ],
      "12": [
        "Matemática",
        "Teoria da Contabilidade e Estatística",
        "Contabilidade Analítica",
        "Direito e Legislação Fiscal",
        "Gestão Orçamental",
        "Orçamento Geral do Estado",
        "Projeto Tecnológico",
        "Auditoria e Especialidades Fiscais",
      ],
    },
  },
  informatica: {
    name: "Informática de Gestão",
    color: "from-purple-500 to-pink-500",
    classes: {
      "10": [
        "Tratamento Linguístico do Português",
        "Tecnologias da Informação e Comunicação",
        "Sistemas Eletrônicos de Automatização e Controlo",
        "Matemática",
        "Língua Portuguesa",
        "Inglês",
        "Física",
        "Desenho Técnico",
        "Eletrotecnia",
        "Educação Física",
      ],
      "11": [
        "Língua Portuguesa",
        "Física",
        "Matemática",
        "Sistemas Eletrônicos de Automatização e Controlo",
        "Formação e Animação de Equipas",
        "Tratamento Linguístico do Português",
        "Inglês",
        "Química",
        "Eletrotecnia",
        "Educação Física",
      ],
      "12": [
        "Português",
        "Tratamento Linguístico do Português",
        "Tópicos Relevantes em Engenharia Informática",
        "Formação e Animação de Equipas",
        "Sistemas Eletrônicos de Automatização e Controlo",
        "Matemática",
        "Química Orgânica",
        "Empreendedorismo",
        "Organização Geral e Informática",
      ],
    },
  },
}

export function CoursesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedProgram, setSelectedProgram] = useState("contabilidade")
  const [selectedClass, setSelectedClass] = useState("10")

  const program = curriculumData[selectedProgram as keyof typeof curriculumData]
  const subjects = program.classes[selectedClass as keyof typeof program.classes]

  return (
    <section id="cursos" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-secondary text-sm font-medium mb-4">
            Programas Acadêmicos
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">Currículo e Disciplinas</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore nossos dois programas principais com disciplinas progressivas e estruturadas para cada ano de
            estudo.
          </p>
        </motion.div>

        <Tabs value={selectedProgram} onValueChange={setSelectedProgram} className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="contabilidade" className="text-base">
                Contabilidade
              </TabsTrigger>
              <TabsTrigger value="informatica" className="text-base">
                Informática
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {Object.entries(curriculumData).map(([key, prog]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              {/* Class Level Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex gap-4 justify-center mb-8">
                  {["10", "11", "12"].map((classLevel) => (
                    <button
                      key={classLevel}
                      onClick={() => setSelectedClass(classLevel)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        selectedClass === classLevel && selectedProgram === key
                          ? `bg-gradient-to-r ${prog.color} text-white shadow-lg`
                          : "bg-card border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {classLevel}° Classe
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Subjects Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className={`bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-primary`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${prog.color} flex-shrink-0`} />
                      <p className="text-foreground font-medium text-sm">{subject}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Class Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`bg-gradient-to-r ${prog.color} rounded-2xl p-8 text-white`}
              >
                <h3 className="text-2xl font-bold mb-2">{prog.name}</h3>
                <p className="text-white/90 mb-4">
                  {selectedClass}° Classe - {subjects.length} disciplinas
                </p>
                <p className="text-white/80 text-sm">
                  {selectedClass === "10"
                    ? "Ano de fundação com disciplinas essenciais"
                    : selectedClass === "11"
                      ? "Consolidação de conhecimentos técnicos"
                      : "Especialização e projetos avançados"}
                </p>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
