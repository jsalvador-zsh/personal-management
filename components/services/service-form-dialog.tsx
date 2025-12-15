"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { serviceSchema, type ServiceFormData } from "@/lib/validations/service"
import { createClient } from "@/lib/supabase/client"
import type { Service, Company, User } from "@/types"
import { toast } from "sonner"

interface ServiceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ServiceFormData) => void
  service?: Service | null
  isLoading?: boolean
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  service,
  isLoading = false,
}: ServiceFormDialogProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      company_id: service?.company_id || "",
      status: service?.status || "activo",
      manager_id: service?.manager_id || null,
    },
  })

  const company_id = watch("company_id")
  const status = watch("status")
  const manager_id = watch("manager_id")

  useEffect(() => {
    if (open) {
      fetchData()
      if (service) {
        reset({
          name: service.name,
          description: service.description || "",
          company_id: service.company_id,
          status: service.status,
          manager_id: service.manager_id || null,
        })
      } else {
        reset({
          name: "",
          description: "",
          company_id: "",
          status: "activo",
          manager_id: null,
        })
      }
    }
  }, [open, service, reset])

  const fetchData = async () => {
    setLoadingData(true)
    try {
      const [companiesResult, usersResult] = await Promise.all([
        supabase.from("companies").select("*").order("name"),
        supabase.from("users").select("*").order("email"),
      ])

      if (companiesResult.error) throw companiesResult.error
      if (usersResult.error) throw usersResult.error

      setCompanies(companiesResult.data || [])
      setUsers(usersResult.data || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar empresas y usuarios")
    } finally {
      setLoadingData(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
          <DialogDescription>
            {service
              ? "Actualiza los datos del servicio"
              : "Completa los datos para crear un nuevo servicio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Nombre del Servicio <span className="text-error">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Perforación Diamantina"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company_id">
                Empresa <span className="text-error">*</span>
              </Label>
              <Select
                value={company_id || "none"}
                onValueChange={(value) =>
                  setValue("company_id", value === "none" ? "" : value, {
                    shouldValidate: true,
                  })
                }
                disabled={loadingData || isLoading}
              >
                <SelectTrigger id="company_id">
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecciona una empresa</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && (
                <p className="text-xs text-error">{errors.company_id.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Estado <span className="text-error">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setValue("status", value as "activo" | "inactivo")}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-error">{errors.status.message}</p>}
            </div>

            {/* Manager */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="manager_id">Encargado (opcional)</Label>
              <Select
                value={manager_id || "none"}
                onValueChange={(value) =>
                  setValue("manager_id", value === "none" ? null : value)
                }
                disabled={loadingData || isLoading}
              >
                <SelectTrigger id="manager_id">
                  <SelectValue placeholder="Selecciona un encargado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin encargado</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.manager_id && (
                <p className="text-xs text-error">{errors.manager_id.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Describe el servicio..."
                rows={3}
                {...register("description")}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-xs text-error">{errors.description.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || loadingData}>
              {isLoading ? "Guardando..." : service ? "Actualizar" : "Crear Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
