"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { courseSchema, type CourseFormData } from "@/lib/validations/course"
import type { Course } from "@/types"

interface CourseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CourseFormData) => Promise<void>
  course?: Course | null
  isLoading?: boolean
}

export function CourseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  course,
  isLoading = false,
}: CourseFormDialogProps) {
  const isEditing = !!course

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_hours: 1,
    },
  })

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        description: course.description || "",
        duration_hours: course.duration_hours || 1,
      })
    } else {
      reset({
        name: "",
        description: "",
        duration_hours: 1,
      })
    }
  }, [course, reset])

  const handleFormSubmit = async (data: CourseFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Curso" : "Nuevo Curso"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del curso"
              : "Completa el formulario para registrar un nuevo curso"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Curso <span className="text-error">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Seguridad en Minería"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-error">{errors.name.message}</p>
              )}
            </div>

            {/* Duration Hours */}
            <div className="space-y-2">
              <Label htmlFor="duration_hours">
                Duración (horas) <span className="text-error">*</span>
              </Label>
              <Input
                id="duration_hours"
                type="number"
                min="1"
                max="1000"
                {...register("duration_hours", { valueAsNumber: true })}
                placeholder="40"
                disabled={isLoading}
              />
              {errors.duration_hours && (
                <p className="text-sm text-error">{errors.duration_hours.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Curso básico de seguridad en operaciones mineras"
                disabled={isLoading}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-sm text-error">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
