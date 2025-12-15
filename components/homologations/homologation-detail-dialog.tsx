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
import { CheckCircle2, Building2, GraduationCap, AlertCircle } from "lucide-react"
import type { Homologation, Company, Course } from "@/types"

export type HomologationWithDetails = Homologation & {
  company?: Company
  course?: Course
}

interface HomologationDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  homologation: HomologationWithDetails | null
}

export function HomologationDetailDialog({
  open,
  onOpenChange,
  homologation,
}: HomologationDetailDialogProps) {
  if (!homologation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Homologación</DialogTitle>
          <DialogDescription>Información completa de la homologación</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              {homologation.is_required ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <AlertCircle className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Badge variant={homologation.is_required ? "warning" : "secondary"}>
                  {homologation.is_required ? "Obligatorio" : "Opcional"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {homologation.is_required
                  ? "Este curso es requerido para todos los trabajadores de la empresa"
                  : "Este curso es opcional para los trabajadores de la empresa"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Company Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Empresa
            </div>
            {homologation.company ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium text-lg">{homologation.company.name}</div>
                {homologation.company.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {homologation.company.description}
                  </div>
                )}
                {homologation.company.cost_center && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Centro de Costos:{" "}
                    <span className="font-mono">{homologation.company.cost_center}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          {/* Course Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              Curso
            </div>
            {homologation.course ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium text-lg">{homologation.course.name}</div>
                {homologation.course.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {homologation.course.description}
                  </div>
                )}
                <div className="mt-2">
                  <Badge variant="secondary">
                    {homologation.course.duration_hours}{" "}
                    {homologation.course.duration_hours === 1 ? "hora" : "horas"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>{" "}
              {new Date(homologation.created_at).toLocaleString("es-PE")}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>{" "}
              {new Date(homologation.updated_at).toLocaleString("es-PE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
