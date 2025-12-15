"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Award,
  User,
  GraduationCap,
  Calendar,
  FileText,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import type { Certification, Worker, Course } from "@/types"

export type CertificationWithDetails = Certification & {
  worker?: Worker
  course?: Course
}

interface CertificationDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certification: CertificationWithDetails | null
}

export function CertificationDetailDialog({
  open,
  onOpenChange,
  certification,
}: CertificationDetailDialogProps) {
  if (!certification) return null

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "vigente":
        return {
          variant: "success" as const,
          label: "Vigente",
          icon: Award,
        }
      case "por_vencer":
        return {
          variant: "warning" as const,
          label: "Por Vencer",
          icon: AlertCircle,
        }
      case "vencido":
        return {
          variant: "error" as const,
          label: "Vencido",
          icon: AlertCircle,
        }
      default:
        return {
          variant: "secondary" as const,
          label: "Desconocido",
          icon: AlertCircle,
        }
    }
  }

  const statusInfo = getStatusInfo(certification.status)
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Certificación</DialogTitle>
          <DialogDescription>
            Información completa de la certificación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Award className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Badge variant={statusInfo.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Certificación registrada en el sistema
              </p>
            </div>
          </div>

          <Separator />

          {/* Worker Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Trabajador
            </div>
            {certification.worker ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium text-lg">{certification.worker.full_name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  DNI: <span className="font-mono">{certification.worker.dni}</span>
                </div>
                {certification.worker.email && (
                  <div className="text-sm text-muted-foreground">
                    Email: {certification.worker.email}
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
            {certification.course ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium text-lg">{certification.course.name}</div>
                {certification.course.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {certification.course.description}
                  </div>
                )}
                <div className="mt-2">
                  <Badge variant="secondary">
                    {certification.course.duration_hours} {certification.course.duration_hours === 1 ? "hora" : "horas"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          <Separator />

          {/* Dates Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Emisión
              </div>
              <p className="text-sm font-medium">
                {new Date(certification.issue_date).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Vencimiento
              </div>
              <p className="text-sm font-medium">
                {new Date(certification.expiry_date).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Document URL */}
          {certification.document_url && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Documento
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                asChild
              >
                <a
                  href={certification.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver Documento
                </a>
              </Button>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>{" "}
              {new Date(certification.created_at).toLocaleString("es-PE")}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>{" "}
              {new Date(certification.updated_at).toLocaleString("es-PE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
