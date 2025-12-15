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
import { FileText, User, Link as LinkIcon, Calendar, ExternalLink } from "lucide-react"
import type { Document, User as AppUser } from "@/types"

export type DocumentWithDetails = Document & {
  creator?: AppUser
}

interface DocumentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: DocumentWithDetails | null
}

const typeLabels = {
  certificado: "Certificado",
  contrato: "Contrato",
  orden_servicio: "Orden de Servicio",
  otro: "Otro",
} as const

const relatedToLabels = {
  worker: "Trabajador",
  service: "Servicio",
  company: "Empresa",
  other: "Otro",
} as const

export function DocumentDetailDialog({
  open,
  onOpenChange,
  document,
}: DocumentDetailDialogProps) {
  if (!document) return null

  const typeInfo = {
    certificado: { variant: "success" as const, label: "Certificado" },
    contrato: { variant: "info" as const, label: "Contrato" },
    orden_servicio: { variant: "warning" as const, label: "Orden de Servicio" },
    otro: { variant: "secondary" as const, label: "Otro" },
  }

  const currentType = typeInfo[document.type]
  const relatedLabel = relatedToLabels[document.related_to as keyof typeof relatedToLabels] || document.related_to

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Documento</DialogTitle>
          <DialogDescription>Información completa del documento</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <FileText className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{document.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={currentType.variant}>{currentType.label}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Related Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              Relacionado con
            </div>
            <p className="text-sm font-medium">{relatedLabel}</p>
            <p className="text-xs text-muted-foreground font-mono">{document.related_id}</p>
          </div>

          {/* Document URL */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              Documento
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
            >
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir Documento
              </a>
            </Button>
            <p className="text-xs text-muted-foreground break-all">{document.url}</p>
          </div>

          {/* Creator Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Creado por
            </div>
            {document.creator ? (
              <div>
                <p className="text-sm font-medium">{document.creator.email}</p>
                <Badge variant="secondary" className="mt-1">{document.creator.role}</Badge>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Usuario desconocido</p>
            )}
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Creación
              </div>
              <p className="text-sm font-medium">
                {new Date(document.created_at).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Última Actualización
              </div>
              <p className="text-sm font-medium">
                {new Date(document.updated_at).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>{" "}
              {new Date(document.created_at).toLocaleString("es-PE")}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>{" "}
              {new Date(document.updated_at).toLocaleString("es-PE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
