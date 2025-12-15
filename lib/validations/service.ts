import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(255, "El nombre es demasiado largo"),
  description: z.string().optional().nullable(),
  company_id: z.string().uuid("Selecciona una empresa válida"),
  status: z.enum(["activo", "inactivo"]).default("activo"),
  manager_id: z.string().uuid("Selecciona un encargado válido").optional().nullable(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
