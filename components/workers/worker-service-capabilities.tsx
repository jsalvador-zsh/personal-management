"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, Briefcase, TrendingUp, Clock, FileText, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Worker, Service, ProficiencyLevel } from "@/types"
import { toast } from "sonner"

interface WorkerServiceCapability {
  id: string
  worker_id: string
  service_id: string
  proficiency_level: ProficiencyLevel
  years_experience: number
  notes: string | null
  service?: Service
}

interface WorkerServiceCapabilitiesProps {
  worker: Worker
}

export function WorkerServiceCapabilities({ worker }: WorkerServiceCapabilitiesProps) {
  const [capabilities, setCapabilities] = useState<WorkerServiceCapability[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Form states
  const [selectedCapability, setSelectedCapability] = useState<WorkerServiceCapability | null>(null)
  const [formData, setFormData] = useState({
    service_id: "",
    proficiency_level: "basico" as ProficiencyLevel,
    years_experience: 0,
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch capabilities with service details
      const { data: capabilitiesData, error: capError } = await supabase
        .from("worker_service_capabilities")
        .select(`
          *,
          service:services(*)
        `)
        .eq("worker_id", worker.id)
        .order("created_at", { ascending: false })

      if (capError) throw capError

      // Fetch all services
      const { data: servicesData, error: servError } = await supabase
        .from("services")
        .select("*")
        .eq("status", "activo")
        .order("name")

      if (servError) throw servError

      setCapabilities(capabilitiesData || [])
      setServices(servicesData || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar las capacidades")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.service_id) {
      toast.error("Seleccione un servicio")
      return
    }

    setActionLoading(true)
    try {
      const capabilityData = {
        worker_id: worker.id,
        service_id: formData.service_id,
        proficiency_level: formData.proficiency_level,
        years_experience: formData.years_experience,
        notes: formData.notes || null,
      }

      const { error } = await (supabase
        .from("worker_service_capabilities") as any)
        .insert(capabilityData)

      if (error) throw error

      toast.success("Capacidad agregada exitosamente")
      await fetchData()
      setAddDialogOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Error adding capability:", error)
      if (error.message?.includes("duplicate key")) {
        toast.error("El trabajador ya tiene una capacidad registrada para este servicio")
      } else {
        toast.error("Error al agregar la capacidad")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedCapability) return

    setActionLoading(true)
    try {
      const updateData = {
        proficiency_level: formData.proficiency_level,
        years_experience: formData.years_experience,
        notes: formData.notes || null,
      }

      const { error } = await (supabase
        .from("worker_service_capabilities") as any)
        .update(updateData)
        .eq("id", selectedCapability.id)

      if (error) throw error

      toast.success("Capacidad actualizada exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedCapability(null)
      resetForm()
    } catch (error: any) {
      console.error("Error updating capability:", error)
      toast.error("Error al actualizar la capacidad")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCapability) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("worker_service_capabilities")
        .delete()
        .eq("id", selectedCapability.id)

      if (error) throw error

      toast.success("Capacidad eliminada exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedCapability(null)
    } catch (error: any) {
      console.error("Error deleting capability:", error)
      toast.error("Error al eliminar la capacidad")
    } finally {
      setActionLoading(false)
    }
  }

  const openAddDialog = () => {
    resetForm()
    setAddDialogOpen(true)
  }

  const openEditDialog = (capability: WorkerServiceCapability) => {
    setSelectedCapability(capability)
    setFormData({
      service_id: capability.service_id,
      proficiency_level: capability.proficiency_level,
      years_experience: capability.years_experience,
      notes: capability.notes || "",
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (capability: WorkerServiceCapability) => {
    setSelectedCapability(capability)
    setDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      service_id: "",
      proficiency_level: "basico",
      years_experience: 0,
      notes: "",
    })
  }

  const getProficiencyBadgeVariant = (level: ProficiencyLevel) => {
    switch (level) {
      case "basico": return "secondary"
      case "intermedio": return "default"
      case "avanzado": return "default"
      case "experto": return "default"
      default: return "secondary"
    }
  }

  const getProficiencyLabel = (level: ProficiencyLevel) => {
    switch (level) {
      case "basico": return "Básico"
      case "intermedio": return "Intermedio"
      case "avanzado": return "Avanzado"
      case "experto": return "Experto"
      default: return level
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando capacidades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Capacidades de Servicio</h3>
          <p className="text-sm text-muted-foreground">
            Servicios que {worker.full_name} está capacitado para brindar
          </p>
        </div>
        <Button onClick={openAddDialog} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Capacidad
        </Button>
      </div>

      {/* Capabilities List */}
      {capabilities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              No hay capacidades de servicio registradas
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Agrega servicios para los que este trabajador está capacitado
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map((capability) => (
            <Card key={capability.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Service Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-brand" />
                        <h4 className="font-semibold">{capability.service?.name}</h4>
                      </div>
                      {capability.service?.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {capability.service.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(capability)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteDialog(capability)}
                      >
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
                    </div>
                  </div>

                  {/* Proficiency and Experience */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge variant={getProficiencyBadgeVariant(capability.proficiency_level)}>
                        {getProficiencyLabel(capability.proficiency_level)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {capability.years_experience} {capability.years_experience === 1 ? "año" : "años"}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {capability.notes && (
                    <div className="flex items-start gap-1.5 text-sm">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        {capability.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Capacidad de Servicio</DialogTitle>
            <DialogDescription>
              Define un servicio que {worker.full_name} está capacitado para brindar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-service">
                Servicio <span className="text-error">*</span>
              </Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              >
                <SelectTrigger id="add-service">
                  <SelectValue placeholder="Seleccione un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter(s => !capabilities.some(c => c.service_id === s.id))
                    .map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-proficiency">
                Nivel de Competencia <span className="text-error">*</span>
              </Label>
              <Select
                value={formData.proficiency_level}
                onValueChange={(value: ProficiencyLevel) =>
                  setFormData({ ...formData, proficiency_level: value })
                }
              >
                <SelectTrigger id="add-proficiency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                  <SelectItem value="experto">Experto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-experience">Años de Experiencia</Label>
              <Input
                id="add-experience"
                type="number"
                min="0"
                value={formData.years_experience}
                onChange={(e) =>
                  setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-notes">Notas (opcional)</Label>
              <Textarea
                id="add-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalles adicionales sobre esta capacidad..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={actionLoading}>
              {actionLoading ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Capacidad de Servicio</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la capacidad para{" "}
              {selectedCapability?.service?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Servicio</Label>
              <Input
                value={selectedCapability?.service?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-proficiency">
                Nivel de Competencia <span className="text-error">*</span>
              </Label>
              <Select
                value={formData.proficiency_level}
                onValueChange={(value: ProficiencyLevel) =>
                  setFormData({ ...formData, proficiency_level: value })
                }
              >
                <SelectTrigger id="edit-proficiency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                  <SelectItem value="experto">Experto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-experience">Años de Experiencia</Label>
              <Input
                id="edit-experience"
                type="number"
                min="0"
                value={formData.years_experience}
                onChange={(e) =>
                  setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notas (opcional)</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalles adicionales sobre esta capacidad..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={actionLoading}>
              {actionLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la capacidad de{" "}
              <strong>{selectedCapability?.service?.name}</strong>? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
