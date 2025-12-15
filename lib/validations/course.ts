import { z } from "zod"

export const courseSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(255, "El nombre es demasiado largo"),
  description: z.string().optional().nullable(),
  duration_hours: z.number().min(1, "La duración debe ser al menos 1 hora").max(1000, "La duración es demasiado larga"),
})

export type CourseFormData = z.infer<typeof courseSchema>
