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
import { Plus, Award, Loader2 } from "lucide-react"
import { CertificationTable } from "@/components/certifications/certification-table"
import { CertificationFormDialog } from "@/components/certifications/certification-form-dialog"
import { CertificationDetailDialog, type CertificationWithDetails } from "@/components/certifications/certification-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Certification } from "@/types"
import type { CertificationFormData } from "@/lib/validations/certification"
import { toast } from "sonner"

export default function CertificacionesPage() {
  const [certifications, setCertifications] = useState<CertificationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [selectedCertification, setSelectedCertification] = useState<CertificationWithDetails | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select(`
          *,
          worker:workers(*),
          course:courses(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setCertifications(data || [])
    } catch (error: any) {
      console.error("Error fetching certifications:", error)
      toast.error("Error al cargar las certificaciones")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CertificationFormData) => {
    setActionLoading(true)
    try {
      const certificationData = {
        worker_id: data.worker_id,
        course_id: data.course_id,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        document_url: data.document_url || null,
      }

      const { error } = await (supabase.from("certifications") as any).insert(certificationData).select()

      if (error) throw error

      toast.success("Certificación creada exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating certification:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear certificaciones")
      } else {
        toast.error(`Error: ${error.message || "Error al crear la certificación"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: CertificationFormData) => {
    if (!selectedCertification) return

    setActionLoading(true)
    try {
      const certificationData = {
        worker_id: data.worker_id,
        course_id: data.course_id,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        document_url: data.document_url || null,
      }

      const { error } = await (supabase
        .from("certifications") as any)
        .update(certificationData)
        .eq("id", selectedCertification.id)

      if (error) throw error

      toast.success("Certificación actualizada exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedCertification(null)
    } catch (error: any) {
      console.error("Error updating certification:", error)
      toast.error(`Error: ${error.message || "Error al actualizar la certificación"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCertification) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", selectedCertification.id)

      if (error) throw error

      toast.success("Certificación eliminada exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedCertification(null)
    } catch (error: any) {
      console.error("Error deleting certification:", error)
      toast.error("Error al eliminar la certificación")
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (certification: Certification) => {
    const certWithDetails = certifications.find((c) => c.id === certification.id)
    setSelectedCertification(certWithDetails || null)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (certification: Certification) => {
    setSelectedCertification(certification as CertificationWithDetails)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (certification: Certification) => {
    setSelectedCertification(certification as CertificationWithDetails)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando certificaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificaciones</h1>
          <p className="text-muted-foreground mt-1">
            Administra las certificaciones de los trabajadores
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Certificación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Lista de Certificaciones ({certifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertificationTable
            data={certifications}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CertificationFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      {/* Edit Dialog */}
      <CertificationFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        certification={selectedCertification}
        isLoading={actionLoading}
      />

      {/* Detail Dialog */}
      <CertificationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        certification={selectedCertification}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta certificación?{" "}
              {selectedCertification?.worker && (
                <>
                  para <strong>{selectedCertification.worker.full_name}</strong>
                </>
              )}
              {" "}Esta acción no se puede deshacer.
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
