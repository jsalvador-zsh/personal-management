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
import { Plus, Building2, Loader2 } from "lucide-react"
import { CompanyTable } from "@/components/companies/company-table"
import { CompanyFormDialog } from "@/components/companies/company-form-dialog"
import { CompanyDetailDialog } from "@/components/companies/company-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Company } from "@/types"
import type { CompanyFormData } from "@/lib/validations/company"
import { toast } from "sonner"

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setCompanies(data || [])
    } catch (error: any) {
      console.error("Error fetching companies:", error)
      toast.error("Error al cargar las empresas")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CompanyFormData) => {
    setActionLoading(true)
    try {
      const companyData = {
        name: data.name,
        description: data.description || null,
        cost_center: data.cost_center || null,
        work_mode: data.work_mode,
      }

      const { error } = await (supabase.from("companies") as any).insert(companyData).select()

      if (error) throw error

      toast.success("Empresa creada exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating company:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear empresas")
      } else {
        toast.error(`Error: ${error.message || "Error al crear la empresa"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: CompanyFormData) => {
    if (!selectedCompany) return

    setActionLoading(true)
    try {
      const companyData = {
        name: data.name,
        description: data.description || null,
        cost_center: data.cost_center || null,
        work_mode: data.work_mode,
      }

      const { error } = await (supabase
        .from("companies") as any)
        .update(companyData)
        .eq("id", selectedCompany.id)

      if (error) throw error

      toast.success("Empresa actualizada exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedCompany(null)
    } catch (error: any) {
      console.error("Error updating company:", error)
      toast.error(`Error: ${error.message || "Error al actualizar la empresa"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCompany) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", selectedCompany.id)

      if (error) throw error

      toast.success("Empresa eliminada exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedCompany(null)
    } catch (error: any) {
      console.error("Error deleting company:", error)
      if (error.message?.includes("violates foreign key constraint")) {
        toast.error("No se puede eliminar la empresa porque tiene trabajadores asignados")
      } else {
        toast.error("Error al eliminar la empresa")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (company: Company) => {
    setSelectedCompany(company)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando empresas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Empresas</h1>
          <p className="text-muted-foreground mt-1">
            Administra las unidades mineras y centros de costo
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Lista de Empresas ({companies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyTable
            data={companies}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CompanyFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      {/* Edit Dialog */}
      <CompanyFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        company={selectedCompany}
        isLoading={actionLoading}
      />

      {/* Detail Dialog */}
      <CompanyDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        company={selectedCompany}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la empresa{" "}
              <strong>{selectedCompany?.name}</strong>? Esta acción no se puede
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
