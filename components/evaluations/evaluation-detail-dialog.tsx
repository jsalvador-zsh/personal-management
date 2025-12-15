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
import { ClipboardCheck, User, Calendar, Star, FileText } from "lucide-react"
import type { Evaluation, Worker, User as AppUser } from "@/types"

export type EvaluationWithDetails = Evaluation & {
  worker?: Worker
  evaluator?: AppUser
}

interface EvaluationDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evaluation: EvaluationWithDetails | null
}

export function EvaluationDetailDialog({
  open,
  onOpenChange,
  evaluation,
}: EvaluationDetailDialogProps) {
  if (!evaluation) return null

  const typeInfo = {
    admin: { variant: "secondary" as const, label: "Administrativa" },
    medico: { variant: "info" as const, label: "Médica" },
    rrhh: { variant: "warning" as const, label: "RRHH" },
  }

  const currentType = typeInfo[evaluation.evaluation_type]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Evaluación</DialogTitle>
          <DialogDescription>Información completa de la evaluación</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Badge variant={currentType.variant}>{currentType.label}</Badge>
                {evaluation.score !== null && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    {evaluation.score} / 100
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Evaluación registrada en el sistema
              </p>
            </div>
          </div>

          <Separator />

          {/* Worker Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Trabajador Evaluado
            </div>
            {evaluation.worker ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium text-lg">{evaluation.worker.full_name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  DNI: <span className="font-mono">{evaluation.worker.dni}</span>
                </div>
                {evaluation.worker.email && (
                  <div className="text-sm text-muted-foreground">
                    Email: {evaluation.worker.email}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          {/* Evaluator Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Evaluador
            </div>
            {evaluation.evaluator ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium">{evaluation.evaluator.email}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Rol: <Badge variant="secondary">{evaluation.evaluator.role}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          <Separator />

          {/* Date Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Fecha de Evaluación
            </div>
            <p className="text-sm font-medium">
              {new Date(evaluation.date).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Comments */}
          {evaluation.comments && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Comentarios
              </div>
              <p className="text-sm leading-relaxed">{evaluation.comments}</p>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>{" "}
              {new Date(evaluation.created_at).toLocaleString("es-PE")}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>{" "}
              {new Date(evaluation.updated_at).toLocaleString("es-PE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
