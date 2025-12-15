import { z } from "zod"

export const homologationSchema = z.object({
  company_id: z.string().uuid("Selecciona una empresa válida"),
  course_id: z.string().uuid("Selecciona un curso válido"),
  is_required: z.boolean().default(true),
})

export type HomologationFormData = z.infer<typeof homologationSchema>
