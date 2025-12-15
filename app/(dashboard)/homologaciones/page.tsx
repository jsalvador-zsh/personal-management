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
import { Plus, GitMerge, Loader2 } from "lucide-react"
import { HomologationTable } from "@/components/homologations/homologation-table"
import { HomologationFormDialog } from "@/components/homologations/homologation-form-dialog"
import { HomologationDetailDialog, type HomologationWithDetails } from "@/components/homologations/homologation-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Homologation } from "@/types"
import type { HomologationFormData } from "@/lib/validations/homologation"
import { toast } from "sonner"

export default function HomologacionesPage() {
  const [homologations, setHomologations] = useState<HomologationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedHomologation, setSelectedHomologation] = useState<HomologationWithDetails | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("homologations")
        .select(`
          *,
          company:companies(*),
          course:courses(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setHomologations(data || [])
    } catch (error: any) {
      console.error("Error fetching homologations:", error)
      toast.error("Error al cargar las homologaciones")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: HomologationFormData) => {
    setActionLoading(true)
    try {
      const homologationData = {
        company_id: data.company_id,
        course_id: data.course_id,
        is_required: data.is_required,
      }

      const { error } = await (supabase.from("homologations") as any).insert(homologationData).select()
      if (error) throw error

      toast.success("Homologación creada exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating homologation:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear homologaciones")
      } else if (error.message?.includes("duplicate")) {
        toast.error("Esta homologación ya existe")
      } else {
        toast.error(`Error: ${error.message || "Error al crear la homologación"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: HomologationFormData) => {
    if (!selectedHomologation) return

    setActionLoading(true)
    try {
      const homologationData = {
        company_id: data.company_id,
        course_id: data.course_id,
        is_required: data.is_required,
      }

      const { error } = await (supabase
        .from("homologations") as any)
        .update(homologationData)
        .eq("id", selectedHomologation.id)

      if (error) throw error

      toast.success("Homologación actualizada exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedHomologation(null)
    } catch (error: any) {
      console.error("Error updating homologation:", error)
      toast.error(`Error: ${error.message || "Error al actualizar la homologación"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedHomologation) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("homologations")
        .delete()
        .eq("id", selectedHomologation.id)

      if (error) throw error

      toast.success("Homologación eliminada exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedHomologation(null)
    } catch (error: any) {
      console.error("Error deleting homologation:", error)
      toast.error("Error al eliminar la homologación")
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (homologation: Homologation) => {
    const homWithDetails = homologations.find((h) => h.id === homologation.id)
    setSelectedHomologation(homWithDetails || null)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (homologation: Homologation) => {
    setSelectedHomologation(homologation as HomologationWithDetails)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (homologation: Homologation) => {
    setSelectedHomologation(homologation as HomologationWithDetails)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando homologaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Homologaciones</h1>
          <p className="text-muted-foreground mt-1">
            Cursos requeridos por empresa
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Homologación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Lista de Homologaciones ({homologations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HomologationTable
            data={homologations}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <HomologationFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      <HomologationFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        homologation={selectedHomologation}
        isLoading={actionLoading}
      />

      <HomologationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        homologation={selectedHomologation}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta homologación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
