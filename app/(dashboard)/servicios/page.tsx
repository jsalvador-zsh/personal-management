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
import { Plus, Briefcase, Loader2, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ServiceTable } from "@/components/services/service-table"
import { ServiceFormDialog } from "@/components/services/service-form-dialog"
import { ServiceDetailDialog, type ServiceWithDetails } from "@/components/services/service-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Service, Company } from "@/types"
import type { ServiceFormData } from "@/lib/validations/service"
import { toast } from "sonner"

export default function ServiciosPage() {
  const [services, setServices] = useState<ServiceWithDetails[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceWithDetails[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [selectedService, setSelectedService] = useState<ServiceWithDetails | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
    fetchCompanies()
  }, [])

  useEffect(() => {
    filterServices()
  }, [selectedCompany, services])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          company:companies(*),
          manager:users(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setServices(data || [])
    } catch (error: any) {
      console.error("Error fetching services:", error)
      toast.error("Error al cargar los servicios")
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name")

      if (error) throw error

      setCompanies(data || [])
    } catch (error: any) {
      console.error("Error fetching companies:", error)
    }
  }

  const filterServices = () => {
    if (selectedCompany === "all") {
      setFilteredServices(services)
    } else {
      const filtered = services.filter(
        (service) => service.company_id === selectedCompany
      )
      setFilteredServices(filtered)
    }
  }

  const handleCreate = async (data: ServiceFormData) => {
    setActionLoading(true)
    try {
      const serviceData = {
        name: data.name,
        description: data.description || null,
        company_id: data.company_id,
        status: data.status,
        manager_id: data.manager_id || null,
      }

      const { error } = await (supabase.from("services") as any).insert(serviceData).select()

      if (error) throw error

      toast.success("Servicio creado exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating service:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear servicios")
      } else {
        toast.error(`Error: ${error.message || "Error al crear el servicio"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: ServiceFormData) => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const serviceData = {
        name: data.name,
        description: data.description || null,
        company_id: data.company_id,
        status: data.status,
        manager_id: data.manager_id || null,
      }

      const { error } = await (supabase
        .from("services") as any)
        .update(serviceData)
        .eq("id", selectedService.id)

      if (error) throw error

      toast.success("Servicio actualizado exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedService(null)
    } catch (error: any) {
      console.error("Error updating service:", error)
      toast.error(`Error: ${error.message || "Error al actualizar el servicio"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", selectedService.id)

      if (error) throw error

      toast.success("Servicio eliminado exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedService(null)
    } catch (error: any) {
      console.error("Error deleting service:", error)
      toast.error("Error al eliminar el servicio")
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (service: Service) => {
    const serviceWithDetails = services.find((s) => s.id === service.id)
    setSelectedService(serviceWithDetails || null)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setSelectedService(service as ServiceWithDetails)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service as ServiceWithDetails)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
          <p className="text-muted-foreground mt-1">
            Catálogo de servicios y asignación de personal
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Company Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="company-filter">Filtrar por Empresa</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company-filter" className="mt-2">
                  <SelectValue placeholder="Seleccione una empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las empresas</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{filteredServices.length} servicios</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Lista de Servicios ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceTable
            data={filteredServices}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ServiceFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      {/* Edit Dialog */}
      <ServiceFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        service={selectedService}
        isLoading={actionLoading}
      />

      {/* Detail Dialog */}
      <ServiceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        service={selectedService}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el servicio{" "}
              <strong>{selectedService?.name}</strong>? Esta acción no se puede deshacer.
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
