"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Users, Loader2 } from "lucide-react"
import { WorkerTable, type WorkerWithCompany } from "@/components/workers/worker-table"
import { WorkerFormDialog } from "@/components/workers/worker-form-dialog"
import { WorkerDetailDialog } from "@/components/workers/worker-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Worker, Company, WorkerInsert } from "@/types"
import type { WorkerFormData } from "@/lib/validations/worker"
import { toast } from "sonner"

export default function TrabajadoresPage() {
  const [workers, setWorkers] = useState<WorkerWithCompany[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch workers with company info
      const { data: workersData, error: workersError } = await supabase
        .from("workers")
        .select(`
          *,
          company:companies(*)
        `)
        .order("created_at", { ascending: false })

      if (workersError) throw workersError

      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("*")
        .order("name")

      if (companiesError) throw companiesError

      setWorkers(workersData || [])
      setCompanies(companiesData || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: WorkerFormData) => {
    setActionLoading(true)
    try {
      const workerData = {
        // Campos básicos
        dni: data.dni,
        full_name: data.full_name,
        phone: data.phone || null,
        email: data.email || null,
        position: data.position || null,
        company_id: data.company_id || null,
        status: data.status,
        photo_url: data.photo_url || null,

        // Información Personal Extendida
        pais: data.pais || null,
        sexo: data.sexo || null,
        estado_civil: data.estado_civil || null,
        fecha_nacimiento: data.fecha_nacimiento || null,
        correo_personal: data.correo_personal || null,
        domicilio: data.domicilio || null,
        telefono_fijo: data.telefono_fijo || null,

        // Información Profesional Extendida
        carrera_profesional: data.carrera_profesional || null,
        fecha_inicio: data.fecha_inicio || null,
        fecha_cese: data.fecha_cese || null,
        sitio: data.sitio || null,
        area: data.area || null,
        local: data.local || null,
        condiciones_trabajo: data.condiciones_trabajo || null,

        // Campos de Homologación
        is_homologated: data.is_homologated || false,
        homologation_type: data.homologation_type || null,
        homologation_date: data.homologation_date || null,
        homologation_expiry: data.homologation_expiry || null,
        homologation_entity: data.homologation_entity || null,
        homologation_certificate_number: data.homologation_certificate_number || null,
        homologation_document_url: data.homologation_document_url || null,
        homologation_status: data.homologation_status || "pendiente",
        homologation_notes: data.homologation_notes || null,

        // Campos específicos para homologación médica
        medical_restrictions: data.medical_restrictions || null,
        medical_observations: data.medical_observations || null,
        blood_type: data.blood_type || null,

        // Campos específicos para homologación ocupacional
        occupational_level: data.occupational_level || null,
        occupational_specialization: data.occupational_specialization || null,

        // Campos específicos para homologación de seguridad
        safety_training_hours: data.safety_training_hours || null,
        safety_certifications: data.safety_certifications || null,

        // Campos específicos para homologación técnica
        technical_skills: data.technical_skills || null,
        technical_equipment_authorized: data.technical_equipment_authorized || null,

        // Campos específicos para homologación especial
        special_authorization_number: data.special_authorization_number || null,
        special_authorization_scope: data.special_authorization_scope || null,
        special_restrictions: data.special_restrictions || null,
      }

      console.log("Creating worker with data:", workerData)

      const { data: insertedData, error } = await (supabase.from("workers") as any).insert(workerData).select()

      console.log("Insert result:", { insertedData, error })

      if (error) {
        console.error("Supabase error details:", error)
        throw error
      }

      toast.success("Trabajador creado exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating worker:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      console.error("Error details:", error.details)
      console.error("Error hint:", error.hint)

      if (error.message?.includes("duplicate key")) {
        toast.error("Ya existe un trabajador con ese DNI")
      } else if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear trabajadores. Verifica tu rol de usuario.")
      } else if (error.code === "PGRST301") {
        toast.error("Error de permisos (RLS). Contacta al administrador.")
      } else {
        toast.error(`Error: ${error.message || "Error al crear el trabajador"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: WorkerFormData) => {
    if (!selectedWorker) return

    setActionLoading(true)
    try {
      const workerData = {
        // Campos básicos
        dni: data.dni,
        full_name: data.full_name,
        phone: data.phone || null,
        email: data.email || null,
        position: data.position || null,
        company_id: data.company_id || null,
        status: data.status,
        photo_url: data.photo_url || null,

        // Información Personal Extendida
        pais: data.pais || null,
        sexo: data.sexo || null,
        estado_civil: data.estado_civil || null,
        fecha_nacimiento: data.fecha_nacimiento || null,
        correo_personal: data.correo_personal || null,
        domicilio: data.domicilio || null,
        telefono_fijo: data.telefono_fijo || null,

        // Información Profesional Extendida
        carrera_profesional: data.carrera_profesional || null,
        fecha_inicio: data.fecha_inicio || null,
        fecha_cese: data.fecha_cese || null,
        sitio: data.sitio || null,
        area: data.area || null,
        local: data.local || null,
        condiciones_trabajo: data.condiciones_trabajo || null,

        // Campos de Homologación
        is_homologated: data.is_homologated || false,
        homologation_type: data.homologation_type || null,
        homologation_date: data.homologation_date || null,
        homologation_expiry: data.homologation_expiry || null,
        homologation_entity: data.homologation_entity || null,
        homologation_certificate_number: data.homologation_certificate_number || null,
        homologation_document_url: data.homologation_document_url || null,
        homologation_status: data.homologation_status || "pendiente",
        homologation_notes: data.homologation_notes || null,

        // Campos específicos para homologación médica
        medical_restrictions: data.medical_restrictions || null,
        medical_observations: data.medical_observations || null,
        blood_type: data.blood_type || null,

        // Campos específicos para homologación ocupacional
        occupational_level: data.occupational_level || null,
        occupational_specialization: data.occupational_specialization || null,

        // Campos específicos para homologación de seguridad
        safety_training_hours: data.safety_training_hours || null,
        safety_certifications: data.safety_certifications || null,

        // Campos específicos para homologación técnica
        technical_skills: data.technical_skills || null,
        technical_equipment_authorized: data.technical_equipment_authorized || null,

        // Campos específicos para homologación especial
        special_authorization_number: data.special_authorization_number || null,
        special_authorization_scope: data.special_authorization_scope || null,
        special_restrictions: data.special_restrictions || null,
      }

      const { error } = await (supabase
        .from("workers") as any)
        .update(workerData)
        .eq("id", selectedWorker.id)

      if (error) throw error

      toast.success("Trabajador actualizado exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedWorker(null)
    } catch (error: any) {
      console.error("Error updating worker:", error)
      if (error.message?.includes("duplicate key")) {
        toast.error("Ya existe un trabajador con ese DNI")
      } else {
        toast.error("Error al actualizar el trabajador")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedWorker) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("workers")
        .delete()
        .eq("id", selectedWorker.id)

      if (error) throw error

      toast.success("Trabajador eliminado exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedWorker(null)
    } catch (error: any) {
      console.error("Error deleting worker:", error)
      toast.error("Error al eliminar el trabajador")
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (worker: Worker) => {
    setSelectedWorker(worker)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (worker: Worker) => {
    setSelectedWorker(worker)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (worker: Worker) => {
    setSelectedWorker(worker)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando trabajadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Trabajadores</h1>
          <p className="text-muted-foreground mt-1">
            Administra el personal y sus datos
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Trabajador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Trabajadores ({workers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkerTable
            data={workers}
            companies={companies}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <WorkerFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        companies={companies}
        isLoading={actionLoading}
      />

      {/* Edit Dialog */}
      <WorkerFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        worker={selectedWorker}
        companies={companies}
        isLoading={actionLoading}
      />

      {/* Detail Dialog */}
      <WorkerDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        worker={selectedWorker as WorkerWithCompany}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al trabajador{" "}
              <strong>{selectedWorker?.full_name}</strong>? Esta acción no se puede
              deshacer.
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
