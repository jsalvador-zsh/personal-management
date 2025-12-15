import { z } from "zod"

export const evaluationSchema = z.object({
  worker_id: z.string().uuid("Selecciona un trabajador válido"),
  evaluator_id: z.string().uuid("Selecciona un evaluador válido"),
  evaluation_type: z.enum(["admin", "medico", "rrhh"], {
    errorMap: () => ({ message: "Selecciona un tipo de evaluación válido" }),
  }),
  score: z.number().min(0, "La puntuación debe ser al menos 0").max(100, "La puntuación máxima es 100").optional().nullable(),
  date: z.string().min(1, "La fecha es requerida"),
  comments: z.string().optional().nullable(),
})

export type EvaluationFormData = z.infer<typeof evaluationSchema>
