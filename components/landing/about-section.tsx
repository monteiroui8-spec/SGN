"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Eye, Heart, Lightbulb } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Missão",
    description:
      "Formar profissionais qualificados e competentes, capazes de contribuir para o desenvolvimento socioeconómico de Angola através do ensino técnico de excelência.",
  },
  {
    icon: Eye,
    title: "Visão",
    description:
      "Ser uma instituição de referência no ensino técnico e profissional em Angola, reconhecida pela qualidade dos seus formandos e pela inovação pedagógica.",
  },
  {
    icon: Heart,
    title: "Valores",
    description:
      "Excelência, integridade, respeito pela diversidade, compromisso social e inovação contínua são os pilares que norteiam todas as nossas ações.",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    description:
      "Utilizamos tecnologias modernas e metodologias pedagógicas inovadoras para garantir uma aprendizagem eficaz e alinhada com as necessidades do mercado.",
  },
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="sobre" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Sobre Nós
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Construindo o Futuro de Angola
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Desde a sua fundação, o Instituto Politécnico do Mayombe tem sido um pilar fundamental na formação de jovens
            angolanos, preparando-os para os desafios do mercado de trabalho com educação técnica de qualidade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-6 h-full border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
