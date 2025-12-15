import { z } from "zod"

export const certificationSchema = z.object({
  worker_id: z.string().uuid("Selecciona un trabajador válido"),
  course_id: z.string().uuid("Selecciona un curso válido"),
  issue_date: z.string().min(1, "La fecha de emisión es requerida"),
  expiry_date: z.string().min(1, "La fecha de vencimiento es requerida"),
  document_url: z.string().url("URL inválida").optional().or(z.literal("")).nullable(),
}).refine((data) => {
  const issueDate = new Date(data.issue_date)
  const expiryDate = new Date(data.expiry_date)
  return expiryDate > issueDate
}, {
  message: "La fecha de vencimiento debe ser posterior a la fecha de emisión",
  path: ["expiry_date"],
})

export type CertificationFormData = z.infer<typeof certificationSchema>
