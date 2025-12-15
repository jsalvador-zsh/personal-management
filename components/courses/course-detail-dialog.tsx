"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, FileText, Calendar, Clock } from "lucide-react"
import type { Course } from "@/types"

interface CourseDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
}

export function CourseDetailDialog({
  open,
  onOpenChange,
  course,
}: CourseDetailDialogProps) {
  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Curso</DialogTitle>
          <DialogDescription>
            Información completa del curso
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{course.name}</h3>
              <div className="mt-2">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {course.duration_hours} {course.duration_hours === 1 ? "hora" : "horas"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Information Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Descripción
              </div>
              <p className="text-sm">
                {course.description || (
                  <span className="italic text-muted-foreground">Sin descripción</span>
                )}
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duración del Curso
              </div>
              <p className="text-sm font-medium">
                {course.duration_hours} {course.duration_hours === 1 ? "hora" : "horas"}
              </p>
            </div>

            {/* Empty placeholder for visual balance */}
            <div></div>

            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Registro
              </div>
              <p className="text-sm">
                {new Date(course.created_at).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Updated At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Última Actualización
              </div>
              <p className="text-sm">
                {new Date(course.updated_at).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
