import { z } from "zod"

export const documentSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(255, "El nombre es demasiado largo"),
  type: z.enum(["certificado", "contrato", "orden_servicio", "otro"], {
    errorMap: () => ({ message: "Selecciona un tipo de documento válido" }),
  }),
  url: z.string().url("URL inválida").min(1, "La URL es requerida"),
  related_to: z.string().min(1, "Selecciona el tipo de relación"),
  related_id: z.string().uuid("Selecciona un registro válido"),
  created_by: z.string().uuid("Usuario inválido"),
})

export type DocumentFormData = z.infer<typeof documentSchema>
