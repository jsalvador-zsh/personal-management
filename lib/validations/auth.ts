import * as z from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Debes confirmar la contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
