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
import { Building2, FileText, Calendar, Briefcase } from "lucide-react"
import type { Company } from "@/types"

interface CompanyDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
}

export function CompanyDetailDialog({
  open,
  onOpenChange,
  company,
}: CompanyDetailDialogProps) {
  if (!company) return null

  const modeLabels = {
    presencial: "Presencial",
    remoto: "Remoto",
    hibrido: "Híbrido"
  }

  const modeVariants = {
    presencial: "default",
    remoto: "info",
    hibrido: "warning"
  } as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Empresa</DialogTitle>
          <DialogDescription>
            Información completa de la empresa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{company.name}</h3>
              {company.cost_center && (
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  Centro de Costo: {company.cost_center}
                </p>
              )}
              <div className="mt-2">
                <Badge variant={modeVariants[company.work_mode]}>
                  {modeLabels[company.work_mode]}
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
                {company.description || (
                  <span className="italic text-muted-foreground">Sin descripción</span>
                )}
              </p>
            </div>

            {/* Cost Center */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Centro de Costo
              </div>
              <p className="text-sm font-mono">
                {company.cost_center || (
                  <span className="italic text-muted-foreground">Sin asignar</span>
                )}
              </p>
            </div>

            {/* Work Mode */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Modalidad de Trabajo
              </div>
              <Badge variant={modeVariants[company.work_mode]}>
                {modeLabels[company.work_mode]}
              </Badge>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Registro
              </div>
              <p className="text-sm">
                {new Date(company.created_at).toLocaleDateString("es-PE", {
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
                {new Date(company.updated_at).toLocaleDateString("es-PE", {
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
