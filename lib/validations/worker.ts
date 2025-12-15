import { z } from "zod"

export const workerSchema = z.object({
  // Campos básicos
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres").max(20, "El DNI no puede tener más de 20 caracteres"),
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(255, "El nombre es demasiado largo"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().or(z.literal("")).nullable(),
  position: z.string().optional().nullable(),
  company_id: z.string().uuid("ID de empresa inválido").optional().nullable(),
  status: z.enum(["habilitado", "inhabilitado"]).default("habilitado"),
  photo_url: z.string().url("URL inválida").optional().or(z.literal("")).nullable(),

  // Información Personal Extendida
  pais: z.string().max(100).optional().nullable(),
  sexo: z.enum(["Masculino", "Femenino", "Otro"]).optional().nullable(),
  estado_civil: z.enum(["Soltero", "Casado", "Divorciado", "Viudo", "Otro"]).optional().nullable(),
  fecha_nacimiento: z.string().optional().nullable(), // ISO date string
  correo_personal: z.string().email("Email personal inválido").optional().or(z.literal("")).nullable(),
  domicilio: z.string().max(500).optional().nullable(),
  telefono_fijo: z.string().max(20).optional().nullable(),

  // Información Profesional Extendida
  carrera_profesional: z.string().max(255).optional().nullable(),
  fecha_inicio: z.string().optional().nullable(), // ISO date string
  fecha_cese: z.string().optional().nullable(), // ISO date string
  sitio: z.string().max(100).optional().nullable(),
  area: z.string().max(100).optional().nullable(),
  local: z.string().max(100).optional().nullable(),
  condiciones_trabajo: z.string().max(100).optional().nullable(),
})

export type WorkerFormData = z.infer<typeof workerSchema>

export const workerFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["habilitado", "inhabilitado", "all"]).optional(),
  company_id: z.string().uuid().optional(),
})

export type WorkerFilterData = z.infer<typeof workerFilterSchema>
