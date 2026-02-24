"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="inscricao"
      className="py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden"
      ref={ref}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">Comece Sua Jornada Hoje</h2>

          <p className="text-lg md:text-xl text-white/80 mb-10 text-pretty">
            As inscrições para o ano lectivo 2025 estão abertas. Garanta já a sua vaga e faça parte da próxima geração
            de profissionais de Angola.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="group text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/login/aluno">
                Inscrever-se Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="#contato">Fale Conosco</Link>
            </Button>
          </div>

          <p className="text-white/60 text-sm mt-8">
            Vagas limitadas • Processo seletivo simplificado • Resultados em 48h
          </p>
        </motion.div>
      </div>
    </section>
  )
}
