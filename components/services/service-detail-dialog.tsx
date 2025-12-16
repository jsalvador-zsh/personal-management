"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, User, FileText, Activity, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Service, Company, User as AppUser, Worker } from "@/types"

export type ServiceWithDetails = Service & {
  company?: Company
  manager?: AppUser | null
}

type WorkerAssignment = {
  id: string
  worker_id: string
  service_id: string
  start_date: string
  end_date: string | null
  status: string
  worker?: Worker
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
  const [workers, setWorkers] = useState<WorkerAssignment[]>([])
  const [availableWorkers, setAvailableWorkers] = useState<Worker[]>([])
  const [loadingWorkers, setLoadingWorkers] = useState(false)
  const [loadingAvailable, setLoadingAvailable] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (open && service) {
      fetchWorkers()
      fetchAvailableWorkers()
    }
  }, [open, service])

  const fetchWorkers = async () => {
    if (!service) return

    setLoadingWorkers(true)
    try {
      const { data, error } = await supabase
        .from("worker_services")
        .select(`
          *,
          worker:workers(*)
        `)
        .eq("service_id", service.id)
        .order("start_date", { ascending: false })

      if (error) throw error

      setWorkers(data || [])
    } catch (error: any) {
      console.error("Error fetching workers:", error)
    } finally {
      setLoadingWorkers(false)
    }
  }

  const fetchAvailableWorkers = async () => {
    if (!service || !service.company_id) return

    setLoadingAvailable(true)
    try {
      // Obtener IDs de trabajadores ya asignados activamente a este servicio
      const { data: assignedData } = await supabase
        .from("worker_services")
        .select("worker_id")
        .eq("service_id", service.id)
        .eq("status", "activo")

      const assignedWorkerIds = (assignedData as any)?.map((a: any) => a.worker_id) || []

      // Obtener trabajadores homologados y vigentes de la misma empresa que NO estén asignados
      let query = supabase
        .from("workers")
        .select("*")
        .eq("company_id", service.company_id)
        .eq("is_homologated", true)
        .eq("homologation_status", "vigente")
        .eq("status", "habilitado")
        .order("full_name")

      // Excluir trabajadores ya asignados activamente
      if (assignedWorkerIds.length > 0) {
        query = query.not("id", "in", `(${assignedWorkerIds.join(",")})`)
      }

      const { data, error } = await query

      if (error) throw error

      setAvailableWorkers(data || [])
    } catch (error: any) {
      console.error("Error fetching available workers:", error)
    } finally {
      setLoadingAvailable(false)
    }
  }

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

          {/* Assigned Workers with Homologation Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Trabajadores Asignados ({workers.length})
            </div>
            {loadingWorkers ? (
              <p className="text-sm italic text-muted-foreground">Cargando trabajadores...</p>
            ) : workers.length > 0 ? (
              <div className="space-y-2">
                {workers.map((assignment) => {
                  const worker = assignment.worker
                  if (!worker) return null

                  const homologationTypeColors = {
                    medica: "info",
                    ocupacional: "warning",
                    seguridad: "error",
                    tecnica: "success",
                    especial: "#875A7B",
                  }

                  const homologationTypeLabels = {
                    medica: "🏥 Médica",
                    ocupacional: "👷 Ocupacional",
                    seguridad: "🛡️ Seguridad",
                    tecnica: "🔧 Técnica",
                    especial: "⭐ Especial",
                  }

                  const homologationStatusColors = {
                    vigente: "success",
                    pendiente: "warning",
                    vencida: "error",
                    suspendida: "secondary",
                  }

                  const homologationStatusLabels = {
                    vigente: "Vigente",
                    pendiente: "Pendiente",
                    vencida: "Vencida",
                    suspendida: "Suspendida",
                  }

                  return (
                    <div
                      key={assignment.id}
                      className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium">{worker.full_name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            DNI: {worker.dni} {worker.position && `• ${worker.position}`}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant={assignment.status === "activo" ? "success" : "secondary"}>
                              {assignment.status === "activo" ? "Activo" : "Inactivo"}
                            </Badge>
                            {worker.is_homologated && worker.homologation_type && (
                              <>
                                <Badge
                                  variant={homologationStatusColors[worker.homologation_status as keyof typeof homologationStatusColors] as any}
                                >
                                  Homologado: {homologationStatusLabels[worker.homologation_status as keyof typeof homologationStatusLabels]}
                                </Badge>
                                {worker.homologation_type === "especial" ? (
                                  <span
                                    className="text-xs font-medium px-2 py-1 rounded"
                                    style={{ backgroundColor: "#875A7B20", color: "#875A7B" }}
                                  >
                                    {homologationTypeLabels[worker.homologation_type]}
                                  </span>
                                ) : (
                                  <Badge variant="outline">
                                    {homologationTypeLabels[worker.homologation_type as keyof typeof homologationTypeLabels]}
                                  </Badge>
                                )}
                              </>
                            )}
                            {!worker.is_homologated && (
                              <Badge variant="secondary">Sin Homologación</Badge>
                            )}
                          </div>
                          {worker.is_homologated && worker.homologation_expiry && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Vence: {new Date(worker.homologation_expiry).toLocaleDateString("es-PE")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                No hay trabajadores asignados a este servicio
              </p>
            )}
          </div>

          <Separator />

          {/* Available Workers for Assignment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Trabajadores Disponibles para Asignar ({availableWorkers.length})
              </div>
              {service.company && (
                <Badge variant="outline" className="text-xs">
                  {service.company.name}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Trabajadores de la misma empresa con homologación vigente y sin asignación activa
            </p>
            {loadingAvailable ? (
              <p className="text-sm italic text-muted-foreground">Cargando trabajadores disponibles...</p>
            ) : availableWorkers.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableWorkers.map((worker) => {
                  const homologationTypeColors = {
                    medica: "info",
                    ocupacional: "warning",
                    seguridad: "error",
                    tecnica: "success",
                    especial: "#875A7B",
                  }

                  const homologationTypeLabels = {
                    medica: "🏥 Médica",
                    ocupacional: "👷 Ocupacional",
                    seguridad: "🛡️ Seguridad",
                    tecnica: "🔧 Técnica",
                    especial: "⭐ Especial",
                  }

                  return (
                    <div
                      key={worker.id}
                      className="rounded-lg border border-success/20 bg-success/5 p-4 hover:bg-success/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {worker.full_name}
                            <Badge variant="success" className="text-xs">
                              Disponible
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            DNI: {worker.dni} {worker.position && `• ${worker.position}`}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="success">
                              Homologación: Vigente
                            </Badge>
                            {worker.homologation_type && (
                              <>
                                {worker.homologation_type === "especial" ? (
                                  <span
                                    className="text-xs font-medium px-2 py-1 rounded"
                                    style={{ backgroundColor: "#875A7B20", color: "#875A7B" }}
                                  >
                                    {homologationTypeLabels[worker.homologation_type]}
                                  </span>
                                ) : (
                                  <Badge variant="outline">
                                    {homologationTypeLabels[worker.homologation_type as keyof typeof homologationTypeLabels]}
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                          {worker.homologation_expiry && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Vence: {new Date(worker.homologation_expiry).toLocaleDateString("es-PE")}
                              {(() => {
                                const daysUntilExpiry = Math.ceil(
                                  (new Date(worker.homologation_expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                )
                                return daysUntilExpiry <= 30 ? (
                                  <Badge variant="warning" className="ml-2 text-xs">
                                    Vence en {daysUntilExpiry} días
                                  </Badge>
                                ) : null
                              })()}
                            </div>
                          )}
                          {worker.homologation_entity && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Entidad: {worker.homologation_entity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">
                  No hay trabajadores disponibles
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  No se encontraron trabajadores de esta empresa con homologación vigente
                </p>
              </div>
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
