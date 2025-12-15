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
import { Building2, User, FileText, Activity } from "lucide-react"
import type { Service, Company, User as AppUser } from "@/types"

export type ServiceWithDetails = Service & {
  company?: Company
  manager?: AppUser | null
}

interface ServiceDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: ServiceWithDetails | null
}

export function ServiceDetailDialog({
  open,
  onOpenChange,
  service,
}: ServiceDetailDialogProps) {
  if (!service) return null

  const statusInfo = {
    activo: { variant: "success" as const, label: "Activo" },
    inactivo: { variant: "secondary" as const, label: "Inactivo" },
  }

  const currentStatus = statusInfo[service.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Servicio</DialogTitle>
          <DialogDescription>Información completa del servicio</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Activity className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{service.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Company Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Empresa
            </div>
            {service.company ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium text-lg">{service.company.name}</div>
                {service.company.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {service.company.description}
                  </div>
                )}
                {service.company.cost_center && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Centro de Costos: <span className="font-mono">{service.company.cost_center}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          {/* Manager Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Encargado
            </div>
            {service.manager ? (
              <div className="rounded-lg border p-4">
                <div className="font-medium">{service.manager.email}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Rol: <Badge variant="secondary">{service.manager.role}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin asignar</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Descripción
            </div>
            {service.description ? (
              <p className="text-sm leading-relaxed">{service.description}</p>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin descripción</p>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>{" "}
              {new Date(service.created_at).toLocaleString("es-PE")}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>{" "}
              {new Date(service.updated_at).toLocaleString("es-PE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
