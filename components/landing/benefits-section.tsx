"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { GraduationCap, Users2, Monitor, Trophy, BookCheck, Handshake, Globe, Sparkles } from "lucide-react"

const benefits = [
  {
    icon: GraduationCap,
    title: "Educação de Qualidade",
    description: "Currículo atualizado e alinhado com os padrões internacionais de ensino técnico.",
  },
  {
    icon: Users2,
    title: "Professores Qualificados",
    description: "Corpo docente experiente com formação académica e profissional de excelência.",
  },
  {
    icon: Monitor,
    title: "Tecnologia Integrada",
    description: "Laboratórios modernos e sistema digital de gestão académica.",
  },
  {
    icon: BookCheck,
    title: "Avaliação Moderna",
    description: "Sistema de avaliação contínua que valoriza o progresso individual do aluno.",
  },
  {
    icon: Handshake,
    title: "Parcerias Empresariais",
    description: "Acordos com empresas para estágios e oportunidades de emprego.",
  },
  {
    icon: Trophy,
    title: "Reconhecimento Nacional",
    description: "Certificação reconhecida pelo Ministério da Educação de Angola.",
  },
  {
    icon: Globe,
    title: "Visão Internacional",
    description: "Intercâmbios e parcerias com instituições de ensino internacionais.",
  },
  {
    icon: Sparkles,
    title: "Formação Integral",
    description: "Desenvolvimento técnico, humano e social do estudante.",
  },
]

export function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="beneficios" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Benefícios
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">Por Que Escolher o IPM?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubra as vantagens de fazer parte da nossa comunidade educativa e investir no seu futuro profissional.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <div className="relative bg-card rounded-2xl p-6 h-full border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                    <benefit.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
