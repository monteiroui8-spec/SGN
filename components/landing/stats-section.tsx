"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const growthData = [
  { year: "2019", alunos: 1200 },
  { year: "2020", alunos: 1450 },
  { year: "2021", alunos: 1800 },
  { year: "2022", alunos: 2100 },
  { year: "2023", alunos: 2350 },
  { year: "2024", alunos: 2500 },
]

const approvalData = [
  { curso: "Info", taxa: 96 },
  { curso: "Elet", taxa: 94 },
  { curso: "Mec", taxa: 92 },
  { curso: "Civil", taxa: 95 },
  { curso: "Eletr", taxa: 93 },
  { curso: "Gest", taxa: 97 },
]

const employmentData = [
  { name: "Empregados", value: 78 },
  { name: "Cont. Estudos", value: 15 },
  { name: "Empreendedores", value: 7 },
]

const COLORS = ["#0D6EFD", "#14B8A6", "#F43F5E"]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-accent/20 rounded-full text-accent text-sm font-medium mb-4">
            Estatísticas
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">Números que Inspiram</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            O nosso compromisso com a excelência reflete-se nos resultados dos nossos alunos e na sua inserção no
            mercado de trabalho.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Crescimento Anual</h3>
            <p className="text-sm text-muted-foreground mb-6">Evolução do número de alunos</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D6EFD" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D6EFD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="alunos"
                    stroke="#0D6EFD"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAlunos)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Approval Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Taxa de Aprovação</h3>
            <p className="text-sm text-muted-foreground mb-6">Por curso técnico (%)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={approvalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="curso" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="taxa" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Employment Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Empregabilidade</h3>
            <p className="text-sm text-muted-foreground mb-6">Situação dos formandos (%)</p>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {employmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {employmentData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
