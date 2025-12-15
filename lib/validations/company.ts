import { z } from "zod"

export const companySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(255, "El nombre es demasiado largo"),
  description: z.string().optional().nullable(),
  cost_center: z.string().optional().nullable(),
  work_mode: z.enum(["presencial", "remoto", "hibrido"]).default("presencial"),
})

export type CompanyFormData = z.infer<typeof companySchema>
